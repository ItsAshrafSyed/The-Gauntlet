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
	CardHeader,
	HStack,
} from "@chakra-ui/react";
import { relative } from "path";

export const TopActiveUsers = () => {
	return (
		<Box position={"relative"}>
			<Flex>
				<VStack ml={-10}>
					<HStack mb={6}>
						<Text
							fontFamily={"Inter"}
							fontWeight={700}
							fontSize={48}
							color={"white"}
						>
							Top Active Users
						</Text>
						<Spacer />
						<Text
							fontFamily={"Inter"}
							fontWeight={700}
							fontSize={32}
							color={"#848895"}
						>
							24h
						</Text>
					</HStack>
					<Card
						width={"70vh"}
						height={"90vh"}
						background="rgba(29, 29, 29, 0.5)"
					>
						<CardHeader
							background={"rgba(29, 29, 29, 0.5)"}
							border={"1px solid #111111"}
							borderRadius={"20px 20px 0px 0px"}
							color={"white"}
							backdropBlur={"10px"}
						>
							<HStack>
								<Text fontSize={24} fontWeight={700}>
									Rank
								</Text>
								<Spacer />
								<Text fontSize={24} fontWeight={700}>
									Username
								</Text>
								<Spacer />
								<Text fontSize={24} fontWeight={700}>
									Points
								</Text>
							</HStack>
						</CardHeader>
						<CardBody
							background={"rgba(14, 14, 14, 0.3)"}
							border={"1px solid #111111"}
							textColor={"white"}
							backdropBlur={"10px"}
						>
							<Text>1. @johndoe</Text>
							<Text>2. @janedoe</Text>
							<Text>3. @johndoe</Text>
							<Text>4. @janedoe</Text>
							<Text>5. @johndoe</Text>
						</CardBody>
					</Card>
					<Button
						leftIcon={
							<Image width="15" height="15" src="/icons/cup.svg" alt="swords" />
						}
						m={"7"}
						ml={"-48"}
						fontSize={16}
						textColor={"white"}
						_hover={{
							bg: "gray",
						}}
						fontWeight={400}
						border="1px solid #FFFFFF"
						borderRadius={9999}
						background={"transparent"}
					>
						VIEW LEADERBOARD
					</Button>
				</VStack>
			</Flex>
		</Box>
	);
};
