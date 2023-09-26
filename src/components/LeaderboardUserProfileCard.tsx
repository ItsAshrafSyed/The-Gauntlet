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
				>
					<GridItem textAlign="center">
						<Text fontSize={"20"} fontWeight={"400"}>
							{userProfile.rank}
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Text fontSize={"20"} fontWeight={"400"}>
							{shortenWalletAddress(userProfile.pubKey)}
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Text fontSize={"20"} fontWeight={"400"}>
							{userProfile.challengesSubmitted}
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Text fontSize={"20"} fontWeight={"400"}>
							{userProfile.challengesCompleted}
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Button
							variant={"ghost"}
							fontSize={"20"}
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
									width={"25px"}
									height={"25px"}
								/>
							}
						>
							{userProfile.reputation}
						</Button>
					</GridItem>
				</Grid>
			</Flex>
			{/* <Flex>
				<Card
					bg="#111"
					height={"10vh"}
					rounded={"lg"}
					width={"auto"}
					textColor={"white"}
					borderBottom={"1px"}
					padding={"5"}
				>
					<HStack>
						<Text fontSize={"20"} fontWeight={"400"}>
							{userProfile.id}
						</Text>
						<Text fontSize={"20"} fontWeight={"400"}>
							{shortenWalletAddress(userProfile.pubKey)}
						</Text>
						<Text fontSize={"20"} fontWeight={"400"}>
							{userProfile.challengesSubmitted}
						</Text>
						<Text fontSize={"20"} fontWeight={"400"}>
							{userProfile.challengesCompleted}
						</Text>
						<Wrap fontSize={"20"} fontWeight={"400"}>
							{userProfile.reputation}
							<Image src="/icons/xp.svg" alt="xp" />
						</Wrap>
					</HStack>
				</Card>
			</Flex> */}
		</>
	);
};

export default LeaderboardUserProfileCard;
