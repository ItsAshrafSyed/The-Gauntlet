import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function discordCallback(
	req: NextApiRequest,
	res: NextApiResponse
) {
	//excahnge the code we get from discord for an access token
	const session = await getSession({ req });
	const { code } = req.query;
	const { NEXTAUTH_URL } = process.env;
	const redirectUri = `${NEXTAUTH_URL}/api/auth/callback/discord`;
	const params = new URLSearchParams({
		client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID ?? "",
		client_secret: process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET ?? "",
		code: code as string,
		grant_type: "authorization_code",
		redirect_uri: redirectUri,
		scope: "identify",
	});
	const response = await fetch("https://discord.com/api/oauth2/token", {
		body: params.toString(),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		method: "POST",
	});
	const data = await response.json();
	// now with the access token we get fetch the user's info
	const userResponse = await fetch("https://discord.com/api/users/@me", {
		headers: {
			authorization: `${data.token_type} ${data.access_token}`,
		},
	});
	const userData = await userResponse.json();

	console.log(userData.username);
	res.redirect(`/challenges`);
}
