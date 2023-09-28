import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import {
	CHALLENGER_PROGRAM_ID,
	CHALLENGER_PUBKEY,
	CRUX_KEY,
} from "../../../util/constants";
import { PublicKey } from "@solana/web3.js";
import { createWorkspace } from "../../../util/api";

const prisma = new PrismaClient();

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "GET": {
			return await getUser(req, res);
		}
		default: {
			return res.status(405).json({ message: "Method not allowed" });
		}
	}
}

async function getUser(req: NextApiRequest, res: NextApiResponse) {
	const { pubKey } = req.query;

	if (!pubKey || typeof pubKey !== "string") {
		return res.status(400).json({
			error: "Invalid user id",
		});
	}

	const [profilePda] = PublicKey.findProgramAddressSync(
		[
			Buffer.from("user_profile"),
			CRUX_KEY.toBytes(),
			new PublicKey(pubKey).toBytes(),
		],
		CHALLENGER_PROGRAM_ID
	);

	const { program } = createWorkspace();

	try {
		// get base profile data + socials
		const [user, onChainProfile] = await Promise.all([
			prisma.userProfile.findFirst({
				where: {
					pubKey: pubKey,
				},
				select: {
					pubKey: true,
					profilePdaPubKey: true,
					username: true,
					bio: true,
					avatarUrl: true,
					status: true,
				},
			}),

			// forum client uses fetch which throws if not found, nullable easier to work with
			await program?.account.userProfile.fetchNullable(profilePda),
		]);

		if (!user || !onChainProfile) {
			return res.status(404).json({
				error: "User not found",
			});
		}
		const userProfile = {
			...user,
			reputation: onChainProfile.reputationScore.toNumber(),
			challengesSubmitted: onChainProfile.challengesSubmitted.toNumber(),
			challengesCompleted: onChainProfile.challengesCompleted.toNumber(),
		};

		return res.status(200).json({ data: { userProfile } });
	} catch (error) {
		console.error("Request error", error);
		res.status(500).json({
			error: "Error fetching user",
		});
	}
}
