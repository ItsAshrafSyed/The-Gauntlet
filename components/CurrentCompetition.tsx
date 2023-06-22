import {
	Card,
	Box,
	CardHeader,
	CardBody,
	Image,
	Button,
	Text,
	Stack,
	HStack,
	Heading,
	CardFooter,
	VStack,
	Flex,
} from "@chakra-ui/react";

export const CurrentCompetiton = () => {
	return (
		<Box position={"relative"} m={"40"}>
			<Flex>
				<Card
					direction={{ base: "column", sm: "row" }}
					overflow="hidden"
					variant="outline"
					background="rgba(29, 29, 29, 0.5)"
					borderRadius={5}
					width={"140vh"}
					height={"50vh"}
					fontFamily={"Inter"}
					textColor={"white"}
				>
					<CardHeader
						position={"absolute"}
						fontSize={48}
						fontWeight={700}
						ml={"35vh"}
					>
						Current Competition
					</CardHeader>

					<CardBody position={"absolute"} mt={"20"}>
						<HStack>
							<Image
								objectFit="fill"
								width={"60vh"}
								height={"30vh"}
								ml={"4"}
								src="/images/hh.png"
								alt="hh"
							/>
							<VStack ml={"3"} m={3}>
								<Text fontSize={32} fontWeight={700}>
									New York Hacker House
								</Text>

								<Text ml={10}>
									Welcome hackers to the New York Hacker House Challenger
									competition! Earn prizes, rewards, and the ‘Social Club
									Champion’ title 🏆.
								</Text>
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
							</VStack>
						</HStack>
					</CardBody>
				</Card>
			</Flex>
		</Box>
	);
};
