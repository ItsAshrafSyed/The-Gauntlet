import { useEffect, useState } from "react";
import {
	Box,
	Flex,
	Card,
	HStack,
	Table,
	Image,
	Text,
	Grid,
	VStack,
	Wrap,
	Td,
	TableCaption,
	Thead,
	Tbody,
	Tr,
	Th,
	TableContainer,
	GridItem,
} from "@chakra-ui/react";
import { useWorkspace } from "@/providers/WorkspaceProvider";
import { useSessionUser } from "@/providers/SessionUserProvider";
import { fetchApiResponse } from "@/util/lib";
import { shortenWalletAddress } from "@/util/lib";
import LeaderboardUserProfileCard from "../components/LeaderboardUserProfileCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";

type UserProfile = {
	avatarUrl: string;
	name: string;
	pubKey: string;
	username: string;
	challengesCompleted: number;
	challengesSubmitted: number;
	profilePdaPubKey: string;
	profileOwner: string;
	reputation: number;
};

export default function Leaderboard() {
	const { program, wallet, challengerClient } = useWorkspace();
	const [userProfiles, setUserProfiles] = useState<UserProfile[] | null>(null);
	const [rankedUserProfiles, setRankedUserProfiles] = useState<
		UserProfile[] | null
	>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const loadUserProfiles = async () => {
			if (!program || !challengerClient) return;
			const { data } = await fetchApiResponse<any>({
				url: "/api/users",
			});
			const userProfiles = data.userProfiles;
			userProfiles.sort((a: UserProfile, b: UserProfile) => {
				return b.reputation - a.reputation;
			});
			setUserProfiles(userProfiles);
			setIsLoading(false);
		};
		loadUserProfiles();
	}, [program, wallet, challengerClient]);

	//append rank to userProfiles
	useEffect(() => {
		if (!userProfiles) return;
		const rankedUserProfiles = userProfiles.map((userProfile, index) => {
			return { ...userProfile, rank: index + 1 };
		});
		setRankedUserProfiles(rankedUserProfiles);
	}, [userProfiles]);

	return (
		<>
			{isLoading ? (
				<LoadingSpinner isLoading={isLoading} />
			) : (
				<Flex
					justifyContent="center" // Center horizontally
					alignItems="center" // Center vertically
					mt={"8vh"}
				>
					<VStack>
						<Grid
							bg="#151519"
							borderRadius={"0.5rem 0.5rem 0rem 0rem"}
							width={"60vw"}
							templateColumns="repeat(5, 1fr)"
							padding={"2.5"}
							gap={4}
							borderBottom={"1px solid #323232"}
						>
							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									Rank
								</Text>
							</GridItem>
							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									User Wallet Address
								</Text>
							</GridItem>

							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									Challenges Submitted
								</Text>
							</GridItem>

							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									Challenges Completed
								</Text>
							</GridItem>
							<GridItem textAlign="center">
								<Text fontSize={"20"} fontWeight={"700"}>
									Reputation
								</Text>
							</GridItem>
						</Grid>
						<Box mt={"-2"}>
							{rankedUserProfiles?.map((rankedUserProfile, index: number) => (
								<LeaderboardUserProfileCard
									key={index}
									userProfile={rankedUserProfile}
								/>
							))}
						</Box>
					</VStack>
				</Flex>
			)}
		</>
	);
}
