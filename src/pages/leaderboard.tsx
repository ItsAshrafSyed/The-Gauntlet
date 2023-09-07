import { useEffect, useState } from "react";
import { Box, Flex, Card, HStack, Image, Text, Wrap } from "@chakra-ui/react";
import { useWorkspace } from "@/providers/WorkspaceProvider";
import { useSessionUser } from "@/providers/SessionUserProvider";
import { fetchApiResponse } from "@/util/lib";
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
			if (!program || !wallet || !challengerClient) return;
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
		<Box m="28">
			<Flex>
				<Card
					bg="#111"
					rounded={"lg"}
					width={"140vw"}
					textColor={"white"}
					border={"1px"}
					padding={"3"}
					align="baseline"
				>
					<HStack spacing={4}>
						<Text fontSize={"20"} fontWeight={"700"} width={"45vw"}>
							User Wallet Address
						</Text>
						<Text fontSize={"20"} fontWeight={"700"} width={"10vw"}>
							Challenges Submitted
						</Text>
						<Text fontSize={"20"} fontWeight={"700"} width={"10vw"}>
							Challenges Completed
						</Text>
						<Text width={"9vw"} fontSize={"20"} fontWeight={"700"}>
							Reputation
						</Text>
					</HStack>
				</Card>
			</Flex>
			{userProfiles?.map((userProfile, index: number) => (
				<LeaderboardUserProfileCard key={index} userProfile={userProfile} />
			))}
		</Box>
	);
}
