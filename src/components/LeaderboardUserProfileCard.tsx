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
					width={"60vw"}
					padding={"3"}
					templateColumns="repeat(5, 1fr)"
					gap={4}
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
					<GridItem textAlign="center">
						<Button
							variant={"ghost"}
							fontSize={["7", "7", "20", "20"]}
							fontWeight={"400"}
							_hover={{
								bg: "transparent",
								color: "#FF9728",
							}}
							color={"#FF9728"}
							rightIcon={
								<Image
									src="/images/rp.png"
									alt="RP"
									width={["15px", "15px", "35px", "35px"]}
									height={["15px", "15px", "35px", "35px"]}
								/>
							}
						>
							{userProfile.reputation}
						</Button>
					</GridItem>
				</Grid>
			</Flex>
		</>
	);
};

export default LeaderboardUserProfileCard;
