// import { Challenger } from "./idl/challenger";
// import {
// 	shortenWalletAddress,
// 	getTagFromString,
// 	getDisplayStringFromTag,
// } from "./lib";
// import { tagValues } from "./challengerSdk";

// describe("shortenWalletAddress", () => {
// 	it("should return empty string if address empty", () => {
// 		expect(shortenWalletAddress("")).toBe("");
// 	});

// 	it("should return shortened address", () => {
// 		expect(
// 			shortenWalletAddress("G1GJ7ZJ6JZJ6JZJ6JZJ6JZJ6JZJ6JZJ6JZJ6JZJ6JZ")
// 		).toBe("G1GJ...J6JZ");
// 		expect(shortenWalletAddress("G1GJ7ZJ6")).toBe("");
// 	});
// });

// describe("getDisplayStringFromTag", () => {
// 	it("should return tag value for valid tag string", () => {
// 		expect(getDisplayStringFromTag("daosandgovernance")).toBe(
// 			"DAOs and Governance"
// 		);
// 		expect(getDisplayStringFromTag("dataandanalytics")).toBe(
// 			"Data and Analytics"
// 		);
// 		expect(getDisplayStringFromTag("defi")).toBe("DeFi");
// 		expect(getDisplayStringFromTag("development")).toBe("Development");
// 		expect(getDisplayStringFromTag("gaming")).toBe("Gaming");
// 		expect(getDisplayStringFromTag("mobile")).toBe("Mobile");
// 		expect(getDisplayStringFromTag("nfts")).toBe("NFTs");
// 		expect(getDisplayStringFromTag("payments")).toBe("Payments");
// 		expect(getDisplayStringFromTag("toolsandinfrastructure")).toBe(
// 			"Tools and Infrastructure"
// 		);
// 		expect(getDisplayStringFromTag("trading")).toBe("Trading");
// 	});

// 	it("should return null for invalid tag string", () => {
// 		expect(getDisplayStringFromTag("invalidtag")).toBe(null);
// 	});
// });

// describe("getTagFromString", () => {
// 	it("should return display string for valid tag", () => {
// 		expect(getTagFromString("daosandgovernance")).toBe(
// 			tagValues.DaosAndGovernance
// 		);
// 		expect(getTagFromString("dataandanalytics")).toBe(
// 			tagValues.DataAndAnalytics
// 		);
// 		expect(getTagFromString("defi")).toBe(tagValues.DeFi);
// 		expect(getTagFromString("development")).toBe(tagValues.Development);
// 		expect(getTagFromString("gaming")).toBe(tagValues.Gaming);
// 		expect(getTagFromString("mobile")).toBe(tagValues.Mobile);
// 		expect(getTagFromString("nfts")).toBe(tagValues.Nfts);
// 		expect(getTagFromString("payments")).toBe(tagValues.Payments);
// 		expect(getTagFromString("toolsandinfrastructure")).toBe(
// 			tagValues.ToolsAndInfrastructure
// 		);
// 		expect(getTagFromString("trading")).toBe(tagValues.Trading);
// 	});

// 	it("should return null for invalid tag", () => {
// 		expect(getTagFromString("invalidtag")).toBe(null);
// 	});

// 	it("should return null for empty tag", () => {
// 		expect(getTagFromString("")).toBe(null);
// 	});
// });
