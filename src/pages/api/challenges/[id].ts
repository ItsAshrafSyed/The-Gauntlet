import { PrismaClient } from "@prisma/client";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";
import { createWorkspace } from "../../../util/api";
import { getDisplayStringFromTag } from "../../../util/lib";

const prisma = new PrismaClient();

interface updateChallengePayload {
	title: string;
	content: string;
	contentHash: string;
	tags: string;
	reputation: string;
	authorPubKey: string;
	challengePeriod: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "GET": {
			return await getChallenge(req, res);
		}
		case "PUT": {
			return await updateChallenge(req, res);
		}
		default: {
			return res.status(405).json({ message: "Method not allowed" });
		}
	}
}

async function getChallenge(req: NextApiRequest, res: NextApiResponse) {
	const { program } = createWorkspace();

	const { id } = req.query;

	if (!id || typeof id !== "string") {
		return res.status(400).json({ message: "Invalid id" });
	}

	try {
		const challenge = await prisma.challenge.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		const onChainData = await program?.account.challenge.fetchNullable(
			new PublicKey(challenge?.pubKey ?? "")
		);

		if (!challenge || !onChainData) {
			return res.status(404).json({ message: "Challenge not found" });
		}

		const tagsAsStrings = onChainData?.tags
			.map((tag) => {
				return getDisplayStringFromTag(Object.keys(tag)[0]);
			})
			.filter((tag) => tag !== null);

		res.status(200).json({
			data: {
				challenge: {
					...challenge,
					tags: [tagsAsStrings?.length ? tagsAsStrings : []],
					reputation: onChainData?.reputation.toNumber(),
					contentDataUrl: onChainData?.contentDataUrl,
				},
			},
		});
	} catch (error) {
		console.error("Request error", error);
		res.status(500).json({
			error: "Error getting question",
		});
	}
}

async function updateChallenge(req: NextApiRequest, res: NextApiResponse) {
	const { program, provider } = createWorkspace();

	const { id } = req.query;

	if (!id || typeof id !== "string") {
		return res.status(400).json({ message: "Invalid id" });
	}
	const data = req.body as updateChallengePayload;
	try {
		const challenge = await prisma.challenge.update({
			where: {
				id: parseInt(id),
			},
			data: {
				title: data.title,
				content: data.content,
				contentHash: data.contentHash,
				tags: data.tags,
				reputation: data.reputation,
				authorPubKey: data.authorPubKey,
				challengePeriod: data.challengePeriod,
			},
		});
		return res.status(200).json({ data: challenge });
	} catch (error) {
		console.error("Request error", error);
		res.status(500).json({
			error: "Error getting question",
		});
	}
}
