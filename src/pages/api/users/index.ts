import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { CHALLENGER_PUBKEY } from "../../../util/constants";

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
