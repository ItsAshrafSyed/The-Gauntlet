import { PublicKey } from "@solana/web3.js";

export const CHALLENGER_PROGRAM_ID = new PublicKey(
	process.env.NEXT_PUBLIC_CHALLENGER_PROGRAM_ID ?? ""
);

export const CHALLENGER_PUBKEY = new PublicKey(
	process.env.NEXT_PUBLIC_CHALLENGER_PUBKEY ?? ""
);

export const CRUX_KEY = new PublicKey(process.env.NEXT_PUBLIC_CRUX_KEY ?? "");

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
