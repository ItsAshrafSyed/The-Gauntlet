import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "blake3";
import { PublicKey } from "@solana/web3.js";
import { CHALLENGER_PUBKEY } from "../../../util/constants";
import { createWorkspace } from "../../../util/api";
import { on } from "events";

const prisma = new PrismaClient();

interface createSubmissionPayload {
	challengeId: number;
	content: string;
	pubKey?: string;
	authorPubKey: string;
	challengePubKey: string;
}
interface updateSubmissionPayload {
	id: number;
	pubKey: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "POST": {
			return await createSubmission(req, res);
		}
		case "PUT": {
			return await updateSubmission(req, res);
		}
		case "GET": {
			return await getSubmissionsForChallenge(req, res);
		}

		default: {
			return res.status(405).json({ message: "Method not allowed" });
		}
	}
}

async function createSubmission(req: NextApiRequest, res: NextApiResponse) {
	const data = req.body as createSubmissionPayload;
	if (!data.challengePubKey || typeof data.challengePubKey !== "string") {
		return res.status(400).json({ message: "Invalid challengePubKey" });
	}
	try {
		const contentHash = new PublicKey(hash(data.content) as Buffer).toBase58();
		const submission = await prisma.submission.create({
			data: {
				content: data.content,
				contentHash: contentHash,
				authorPubKey: data.authorPubKey,
				challengePubKey: data.challengePubKey,
				challengeId: data.challengeId,
				challengerPubKey: CHALLENGER_PUBKEY.toBase58(),
			},
		});

		res.status(200).json({ data: submission });
	} catch (error) {
		console.error("Request error", error);
		res.status(500).json({
			error: "Error creating answer",
		});
	}
}

async function updateSubmission(req: NextApiRequest, res: NextApiResponse) {
	const data = req.body as updateSubmissionPayload;
	try {
		const submission = await prisma.submission.update({
			where: {
				id: data.id,
			},
			data: {
				pubKey: data.pubKey,
			},
		});

		return res.status(200).json({ data: submission });
	} catch (e) {
		console.error("Request error", e);
		res.status(500).json({ error: "Error updating submission" });
	}
}

async function getSubmissionsForChallenge(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { challengeId } = req.query;
	const { program } = createWorkspace();

	if (!challengeId || typeof challengeId !== "string") {
		return res.status(400).json({ message: "Invalid challengeId" });
	}

	try {
		const submissions = await prisma.submission.findMany({
			where: {
				challengeId: parseInt(challengeId),
			},
			select: {
				id: true,
				content: true,
				pubKey: true,
				authorPubKey: true,
				dateUpdated: true,
			},
		});

		let submissionsWithOnChainData = await Promise.all(
			submissions.map(async (submission) => {
				if (!submission.pubKey) return null;
				const submissionPubKey = new PublicKey(submission.pubKey);
				const onChainData = await program.account.submission.fetchNullable(
					submissionPubKey
				);
				if (!onChainData) return null;

				return onChainData
					? {
							...submission,
					  }
					: null;
			})
		);

		submissionsWithOnChainData = submissionsWithOnChainData.filter(
			(submission) => submission !== null
		);

		const profilesToGet = submissionsWithOnChainData.reduce(
			(acc, submission) => {
				if (
					submission?.authorPubKey &&
					!acc.includes(submission.authorPubKey)
				) {
					acc.push(submission.authorPubKey);
				}
				return acc;
			},
			[] as string[]
		);

		const profiles = await prisma.userProfile.findMany({
			where: {
				pubKey: {
					in: profilesToGet,
				},
			},
			select: {
				pubKey: true,
				avatarUrl: true,
			},
		});

		const decorated = submissionsWithOnChainData.map((submission) => {
			const profile = profiles.find(
				(profile) => profile.pubKey === submission?.authorPubKey
			);
			return {
				...submission,
				avatarUrl: profile?.avatarUrl ?? null,
			};
		});

		return res.status(200).json({ data: { submissions: decorated } });
	} catch (error) {
		console.error("Request error", error);
		res.status(500).json({
			error: "Error getting submissions",
		});
	}
}
