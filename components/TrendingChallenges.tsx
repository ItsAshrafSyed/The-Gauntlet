import {
	Box,
	Flex,
	Heading,
	Image,
	Spacer,
	ButtonGroup,
	Button,
	AbsoluteCenter,
	Center,
	Text,
	VStack,
	Card,
	CardBody,
	SimpleGrid,
} from "@chakra-ui/react";
import { CurrentCompetiton } from "./CurrentCompetition";
import { relative } from "path";

export const TrendingChallenges = () => {
	return (
		<Box position="relative">
			<Image
				width="50%"
				height="200%"
				position={"absolute"}
				zIndex="-2"
				objectFit={"cover"}
				src="/images/2unsplash.png"
				alt="bg"
			/>
			<Box>
				<CurrentCompetiton />
			</Box>
			<Box mt={"-14"}>
				<Flex justifyContent="center">
					<Box>
						<Center fontFamily={"Inter"} fontSize={48} fontWeight={700}>
							Trending Challenges 🔥
						</Center>
					</Box>
					<Box position={"absolute"} m={"16"}>
						<SimpleGrid columns={3} spacing={10} mt={10}>
							<Card width={360} height={409} borderRadius={5}>
								<CardBody
									background={
										"linear-gradient(180deg, #5530A6 0%, rgba(17, 17, 17, 0.5) 57.09%);"
									}
								>
									<Center>
										<Text color={"white"} fontWeight={500} fontSize={24}>
											Solana Uni Game
										</Text>
									</Center>
								</CardBody>
							</Card>
							<Card width={360} height={409} borderRadius={20}>
								<CardBody
									background={
										"linear-gradient(180deg, #2CA870 0%, rgba(17, 17, 17, 0.6) 57.09%);"
									}
								>
									<Center>
										<Text color={"white"} fontWeight={500} fontSize={24}>
											Custom Account Data
										</Text>
									</Center>
								</CardBody>
							</Card>
							<Card width={360} height={409} borderRadius={20}>
								<CardBody
									background={
										"linear-gradient(180deg, #FD7651 0%, rgba(17, 17, 17, 0.6) 57.09%);"
									}
								>
									<Center>
										<Text color={"white"} fontWeight={500} fontSize={24}>
											Deploy a program
										</Text>
									</Center>
								</CardBody>
							</Card>
						</SimpleGrid>
						<Flex justifyContent="center" ml={"40"} mt={10}>
							<Button
								leftIcon={
									<Image
										width="15"
										height="15"
										src="/icons/swords.svg"
										alt="swords"
									/>
								}
								m={3}
								ml={"-36"}
								fontSize={16}
								textColor={"white"}
								fontWeight={400}
								border="1px solid #FFFFFF"
								borderRadius={9999}
								background={"transparent"}
							>
								VIEW ALL CHALLENGES
							</Button>
						</Flex>
					</Box>
				</Flex>
			</Box>
		</Box>
	);
};
