import type { NextApiRequest, NextApiResponse } from "next";
import { hash } from "blake3";

// todo: remove this route and use optimistic creation instead
export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}

	const { toHash } = req.body;
	const output = hash(toHash);

	// intentionally not standardized to { data } format since this route is going away
	res.status(200).json({ output });
}
