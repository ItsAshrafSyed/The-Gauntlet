import { Switch } from "@chakra-ui/react";
import { tagValues } from "./challengerSdk";
import { submissionState } from "./challengerSdk";

export const shortenWalletAddress = (address: string) => {
	if (!address || address.length <= 8) {
		return "";
	}

	return `${address.slice(0, 4)}...${address.slice(
		address.length - 4,
		address.length
	)}`;
};

export const getSubmissionStateFromString = (submissionStateString: string) => {
	switch (submissionStateString.toLowerCase()) {
		case "completed":
			return submissionState.Completed;
		case "rejected":
			return submissionState.Rejected;
		default:
			return null;
	}
};

export const getTagFromString = (tagString: string) => {
	switch (tagString.toLowerCase()) {
		case "client":
			return tagValues.Client;
		case "concept":
			return tagValues.Concept;
		case "deploy":
			return tagValues.Deploy;
		case "gaming":
			return tagValues.Gaming;
		case "nfts":
			return tagValues.Nfts;
		case "sdk":
			return tagValues.Sdk;
		case "social":
			return tagValues.Social;
		case "staking":
			return tagValues.Staking;
		case "video":
			return tagValues.Video;
		case "wallets":
			return tagValues.Wallets;
		default:
			return null;
	}
};

export const getDisplayStringFromTag = (tag: string) => {
	switch (tag.toLowerCase()) {
		case "client":
			return "Client";
		case "concept":
			return "Concept";
		case "deploy":
			return "Deploy";
		case "gaming":
			return "Gaming";
		case "nfts":
			return "Nfts";
		case "sdk":
			return "Sdk";
		case "social":
			return "Social";
		case "staking":
			return "Staking";
		case "video":
			return "Video";
		case "wallets":
			return "Wallets";
		default:
			return null;
	}
};

type FetchApiResponseParams = {
	url: string;
	method?: string;
	body?: any;
	headers?: HeadersInit;
};

export async function fetchApiResponse<ResultType>({
	url,
	method,
	body,
	headers,
}: FetchApiResponseParams): Promise<ResultType | null> {
	const defaultHeaders = {
		"Content-Type": "application/json",
	};

	const response = await fetch(url, {
		method: method ?? "GET",
		headers: headers ?? defaultHeaders,
		body: body ? JSON.stringify(body) : undefined,
	});

	// callers must null check
	return response.status === 404 ? null : await response.json();
}
