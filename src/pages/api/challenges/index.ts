import { Tags } from "./../../../util/challengerSdk/challenger.client";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { hash } from "blake3";
import { getDisplayStringFromTag } from "../../../util/lib";
import { CHALLENGER_PUBKEY } from "../../../util/constants";
import { createWorkspace } from "../../../util/api";

const prisma = new PrismaClient();

interface createChallengePayload {
	title: string;
	content: string;
	tags: string;
	reputation: string;
	authorPubKey: string;
	challengePeriod: string;
}

interface updateChallengePayload {
	id: number;
	pubKey: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "POST": {
			return await createChallenge(req, res);
		}
		case "PUT": {
			return await updateChallenge(req, res);
		}
		case "GET": {
			return await getChallenges(req, res);
		}
		default: {
			return res.status(405).json({ message: "Method not allowed" });
		}
	}
}

async function createChallenge(req: NextApiRequest, res: NextApiResponse) {
	const data = req.body as createChallengePayload;
	try {
		const contentHash = new PublicKey(hash(data.content) as Buffer).toBase58();
		const challenge = await prisma.challenge.create({
			data: {
				title: data.title,
				content: data.content,
				contentHash,
				tags: data.tags,
				reputation: data.reputation,
				authorPubKey: data.authorPubKey,
				challengePeriod: data.challengePeriod,
				challengerPubKey: CHALLENGER_PUBKEY.toBase58(),
			},
		});
		console.log("after creating", challenge);
		return res.status(200).json({ data: challenge });
	} catch (e) {
		console.error("Request error", e);
		res.status(500).json({ error: "Error creating challenge" });
	}
}

async function updateChallenge(req: NextApiRequest, res: NextApiResponse) {
	const data = req.body as updateChallengePayload;

	try {
		const challenge = await prisma.challenge.update({
			where: {
				id: data.id,
			},
			data: {
				pubKey: data.pubKey,
			},
		});
		console.log("after updating", challenge);
		return res.status(200).json({ data: challenge });
	} catch (e) {
		console.error("Request error", e);
		res.status(500).json({ error: "Error updating challenge" });
	}
}

async function getChallenges(req: NextApiRequest, res: NextApiResponse) {
	try {
		const challenges = await prisma.challenge.findMany({
			select: {
				id: true,
				title: true,
				content: true,
				pubKey: true,
				authorPubKey: true,
				dateUpdated: true,
				tags: true,
				reputation: true,
			},
			// skip: offset, // Skip the first N challenges based on offset
			// take: pageSize, // Retrieve up to pageSize challenges
		});
		let challengesWithOnChainData = await Promise.all(
			challenges.map(async (challenge) => {
				if (!challenge.pubKey) return null;
				// const challengePubKey = new PublicKey(challenge.pubKey);
				// const onChainData = await program.account.challenge.fetchNullable(
				// 	challengePubKey
				// );
				// if (!onChainData) return null;

				// const tagsAsStrings = onChainData?.tags
				// 	.map((tag) => {
				// 		return getDisplayStringFromTag(Object.keys(tag)[0]);
				// 	})
				// 	.filter((tag) => tag !== null);

				return challenge;

				// return onChainData
				// 	? {
				// 			...challenge,
				// 			pubKey: challengePubKey.toBase58(),
				// 			reputation: onChainData.reputation.toNumber(),
				// 			tags: tagsAsStrings,
				// 			challengeExpiration: onChainData.challengeExpiresTs.toNumber(),
				// 	  }
				// 	: null;
			})
		);
		challengesWithOnChainData = challengesWithOnChainData.filter(
			(challenge) => challenge !== null
		);

		const profilesToGet = challengesWithOnChainData.reduce((acc, challenge) => {
			if (challenge?.authorPubKey && !acc.includes(challenge.authorPubKey)) {
				acc.push(challenge.authorPubKey);
			}
			return acc;
		}, [] as string[]);

		const profiles = await prisma.userProfile.findMany({
			where: {
				pubKey: {
					in: profilesToGet,
				},
			},
			select: {
				pubKey: true,
				username: true,
				avatarUrl: true,
			},
		});

		const decorated = challengesWithOnChainData.map((challenge) => {
			const profile = profiles.find(
				(profile) => profile.pubKey === challenge?.authorPubKey
			);

			return {
				...challenge,
				avatarUrl: profile?.avatarUrl ?? null,
				username: profile?.username ?? null,
			};
		});
		return res.status(200).json({
			data: {
				challenges: decorated,
			},
		});
	} catch (error) {
		console.error("Request error", error);
		res.status(500).json({
			error: "Error getting question",
		});
	}
}
