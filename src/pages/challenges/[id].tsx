import { Box, Flex, HStack, Image, Text, Card, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Challenge() {
	const router = useRouter();
	const { challengeId } = router.query;

	return (
		<Box m={"16vh"} position={"relative"}>
			<Flex>
				<Stack>
					<Box textAlign={"left"}>
						<Text fontSize={"64"} fontWeight={"700"} fontFamily={"Inter"}>
							Details About the challenge {challengeId}
						</Text>
						<Text
							width={"70vw"}
							fontSize={"24"}
							fontWeight={"500"}
							fontFamily={"Inter"}
						>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
							a ex veniam, dicta quae quo voluptatibus cum provident mollitia
						</Text>
					</Box>
					<HStack spacing={12} position={"absolute"} my={"38vh"}>
						<Box>
							<Card width={"57vw"} height={"70vh"}>
								<Text>all the rest of the details goes here</Text>
							</Card>
						</Box>
						<Box>
							<Card width={"22vw"} height={"70vh"}>
								<Text>all the rest of the details goes here</Text>
							</Card>
						</Box>
					</HStack>
				</Stack>
			</Flex>
		</Box>
	);
}
