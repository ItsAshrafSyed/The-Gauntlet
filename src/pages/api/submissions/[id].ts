import { PrismaClient } from "@prisma/client";
import { PublicKey } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

interface updateSubmissionContentPayload {
	id: number;
	content: string;
	contentHash: string;
	pubKey: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	switch (req.method) {
		case "PUT": {
			return await updateSubmissionContent(req, res);
		}
		default: {
			return res.status(405).json({ message: "Method not allowed" });
		}
	}
}

const updateSubmissionContent = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { id } = req.query;

	if (!id || typeof id !== "string") {
		return res.status(400).json({ message: "Invalid id" });
	}

	const data = req.body as updateSubmissionContentPayload;
	try {
		const submission = await prisma.submission.update({
			where: {
				id: data.id,
			},
			data: {
				content: data.content,
				contentHash: data.contentHash,
				pubKey: data.pubKey,
			},
		});
		return res.status(200).json({ data: submission });
	} catch (e) {
		console.error("Request error", e);
		res.status(500).json({ error: "Error updating submission" });
	}
};
