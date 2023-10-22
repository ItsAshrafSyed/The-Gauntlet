import { useSessionUser } from "@/providers/SessionUserProvider";
import { fetchApiResponse } from "@/util/lib";
import {
	Box,
	Flex,
	HStack,
	Image,
	Text,
	VStack,
	Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import SubmissionCard from "../../components/SubmissionCard";
import SubmitSubmissionCard from "../../components/SubmitSubmissionCard";
import moment from "moment";
import LoadingSpinner from "../../components/LoadingSpinner";
import { shortenWalletAddress } from "../../util/lib";
import { FaDiscord } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";
import ContentWithLinks from "@/components/ContentWithLinks";
import "@fontsource-variable/readex-pro";
import { FiEdit3 } from "react-icons/fi";

export default function Challenge() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [reputation, setReputation] = useState<number>(0);
	const [challengeCreatedTime, setChallengeCreatedTime] = useState<string>("");
	const [challengeEndTime, setChallengeEndTime] = useState<string>("");
	const [tags, setTags] = useState<string[]>([]);
	const [authorAvatarUrl, setAuthorAvatarUrl] = useState<string>("");
	const [authorPubKey, setAuthorPubKey] = useState<string>("");
	const [challengeId, setChallengeId] = useState<number>(0);
	const [challengePubKey, setChallengePubKey] = useState<string>("");
	const [submissions, setSubmissions] = useState<any[]>([]);

	const {
		metadata: sessionUserMetadata,
		isConnected,
		isModerator,
		hasProfile,
		userPublicKey: sessionUserPubKey,
	} = useSessionUser();
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (!id) return;
		async function loadData() {
			try {
				const [challengeResult, submissionResult] = await Promise.all([
					fetchApiResponse<any>({ url: `/api/challenges/${id}` }),
					fetchApiResponse<any>({
						url: `/api/submissions?challengeId=${id}`,
					}),
				]);
				if (!challengeResult.data) {
					router.push("/challenges");
					return;
				}
				const challenge = challengeResult.data.challenge;

				const submissions = submissionResult.data.submissions ?? [];

				let sortedSubmissions = [];
				if (submissions.length > 0) {
					// @ts-ignore Type is any so TS doesn't know this exists
					sortedSubmissions = submissions
						.sort(
							(
								a: { dateUpdated: moment.MomentInput },
								b: { dateUpdated: moment.MomentInput }
							) => {
								moment(b.dateUpdated).diff(moment(a.dateUpdated));
							}
						)
						.reverse();
				}

				setAuthorAvatarUrl(challenge.avatarUrl);
				setAuthorPubKey(challenge.authorPubKey);
				setTitle(challenge.title);
				setContent(challenge.content);
				setReputation(challenge.reputation);
				setChallengeCreatedTime(challenge.dateCreated);
				setChallengeEndTime(challenge.challengePeriod);
				setTags(challenge.tags.flat());
				setSubmissions(sortedSubmissions);
				setChallengeId(challenge.id);
				setChallengePubKey(challenge.pubKey);
				setIsLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		loadData();
	}, [id, sessionUserPubKey, sessionUserMetadata?.avatarUrl, router]);

	// date formatting function
	function formatDateTime(dateTimeString: string) {
		const date = new Date(dateTimeString);

		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");

		return `${day}/${month}/${year}, ${hours}:${minutes}`;
	}

	const formattedCreatedTime = formatDateTime(challengeCreatedTime);
	const formattedEndTime = formatDateTime(challengeEndTime);

	// Function to map tags to colors
	function mapTagToColor(tag: string) {
		const tagColors: { [key: string]: string } = {
			"Artificial Intelligence":
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(208, 99, 15, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			"Physical Infrastructure Networks":
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(211, 158, 0, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			"Finance & Payments":
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(0, 87, 189, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			"Gaming & Entertainment":
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(141, 24, 214, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			"Mobile Consumer Apps":
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(1, 131, 125, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			"Crypto Infrastructure":
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(209, 39, 105, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			"DAOs & Network States":
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(255, 255, 240, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			"Data & Analytics":
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(213, 213, 242, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			NFTs: "radial-gradient(70.71% 70.71% at 50% 50%, rgba(207, 33, 41, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			Development:
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(133, 255, 0, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			Ideas:
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(0, 136, 84, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
			Social:
				"radial-gradient(70.71% 70.71% at 50% 50%, rgba(131, 200, 222, 0.3) 0%, rgba(0, 0, 0, 0.00) 100%)",
		};

		// Return the color for the given tag or default color
		return tagColors[tag as keyof typeof tagColors];
	}

	const tagColors: { [key: string]: string } = {
		"Physical Infrastructure Networks": "#6b5104",
		"Artificial Intelligence": "#FD7651",
		"Finance & Payments": " #1b72bf",
		"Gaming & Entertainment": "#AA6CFC",
		"Mobile Consumer Apps": "#5e8583",
		"Crypto Infrastructure": "#E959BB",
		"DAOs & Network States": "#6e6e5d",
		"Data & Analytics": "#8e70b3",
		NFTs: "#FF6262",
		Development: "#8eb06a",
		Ideas: "   #2e614d",
		Social: "#427687",
	};

	// Get the background color based on the first tag or default color
	const backgroundColor = mapTagToColor(tags[0]);

	// to copy url to clipboard
	function copyToClipboard() {
		// Create a dummy input element
		const input = document.createElement("input");
		// Set its value to the current URL
		input.value = window.location.href;
		// Append it to the DOM (you can also make it hidden if you want)
		document.body.appendChild(input);
		// Select the URL text
		input.select();
		// Copy the selected text to the clipboard
		document.execCommand("copy");
		// Remove the input element from the DOM
		document.body.removeChild(input);
		// You can provide some feedback to the user (optional)
		alert("URL copied to clipboard!");
	}

	return (
		<>
			{isLoading ? (
				<LoadingSpinner isLoading={isLoading} />
			) : (
				<>
					<Flex border={"1px solid #1E1E23"} bg={backgroundColor} mt={"2vh"}>
						<Box px={"4vw"} py={"5vh"}>
							<HStack spacing={"6"} ml={["10vw", "10vw", "48vw", "48vw"]}>
								<Text
									fontSize={["6", "6", "16", "16"]}
									fontWeight={"400"}
									borderRadius={"20"}
									border={"1px solid #25D083"}
									padding={"1"}
									bg="#092418"
								>
									{/* compared formatted date with current date to show if ongoing or expired */}
									{moment().isBefore(challengeEndTime) ? "Ongoing" : "Expired"}
								</Text>
								<Text
									fontSize={["6", "6", "16", "16"]}
									fontWeight={"400"}
									border={"1px solid #25D083"}
									borderRadius={"20"}
									padding={"1"}
									bg="#092418"
								>
									{formattedCreatedTime} - {formattedEndTime}
								</Text>

								<FaShareAlt size={"28"} onClick={copyToClipboard} />
								{isModerator && (
									<FiEdit3
										size={"30"}
										onClick={() => {
											router.push(`/challenges/edit/${id}`);
										}}
									/>
								)}
							</HStack>
							<Box mt={"1vh"}>
								<Text
									fontSize={["25", "25", "36", "36"]}
									fontWeight={"600"}
									fontFamily={"Readex Pro Variable"}
								>
									{title}
								</Text>

								<Box maxW={"75vw"} mt={2}>
									<Text
										fontSize={["10", "10", "20", "20"]}
										fontWeight={"300"}
										textColor={"#AAABAE)"}
										style={{ whiteSpace: "pre-wrap" }}
									>
										<ContentWithLinks content={content} />
									</Text>
								</Box>
								{/* <Text fontSize={20} fontWeight={"500"} mt={"6"}>
									Evaluator : {shortenWalletAddress(authorPubKey)}
								</Text> */}
							</Box>
						</Box>
					</Flex>
					<Flex
						justifyContent="space-between"
						mt={"2vh"}
						flexDir={{ base: "column", md: "row" }}
					>
						<Box minW={"60vw"}>
							<HStack justifyContent={"space-between"}>
								<Text
									fontSize={["15", "15", "24", "24"]}
									fontWeight={"500"}
									my={4}
								>
									{!submissions.length || submissions.length === 0
										? "No submissions yet"
										: `${submissions.length} Submission${
												submissions.length > 1 ? "s" : ""
										  }`}
								</Text>
							</HStack>
							<VStack spacing={6} minWidth={"80%"} align={"center"}>
								{moment().isBefore(challengeEndTime) && (
									<SubmitSubmissionCard
										userProfilePubKey={sessionUserPubKey}
										userAvatarUrl={sessionUserMetadata?.avatarUrl}
										challengePubKey={challengePubKey}
										challengeId={challengeId}
									/>
								)}

								{submissions.map((submission: any, index: number) => (
									<SubmissionCard
										key={index}
										submissionId={submission.id}
										submission={submission.content}
										submissionTimestamp={submission.dateUpdated}
										userAvatarUrl={submission.authorAvatarUrl}
										userProfilePubKey={submission.authorPubKey}
										awarded={submission.awarded}
										submissionPubKey={submission.pubKey}
									/>
								))}
							</VStack>
						</Box>
						<Box>
							<VStack display={{ base: "none", md: "flex" }}>
								<Box
									width={["30vw", "30vw", "25vw", "25vw"]}
									background={"#0E0E10"}
									padding={{ base: "3", md: "10" }}
									borderRadius={"8"}
								>
									<Text
										fontSize={["15", "15", "24", "24"]}
										fontWeight={"500"}
										fontFamily={"Readex Pro Variable"}
									>
										REWARD
									</Text>
									<HStack spacing={"-1"}>
										<Text fontSize={"30"} fontWeight={"500"} color={"#FF9728"}>
											{reputation}
										</Text>
										<Image
											src="/images/rp.png"
											alt="RP"
											width={"35px"}
											height={"35px"}
										/>
									</HStack>
								</Box>
								<Box
									width={["30vw", "30vw", "25vw", "25vw"]}
									background={"#0E0E10"}
									padding={{ base: "5", md: "10" }}
									borderRadius={"8"}
								>
									<Text
										fontSize={["15", "15", "24", "24"]}
										fontWeight={"500"}
										fontFamily={"Readex Pro Variable"}
									>
										TAGS
									</Text>
									{tags?.map((tag: string, index: number) => (
										<Text
											background={tagColors[tag] || "gray"}
											px={{ base: "2", md: "4" }}
											py={{ base: "1", md: "2" }}
											key={index}
											mt={"1"}
											borderRadius={"20"}
											fontSize={["7", "7", "14", "14"]}
											fontWeight={"400"}
											width={"fit-content"}
										>
											{tag}
										</Text>
									))}
								</Box>
								<Box
									width={["33vw", "33vw", "25vw", "25vw"]}
									background={"#0E0E10"}
									padding={{ base: "3", md: "10" }}
									borderRadius={"8"}
								>
									<Text
										fontSize={["15", "15", "24", "24"]}
										fontWeight={"500"}
										fontFamily={"Readex Pro Variable"}
									>
										Help Center
									</Text>
									<Text fontSize={["10", "10", "16", "16"]} fontWeight={"400"}>
										Struggling with challenge? Join our Discord server to get
										help
									</Text>
									<Button
										size={{ base: "xs", md: "md" }}
										mt={"1"}
										color={"#F4F4F4"}
										bg={"#5260D2"}
										leftIcon={<FaDiscord />}
										_hover={{
											bg: "transparent",
											outline: "1px solid #5260D2",
										}}
										onClick={() => {
											window.open("https://discord.gg/zQuyhTXhKj", "_blank");
										}}
									>
										Join Discord
									</Button>
								</Box>
							</VStack>
						</Box>
					</Flex>
				</>
			)}
		</>
	);
}
