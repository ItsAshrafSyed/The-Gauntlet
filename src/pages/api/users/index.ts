import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { CHALLENGER_PUBKEY } from "../../../util/constants";
import { PublicKey } from "@solana/web3.js";
import { createWorkspace } from "../../../util/api";
import { on } from "events";
import { use } from "react";

const prisma = new PrismaClient();

interface createUserPayload {
	pubKey: string;
	username?: string;
	bio?: string;
	avatarUrl?: string;
	profilePdaPubKey: string;
	challengerPubKey: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "POST": {
			return await createUser(req, res);
		}
		case "GET": {
			return await getUsers(req, res);
		}

		default: {
			return res.status(405).json({ message: "Method not allowed" });
		}
	}
}

async function createUser(req: NextApiRequest, res: NextApiResponse) {
	const data = req.body as createUserPayload;

	if (!data.pubKey || typeof data.pubKey !== "string") {
		return res.status(400).json({ message: "Invalid user pubkey" });
	}
	if (!data.profilePdaPubKey || typeof data.profilePdaPubKey !== "string") {
		return res.status(400).json({ message: "Invalid profile pda pubkey" });
	}

	try {
		const user = await prisma.userProfile.create({
			data: {
				pubKey: data.pubKey,
				username: data.username ?? "",
				bio: data.bio ?? "",
				avatarUrl: data.avatarUrl ?? null,
				profilePdaPubKey: data.profilePdaPubKey,
				challengerPubKey: CHALLENGER_PUBKEY.toBase58(),
			},
		});
		return res.status(200).json({ data: { user } });
	} catch (e) {
		console.error("Error creating user", e);
		return res.status(500).json({ message: "Error creating user" });
	}
}

async function getUsers(req: NextApiRequest, res: NextApiResponse) {
	const { program } = createWorkspace();
	try {
		const users = await prisma.userProfile.findMany({
			select: {
				id: true,
				pubKey: true,
				username: true,
				bio: true,
				avatarUrl: true,
				profilePdaPubKey: true,
			},
		});

		let usersWithOnChainData = await Promise.all(
			users.map(async (user) => {
				if (!user.profilePdaPubKey) return null;
				const userProfilePdaPubKey = new PublicKey(user.profilePdaPubKey);
				const onChainData = await program.account.userProfile.fetchNullable(
					userProfilePdaPubKey
				);
				if (!onChainData) return null;
				return onChainData
					? {
							...user,
							reputation: onChainData.reputationScore.toNumber(),
							challengesSubmitted: onChainData.challengesSubmitted.toNumber(),
							challengesCompleted: onChainData.challengesCompleted.toNumber(),
					  }
					: null;
			})
		);
		usersWithOnChainData = usersWithOnChainData.filter((user) => user !== null);

		return res.status(200).json({
			data: {
				userProfiles: usersWithOnChainData,
			},
		});
	} catch (e) {
		console.error("Error getting users", e);
		return res.status(500).json({ message: "Error getting users" });
	}
}
