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
			console.log(userProfiles);
		};
		loadUserProfiles();
	}, [program, wallet, challengerClient]);

	return (
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
					{userProfiles?.map((userProfile, index: number) => (
						<LeaderboardUserProfileCard key={index} userProfile={userProfile} />
					))}
				</Box>
			</VStack>
		</Flex>
	);
}

{
	/* <Flex
			flexDirection="column" // Stack children vertically
			alignItems="center" // Center children horizontally
			mt="5vh"
		>
			<Box bg="#111">
				<Table
					variant="simple"
					colorScheme="gray"
					size="sm"
					width="auto"
					maxWidth="80vw"
				>
					<Thead p={"4"}>
						<Tr>
							<Th fontSize="20" fontWeight="700" textColor={"white"}>
								Rank
							</Th>
							<Th fontSize="20" fontWeight="700" textColor={"white"}>
								User Wallet Address
							</Th>
							<Th fontSize="20" fontWeight="700" textColor={"white"}>
								Challenges Submitted
							</Th>
							<Th fontSize="20" fontWeight="700" textColor={"white"}>
								Challenges Completed
							</Th>
							<Th fontSize="20" fontWeight="700" textColor={"white"}>
								Reputation
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{userProfiles?.map((userProfile, index: number) => (
							<Tr key={index}>
								<Td fontSize={"20"} fontWeight={"400"}>
									{index + 1}
								</Td>
								<Td fontSize={"20"} fontWeight={"400"}>
									{shortenWalletAddress(userProfile.pubKey)}
								</Td>
								<Td fontSize={"20"} fontWeight={"400"}>
									{userProfile.challengesSubmitted}
								</Td>
								<Td fontSize={"20"} fontWeight={"400"}>
									{userProfile.challengesCompleted}
								</Td>
								<Td fontSize={"20"} fontWeight={"400"}>
									<Wrap align={"center"}>
										{userProfile.reputation}{" "}
										<Image src="/icons/xp.svg" alt="xp" />
									</Wrap>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</Box>
		</Flex> */
}
