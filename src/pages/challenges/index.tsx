import {
	Box,
	HStack,
	Text,
	VStack,
	Image,
	Button,
	Card,
	Wrap,
	SimpleGrid,
	Flex,
	Select,
	Grid,
	GridItem,
} from "@chakra-ui/react";
import { useState, useEffect, use } from "react";
import { PublicKey } from "@solana/web3.js";
import { CHALLENGER_PROGRAM_ID, CRUX_KEY } from "../../util/constants";
import { useRouter } from "next/router";
import moment from "moment";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { fetchApiResponse } from "@/util/lib";
import ChallengeTableView from "../../components/ChallengeTableView";
import { useSessionUser } from "../../providers/SessionUserProvider";
import { BsFillGridFill } from "react-icons/bs";
import { MdOutlineStorage } from "react-icons/md";
import Challenge from "./[id]";
import ChallengeGridView from "@/components/ChallengeGridView";

type Challenge = {
	id: string;
	title: string;
	content: string;
	pubKey: string;
	authorPubKey: string;
	reputation: number;
	tags: string[];
	avatarUrl: string;
	dateUpdated: Date;
	challengeExpiration: number;
};

export default function Challenges() {
	const Router = useRouter();
	//const [isModerator, setIsModerator] = useState(false);
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const [gridView, setGridView] = useState(true);
	const [tableView, setTableView] = useState(false);
	const [selectedTag, setSelectedTag] = useState("");
	//const [hasProfile, setHasProfile] = useState(false);
	const [profile, setProfile] = useState<any>(null);
	const [challenges, setChallenges] = useState<Challenge[] | null>(null);
	const { hasProfile, isModerator } = useSessionUser();
	const router = useRouter();

	useEffect(() => {
		async function getChallenges() {
			if (!program) return;
			const { data } = await fetchApiResponse<any>({
				url: "/api/challenges",
			});
			const challenges = data.challenges;
			challenges.sort((a: Challenge, b: Challenge) =>
				moment(b.dateUpdated).diff(moment(a.dateUpdated))
			);

			setChallenges(challenges);
		}
		getChallenges();
	}, [program]);

	const handleGridClick = () => {
		setGridView(true);
		setTableView(false);
	};
	const handleTableClick = () => {
		setGridView(false);
		setTableView(true);
	};

	const filteredChallenges = challenges?.filter((challenge: Challenge) =>
		challenge.tags.includes(selectedTag)
	);

	// useEffect(() => {
	// 	if (!provider) return;
	// 	if (!provider.wallet) return;
	// 	if (!program) return;
	// 	if (profile) {
	// 		setHasProfile(true);
	// 		return;
	// 	}
	// 	const [profilePda] = PublicKey.findProgramAddressSync(
	// 		[
	// 			Buffer.from("user_profile"),
	// 			CRUX_KEY.toBytes(),
	// 			provider.wallet.publicKey.toBytes(),
	// 		],
	// 		CHALLENGER_PROGRAM_ID
	// 	);
	// 	async function checkProfile() {
	// 		const profileAccount = await program?.account.userProfile.fetchNullable(
	// 			profilePda
	// 		);
	// 		setIsModerator(profileAccount?.isModerator ? true : false);
	// 		setHasProfile(profileAccount ? true : false);
	// 	}
	// 	checkProfile();
	// }, [provider, program, profile, provider?.wallet, wallet]);

	return (
		<>
			<Box position={"relative"}>
				{isModerator && (
					<Button
						leftIcon={
							<Image width="15" height="15" src="/icons/plus.svg" alt="plus" />
						}
						position={"absolute"}
						right={"20vh"}
						mt={"-7vh"}
						variant="solid"
						fontSize={14}
						textColor="white"
						fontWeight={400}
						border="1px solid #FFB84D"
						borderRadius={"8"}
						background="#261B0B"
						_hover={{
							bg: "transparent",
						}}
						onClick={() => Router.push("/createChallenge")}
					>
						CREATE CHALLENGE
					</Button>
				)}

				<HStack m={"20"} justify={"space-between"}>
					<Text fontSize={"48"} fontWeight={"700"}>
						{" "}
						All Challenges
					</Text>
					<HStack>
						<Select
							placeholder="All Categories"
							value={selectedTag}
							onChange={(e) => setSelectedTag(e.target.value)}
						>
							{challenges &&
								Array.from(
									new Set(challenges.flatMap((challenge) => challenge.tags))
								).map((tag) => (
									<option key={tag} value={tag}>
										{tag}
									</option>
								))}
						</Select>
						<Button
							size="md"
							variant="outline"
							color={"white"}
							onClick={handleGridClick}
							_hover={{ bg: "#FF9728" }}
						>
							<BsFillGridFill size={28} />
						</Button>
						<Button
							size="md"
							variant="outline"
							color={"white"}
							onClick={handleTableClick}
							_hover={{ bg: "#FF9728" }}
						>
							<MdOutlineStorage size={28} />
						</Button>
					</HStack>
				</HStack>

				<VStack>
					{tableView && (
						<Grid
							bg="#151519"
							borderRadius={"8px 8px 0px 0px"}
							width={"80vw"}
							templateColumns="2fr 1fr 1fr 1fr 1fr"
							padding={"2.5"}
							gap={4}
							borderBottom={"1px solid #323232"}
						>
							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									Challenge
								</Text>
							</GridItem>
							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									Category
								</Text>
							</GridItem>
							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									Points
								</Text>
							</GridItem>
							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									Last Activity
								</Text>
							</GridItem>
							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									Expiration
								</Text>
							</GridItem>
						</Grid>
					)}

					{selectedTag
						? // Only render filtered challenges if a tag is selected
						  filteredChallenges?.map(
								(challenge: Challenge, index: number) =>
									tableView && (
										<ChallengeTableView
											key={index}
											title={challenge.title}
											content={challenge.content}
											reputation={challenge.reputation}
											tags={challenge.tags}
											id={challenge.id}
											authorPubKey={challenge.authorPubKey}
											authorAvatarUrl={challenge.avatarUrl}
											lastActivity={challenge.dateUpdated}
											challengeExpiration={challenge.challengeExpiration}
										/>
									)
						  )
						: // Render all challenges if no tag is selected
						  challenges?.map(
								(challenge: Challenge, index: number) =>
									tableView && (
										<ChallengeTableView
											key={index}
											title={challenge.title}
											content={challenge.content}
											reputation={challenge.reputation}
											tags={challenge.tags}
											id={challenge.id}
											authorPubKey={challenge.authorPubKey}
											authorAvatarUrl={challenge.avatarUrl}
											lastActivity={challenge.dateUpdated}
											challengeExpiration={challenge.challengeExpiration}
										/>
									)
						  )}
				</VStack>
				<Flex>
					{gridView && (
						<SimpleGrid columns={3} spacing={4} m={5}>
							{selectedTag
								? // Only render filtered challenges if a tag is selected
								  filteredChallenges?.map(
										(challenge: Challenge, index: number) =>
											gridView && (
												<ChallengeGridView
													key={index}
													title={challenge.title}
													content={challenge.content}
													reputation={challenge.reputation}
													tags={challenge.tags}
													id={challenge.id}
													authorPubKey={challenge.authorPubKey}
													authorAvatarUrl={challenge.avatarUrl}
													lastActivity={challenge.dateUpdated}
													challengeExpiration={challenge.challengeExpiration}
												/>
											)
								  )
								: // Render all challenges if no tag is selected
								  challenges?.map(
										(challenge: Challenge, index: number) =>
											gridView && (
												<ChallengeGridView
													key={index}
													title={challenge.title}
													content={challenge.content}
													reputation={challenge.reputation}
													tags={challenge.tags}
													id={challenge.id}
													authorPubKey={challenge.authorPubKey}
													authorAvatarUrl={challenge.avatarUrl}
													lastActivity={challenge.dateUpdated}
													challengeExpiration={challenge.challengeExpiration}
												/>
											)
								  )}
						</SimpleGrid>
					)}
				</Flex>
			</Box>
		</>
	);
}

// <>
// 			{isModerator ? (
// 				<Box position={"relative"}>
// 					<Button
// 						leftIcon={
// 							<Image width="15" height="15" src="/icons/plus.svg" alt="plus" />
// 						}
// 						position={"absolute"}
// 						right={"20vh"}
// 						variant="solid"
// 						fontSize={14}
// 						textColor="white"
// 						fontWeight={400}
// 						border="1px solid #FFB84D"
// 						borderRadius={"8"}
// 						background="#261B0B"
// 						_hover={{
// 							bg: "transparent",
// 						}}
// 						onClick={() => Router.push("/createChallenge")}
// 					>
// 						CREATE CHALLENGE
// 					</Button>

// 					<HStack m={"20"}>
// 						<Text fontSize={"48"} fontWeight={"700"}>
// 							{" "}
// 							All Challenges
// 						</Text>
// 					</HStack>

// 					<VStack align="center">
// 					<Card
// 							bg="#111"
// 							rounded={"lg"}
// 							width={"140vh"}
// 							textColor={"white"}
// 							border={"1px"}
// 							padding={"5"}
// 							align="baseline"
// 						>
// 							<HStack spacing={4}>
// 								<Text fontSize={"20"} fontWeight={"700"} width={"25vw"}>
// 									Challenge
// 								</Text>
// 								<Wrap width={"8vw"} fontSize={"20"} fontWeight={"700"}>
// 									Category
// 								</Wrap>
// 								<Wrap width={"8vw"} fontSize={"20"} fontWeight={"700"}>
// 									Points
// 								</Wrap>
// 								<Text width={"14vw"} fontSize={"20"} fontWeight={"700"}>
// 									Last Activity
// 								</Text>
// 								<Text width={"15vw"} fontSize={"20"} fontWeight={"700"}>
// 									Expiration
// 								</Text>
// 							</HStack>
// 						</Card>
// 						{challenges?.map((challenge: Challenge, index: number) => (
// 							<ChallengeTableView
// 								key={index}
// 								title={challenge.title}
// 								content={challenge.content}
// 								reputation={challenge.reputation}
// 								tags={challenge.tags}
// 								id={challenge.id}
// 								authorPubKey={challenge.authorPubKey}
// 								authorAvatarUrl={challenge.avatarUrl}
// 								lastActivity={challenge.dateUpdated}
// 								challengeExpiration={challenge.challengeExpiration}
// 							/>
// 						))}
// 					</VStack>
// 				</Box>
// 			) : (
// 				<Box position={"relative"}>
// 					<HStack m={"20"}>
// 						<Text fontSize={"48"} fontWeight={"700"}>
// 							{" "}
// 							All Challenges
// 						</Text>
// 					</HStack>

// 					<VStack align="center">
// 						<Card
// 							bg="#111"
// 							rounded={"lg"}
// 							width={"140vh"}
// 							textColor={"white"}
// 							border={"1px"}
// 							padding={"5"}
// 							align="baseline"
// 						>
// 							<HStack spacing={4}>
// 								<Text fontSize={"20"} fontWeight={"700"} width={"25vw"}>
// 									Challenge
// 								</Text>
// 								<Wrap width={"8vw"} fontSize={"20"} fontWeight={"700"}>
// 									Category
// 								</Wrap>
// 								<Wrap width={"8vw"} fontSize={"20"} fontWeight={"700"}>
// 									Points
// 								</Wrap>
// 								<Text width={"14vw"} fontSize={"20"} fontWeight={"700"}>
// 									Last Activity
// 								</Text>
// 								<Text width={"15vw"} fontSize={"20"} fontWeight={"700"}>
// 									Expiration
// 								</Text>
// 							</HStack>
// 						</Card>
// 						{challenges?.map((challenge: Challenge, index: number) => (
// 							<ChallengeTableView
// 								key={index}
// 								title={challenge.title}
// 								content={challenge.content}
// 								reputation={challenge.reputation}
// 								tags={challenge.tags}
// 								id={challenge.id}
// 								authorPubKey={challenge.authorPubKey}
// 								authorAvatarUrl={challenge.avatarUrl}
// 								lastActivity={challenge.dateUpdated}
// 								challengeExpiration={challenge.challengeExpiration}
// 							/>
// 						))}
// 					</VStack>
// 				</Box>
// 			)}
// 		</>
