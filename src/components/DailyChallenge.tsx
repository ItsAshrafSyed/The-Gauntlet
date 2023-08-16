import {
	Box,
	HStack,
	Text,
	VStack,
	Image,
	Card,
	CardHeader,
	CardBody,
	AbsoluteCenter,
	Flex,
	Button,
	SimpleGrid,
} from "@chakra-ui/react";
import { text } from "stream/consumers";

export const DailyChallenge = () => {
	return (
		<Box position={"relative"} mt={9} ml={"22vh"}>
			<Flex>
				<Card
					alignItems={"center"}
					width={"140vh"}
					background={" #111"}
					textColor={"white"}
					borderRadius={"20"}
				>
					<CardHeader fontFamily={"Inter"} fontSize={"48"} fontWeight={"700"}>
						<Text>Daily Challenge</Text>
					</CardHeader>
					<Text fontFamily={"Inter"} fontSize={"24"} fontWeight={"600"}>
						Login every day and claim rewards
					</Text>
					<CardBody>
						<HStack spacing={3}>
							<Card
								borderRadius={"20"}
								width={"17vh"}
								background={"#222"}
								textColor={"white"}
								alignItems={"center"}
							>
								<CardHeader fontWeight={"600"}>Day 1</CardHeader>
								<CardBody fontWeight={"500"} mt={"-5"}>
									<HStack>
										<Image width="5" height="5" src="/icons/xp.svg" alt="xp" />
										<Text>1</Text>
									</HStack>
								</CardBody>
							</Card>
							<Card
								borderRadius={"20"}
								width={"17vh"}
								background={"#222"}
								textColor={"white"}
								alignItems={"center"}
							>
								<CardHeader fontWeight={"600"}>Day 2</CardHeader>
								<CardBody fontWeight={"500"} mt={"-5"}>
									<HStack>
										<Image width="5" height="5" src="/icons/xp.svg" alt="xp" />
										<Text>2</Text>
									</HStack>
								</CardBody>
							</Card>
							<Card
								borderRadius={"20"}
								width={"17vh"}
								background={"#222"}
								textColor={"white"}
								alignItems={"center"}
							>
								<CardHeader fontWeight={"600"}>Day 3</CardHeader>
								<CardBody fontWeight={"500"} mt={"-5"}>
									<HStack>
										<Image width="5" height="5" src="/icons/xp.svg" alt="xp" />
										<Text>3</Text>
									</HStack>
								</CardBody>
							</Card>
							<Card
								borderRadius={"20"}
								width={"17vh"}
								background={"#222"}
								textColor={"white"}
								alignItems={"center"}
							>
								<CardHeader fontWeight={"600"}>Day 4</CardHeader>
								<CardBody fontWeight={"500"} mt={"-5"}>
									<HStack>
										<Image width="5" height="5" src="/icons/xp.svg" alt="xp" />
										<Text>4</Text>
									</HStack>
								</CardBody>
							</Card>
							<Card
								borderRadius={"20"}
								width={"17vh"}
								background={"#222"}
								textColor={"white"}
								alignItems={"center"}
							>
								<CardHeader fontWeight={"600"}>Day 5</CardHeader>
								<CardBody fontWeight={"500"} mt={"-5"}>
									<HStack>
										<Image width="5" height="5" src="/icons/xp.svg" alt="xp" />
										<Text>5</Text>
									</HStack>
								</CardBody>
							</Card>
							<Card
								borderRadius={"20"}
								width={"17vh"}
								background={"#222"}
								textColor={"white"}
								alignItems={"center"}
							>
								<CardHeader fontWeight={"600"}>Day 6</CardHeader>
								<CardBody fontWeight={"500"} mt={"-5"}>
									<HStack>
										<Image width="5" height="5" src="/icons/xp.svg" alt="xp" />
										<Text>6</Text>
									</HStack>
								</CardBody>
							</Card>
							<Card
								borderRadius={"20"}
								width={"17vh"}
								background={"#222"}
								textColor={"white"}
								alignItems={"center"}
							>
								<CardHeader fontWeight={"600"}>Day 7</CardHeader>
								<CardBody fontWeight={"500"} mt={"-5"}>
									<HStack>
										<Image width="5" height="5" src="/icons/xp.svg" alt="xp" />
										<Text>7</Text>
									</HStack>
								</CardBody>
							</Card>
						</HStack>
					</CardBody>
					<Button
						width={"20vh"}
						borderRadius={"9999"}
						mt={"3"}
						mb={"8"}
						background={"#222"}
						textColor={"white"}
						alignItems={"center"}
						fontSize={"14"}
						fontWeight={"400"}
						border="1px solid #E5E7EB"
						backgroundColor={"#9055DD"}
						_hover={{ background: "transparent" }}
						rightIcon={
							<Image width="5" height="5" src="/icons/xp.svg" alt="xp" />
						}
					>
						<Text>CLAIM</Text>
					</Button>
				</Card>
			</Flex>
			<Button
				leftIcon={
					<Image width="15" height="15" src="/icons/plus.svg" alt="plus" />
				}
				m={7}
				position={"absolute"}
				right={"20vh"}
				borderRadius="9999"
				variant="solid"
				fontSize={14}
				width={"33vh"}
				height={"6vh"}
				textColor="white"
				fontWeight={400}
				border="1px solid #E5E7EB"
				_hover={{
					bg: "transparent",
				}}
				background={
					"linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(44.76deg, #7147F8 3%, #B34CF0 48.43%, #D74FEC 93.01%);"
				}
			>
				CREATE CHALLENGE
			</Button>
		</Box>
	);
};
