import {
	Box,
	Card,
	Flex,
	HStack,
	Image,
	Text,
	Wrap,
	Grid,
	GridItem,
	Button,
	IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { shortenWalletAddress } from "@/util/lib";

const LeaderboardUserProfileCard = ({ userProfile }: any) => {
	return (
		<>
			<Flex
				justifyContent="center" // Center horizontally
				alignItems="center"
			>
				<Grid
					bg="#0E0E10"
					width={["80vw", "80vw", "60vw", "60vw"]}
					h={["3vh", "3vh", "7vh", "7vh"]}
					padding={["1", "1", "2.5", "2.5"]}
					templateColumns="repeat(5, 1fr)"
					gap={[1, 1, 10, 10]}
					alignItems="center"
				>
					<GridItem textAlign="center">
						<Text fontSize={["7", "7", "20", "20"]} fontWeight={"400"}>
							{userProfile.rank}
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Text fontSize={["7", "7", "20", "20"]} fontWeight={"400"}>
							{shortenWalletAddress(userProfile.pubKey)}
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Text fontSize={["7", "7", "20", "20"]} fontWeight={"400"}>
							{userProfile.challengesSubmitted}
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Text fontSize={["7", "7", "20", "20"]} fontWeight={"400"}>
							{userProfile.challengesCompleted}
						</Text>
					</GridItem>
					<GridItem alignItems="center">
						<HStack spacing={"-1"} justify={"center"}>
							<Text
								fontSize={["7", "7", "20", "20"]}
								fontWeight={"400"}
								color={"#FF9728"}
							>
								{userProfile.reputation}
							</Text>
							<Image
								mr={["0", "0", "-2", "-2"]}
								src="/images/rp.png"
								alt="RP"
								width={["15px", "15px", "35px", "35px"]}
								height={["15px", "15px", "35px", "35px"]}
							/>
						</HStack>
					</GridItem>
				</Grid>
			</Flex>
		</>
	);
};

export default LeaderboardUserProfileCard;
