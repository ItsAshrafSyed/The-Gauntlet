import { Box, Card, Flex, HStack, Image, Text, Wrap } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const LeaderboardUserProfileCard = ({ userProfile }: any) => {
	return (
		<>
			<Flex>
				<Card
					bg="#111"
					rounded={"lg"}
					width={"140vw"}
					textColor={"white"}
					borderBottom={"1px"}
					padding={"3"}
					align="baseline"
				>
					<HStack spacing={4}>
						<Text fontSize={"20"} fontWeight={"400"} width={"50vw"}>
							{userProfile.pubKey}
						</Text>
						<Text fontSize={"20"} fontWeight={"400"} width={"10vw"}>
							{userProfile.challengesSubmitted}
						</Text>
						<Text fontSize={"20"} fontWeight={"400"} width={"7vw"}>
							{userProfile.challengesCompleted}
						</Text>
						<Wrap width={"8vw"} fontSize={"20"} fontWeight={"400"}>
							{userProfile.reputation}
							<Image src="/icons/xp.svg" alt="xp" />
						</Wrap>
					</HStack>
				</Card>
			</Flex>
		</>
	);
};

export default LeaderboardUserProfileCard;
