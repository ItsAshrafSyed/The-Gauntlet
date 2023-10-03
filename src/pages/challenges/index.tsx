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
	Grid,
	GridItem,
} from "@chakra-ui/react";
import Select, { components, OptionProps } from "react-select";
import { useState, useEffect, use } from "react";
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
import LoadingSpinner from "../../components/LoadingSpinner";

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

const customStyles = {
	//make the text on the select white
	multiValueLabel: (provided: any) => ({
		...provided,
		color: "white",
	}),
	control: (provided: any, state: any) => ({
		...provided,
		width: "20vw",
		backgroundColor: "#060606",
		color: "white",
		boxShadow: state.isFocused ? null : null,
	}),
	menu: (provided: any) => ({
		...provided,
		backgroundColor: "#0E0E10",
	}),
	option: (provided: any, state: any) => ({
		...provided,
		border: state.isFocused ? "1px solid #FF9728" : "none",
		boxShadow: state.isFocused ? null : null,
		backgroundColor: state.isFocused ? "#FF9728" : null,
		":hover": {
			border: "1px solid #FF9728", // Option border color on hover
			// This line disable the blue border
			boxShadow: "none",
			backgroundColor: "#FF9728",
		},
	}),
	multiValue: (provided: any) => ({
		...provided,
		backgroundColor: "#0E0E10",
		border: "1px solid #FF9728",
	}),
};

const InputOption: React.FC<OptionProps<any>> = ({
	getStyles,

	isDisabled,
	isFocused,
	isSelected,
	children,
	innerProps,
	...rest
}) => {
	const [isActive, setIsActive] = useState(false);
	const onMouseDown = () => setIsActive(true);
	const onMouseUp = () => setIsActive(false);
	const onMouseLeave = () => setIsActive(false);

	// styles
	let bg = "transparent";
	if (isFocused) bg = "#FF9728";
	if (isActive) bg = "#B2D4FF";

	const style = {
		alignItems: "center",
		backgroundColor: bg,
		color: "inherit",
		display: "flex ",
	};

	// prop assignment
	const props = {
		...innerProps,
		onMouseDown,
		onMouseUp,
		onMouseLeave,
		style,
	};

	return (
		<components.Option
			{...rest}
			isDisabled={isDisabled}
			isFocused={isFocused}
			isSelected={isSelected}
			getStyles={getStyles}
			innerProps={props}
		>
			<input type="checkbox" checked={isSelected} />
			{children}
		</components.Option>
	);
};

export default function Challenges() {
	const Router = useRouter();
	//const [isModerator, setIsModerator] = useState(false);
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const [gridView, setGridView] = useState(true);
	const [tableView, setTableView] = useState(false);
	const [selectedTag, setSelectedTag] = useState<string[]>([]);
	//const [hasProfile, setHasProfile] = useState(false);
	const [profile, setProfile] = useState<any>(null);
	const [challenges, setChallenges] = useState<Challenge[] | null>(null);
	const { hasProfile, isModerator } = useSessionUser();
	const [isLoading, setIsLoading] = useState<boolean>(true);
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
			setIsLoading(false);
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

	const filteredChallenges =
		selectedTag.length === 0
			? challenges // Show all challenges when no tags are selected
			: challenges?.filter((challenge: Challenge) => {
					// Check if the challenge's tags array contains at least one of the selected tags
					return selectedTag.some((selected) =>
						challenge.tags.includes(selected)
					);
			  });

	return (
		<>
			{isLoading ? (
				<LoadingSpinner isLoading={isLoading} />
			) : (
				<Box>
					{isModerator && (
						<Button
							display={["none", "none", "block", "block"]}
							leftIcon={
								<Image
									width="15"
									height="15"
									src="/icons/plus.svg"
									alt="plus"
								/>
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

					<HStack m={["10", "10", "20", "20"]} justify={"space-between"}>
						<Text fontSize={["28", "28", "48", "48"]} fontWeight={"700"}>
							All Challenges
						</Text>
						<HStack display={["none", "none", "flex", "flex"]}>
							<Select
								placeholder="All Categories"
								value={
									selectedTag.length === 0
										? { value: "", label: "All Categories" }
										: selectedTag.map((tag) => ({ value: tag, label: tag }))
								}
								onChange={(selectedOptions) => {
									const selectedTagsArray = selectedOptions.map(
										(option: any) => option.value
									);
									setSelectedTag(selectedTagsArray);
								}}
								isMulti
								closeMenuOnSelect={false}
								hideSelectedOptions={false}
								styles={customStyles}
								options={
									challenges
										? [
												{ value: "", label: "All Categories" },
												...Array.from(
													new Set(
														challenges.flatMap((challenge) => challenge.tags)
													)
												).map((tag) => ({
													value: tag,
													label: tag,
												})),
										  ]
										: []
								}
								components={{
									Option: InputOption,
								}}
							/>

							<Button
								size="md"
								variant="outline"
								color={"white"}
								onClick={handleGridClick}
								_hover={{ bg: "#FF9728" }}
								// display={["none", "none", "flex", "flex"]}
							>
								<BsFillGridFill size={28} />
							</Button>
							<Button
								size="md"
								variant="outline"
								color={"white"}
								onClick={handleTableClick}
								_hover={{ bg: "#FF9728" }}
								// display={["none", "none", "flex", "flex"]}
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
								templateColumns="2fr 1.5fr 1fr 1fr 1fr"
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
										Reputation Earned
									</Text>
								</GridItem>
								<GridItem textAlign="center">
									<Text fontSize={"20"} fontWeight={"700"}>
										Challenge Posted
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
							<Grid
								templateColumns={[
									"repeat(1, 1fr)", // 1 column for small screens
									"repeat(2, 1fr)", // 2 columns for medium screens
									"repeat(3, 1fr)",
									"repeat(3, 1fr)", // 3 columns for large screens
								]}
								gap={4}
							>
								{selectedTag
									? // Only render filtered challenges if a tag is selected
									  filteredChallenges?.map(
											(challenge: Challenge, index: number) =>
												gridView && (
													<GridItem key={index}>
														<ChallengeGridView
															title={challenge.title}
															content={challenge.content}
															reputation={challenge.reputation}
															tags={challenge.tags}
															id={challenge.id}
															authorPubKey={challenge.authorPubKey}
															authorAvatarUrl={challenge.avatarUrl}
															lastActivity={challenge.dateUpdated}
															challengeExpiration={
																challenge.challengeExpiration
															}
														/>
													</GridItem>
												)
									  )
									: // Render all challenges if no tag is selected
									  challenges?.map(
											(challenge: Challenge, index: number) =>
												gridView && (
													<GridItem key={index}>
														<ChallengeGridView
															title={challenge.title}
															content={challenge.content}
															reputation={challenge.reputation}
															tags={challenge.tags}
															id={challenge.id}
															authorPubKey={challenge.authorPubKey}
															authorAvatarUrl={challenge.avatarUrl}
															lastActivity={challenge.dateUpdated}
															challengeExpiration={
																challenge.challengeExpiration
															}
														/>
													</GridItem>
												)
									  )}
							</Grid>
						)}
					</Flex>
				</Box>
			)}
		</>
	);
}

// <SimpleGrid columns={3} spacing={4} m={5}>
// 	{selectedTag
// 		? // Only render filtered challenges if a tag is selected
// 		  filteredChallenges?.map(
// 				(challenge: Challenge, index: number) =>
// 					gridView && (
// 						<ChallengeGridView
// 							key={index}
// 							title={challenge.title}
// 							content={challenge.content}
// 							reputation={challenge.reputation}
// 							tags={challenge.tags}
// 							id={challenge.id}
// 							authorPubKey={challenge.authorPubKey}
// 							authorAvatarUrl={challenge.avatarUrl}
// 							lastActivity={challenge.dateUpdated}
// 							challengeExpiration={challenge.challengeExpiration}
// 						/>
// 					)
// 		  )
// 		: // Render all challenges if no tag is selected
// 		  challenges?.map(
// 				(challenge: Challenge, index: number) =>
// 					gridView && (
// 						<ChallengeGridView
// 							key={index}
// 							title={challenge.title}
// 							content={challenge.content}
// 							reputation={challenge.reputation}
// 							tags={challenge.tags}
// 							id={challenge.id}
// 							authorPubKey={challenge.authorPubKey}
// 							authorAvatarUrl={challenge.avatarUrl}
// 							lastActivity={challenge.dateUpdated}
// 							challengeExpiration={challenge.challengeExpiration}
// 						/>
// 					)
// 		  )}
// </SimpleGrid>
