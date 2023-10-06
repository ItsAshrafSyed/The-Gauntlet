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
	tags: string | string[];
	challengePeriod: string;
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
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const [gridView, setGridView] = useState(true);
	const [tableView, setTableView] = useState(false);
	const [selectedTag, setSelectedTag] = useState<string[]>([]);
	const [challengesCount, setChallengesCount] = useState<number>(0);
	const [challenges, setChallenges] = useState<Challenge[] | null>(null);
	const { hasProfile, isModerator } = useSessionUser();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();

	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 12; // Number of challenges to display per page
	const totalPages = Math.ceil(challengesCount / pageSize);

	useEffect(() => {
		async function getChallenges() {
			if (!program) return;
			const { data } = await fetchApiResponse<any>({
				url: "/api/challenges",
			});
			// Process tags and split them into arrays
			const challenges = data.challenges.map((challenge: Challenge) => ({
				...challenge,
				tags:
					typeof challenge.tags === "string"
						? challenge.tags.split(",")
						: challenge.tags,
			}));

			setChallenges(challenges.reverse());

			setIsLoading(false);
		}
		getChallenges();
	}, [program]);
	// console.log(challenges);

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

	const nextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

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
										? null // Use null when "All Categories" is selected
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
										Reputation Points
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
												tags={
													typeof challenge.tags === "string"
														? [challenge.tags]
														: challenge.tags
												}
												id={challenge.id}
												authorPubKey={challenge.authorPubKey}
												authorAvatarUrl={challenge.avatarUrl}
												lastActivity={challenge.dateUpdated}
												challengeExpiration={challenge.challengePeriod}
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
												tags={
													typeof challenge.tags === "string"
														? [challenge.tags]
														: challenge.tags
												}
												id={challenge.id}
												authorPubKey={challenge.authorPubKey}
												authorAvatarUrl={challenge.avatarUrl}
												lastActivity={challenge.dateUpdated}
												challengeExpiration={challenge.challengePeriod}
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
															tags={
																typeof challenge.tags === "string"
																	? [challenge.tags]
																	: challenge.tags
															}
															id={challenge.id}
															authorPubKey={challenge.authorPubKey}
															authorAvatarUrl={challenge.avatarUrl}
															lastActivity={challenge.dateUpdated}
															challengeExpiration={challenge.challengePeriod}
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
															tags={
																typeof challenge.tags === "string"
																	? [challenge.tags]
																	: challenge.tags
															}
															id={challenge.id}
															authorPubKey={challenge.authorPubKey}
															authorAvatarUrl={challenge.avatarUrl}
															lastActivity={challenge.dateUpdated}
															challengeExpiration={challenge.challengePeriod}
														/>
													</GridItem>
												)
									  )}
							</Grid>
						)}
					</Flex>
					{/* <Flex justify="center" mt={"10vh"}>
						<HStack spacing={4}>
							<Button
								onClick={prevPage}
								isDisabled={currentPage === 1}
								size={["sm", "md", "lg", "lg"]}
							>
								Previous Page
							</Button>
							<Text>
								Page {currentPage} of {totalPages}
							</Text>
							<Button
								onClick={nextPage}
								isDisabled={currentPage === totalPages}
								size={["sm", "md", "lg", "lg"]}
							>
								Next Page
							</Button>
						</HStack>
					</Flex> */}
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
