import { tagValues } from "./challengerSdk";

export const shortenWalletAddress = (address: string) => {
	if (!address || address.length <= 8) {
		return "";
	}

	return `${address.slice(0, 4)}...${address.slice(
		address.length - 4,
		address.length
	)}`;
};

export const getTagFromString = (tagString: string) => {
	switch (tagString.toLowerCase()) {
		case "daosandgovernance":
			return tagValues.DaosAndGovernance;
		case "dataandanalytics":
			return tagValues.DataAndAnalytics;
		case "defi":
			return tagValues.DeFi;
		case "development":
			return tagValues.Development;
		case "gaming":
			return tagValues.Gaming;
		case "mobile":
			return tagValues.Mobile;
		case "nfts":
			return tagValues.Nfts;
		case "payments":
			return tagValues.Payments;
		case "toolsandinfrastructure":
			return tagValues.ToolsAndInfrastructure;
		case "trading":
			return tagValues.Trading;
		default:
			return null;
	}
};

export const getDisplayStringFromTag = (tag: string) => {
	switch (tag.toLowerCase()) {
		case "daosandgovernance":
			return "DAOs and Governance";
		case "dataandanalytics":
			return "Data and Analytics";
		case "defi":
			return "DeFi";
		case "development":
			return "Development";
		case "gaming":
			return "Gaming";
		case "mobile":
			return "Mobile";
		case "nfts":
			return "NFTs";
		case "payments":
			return "Payments";
		case "toolsandinfrastructure":
			return "Tools and Infrastructure";
		case "trading":
			return "Trading";
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
