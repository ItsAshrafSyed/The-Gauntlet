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
} from "@chakra-ui/react";
import { relative } from "path";

export const Hero = () => {
	return (
		<>
			<Box position="relative">
				<Image
					position="absolute"
					objectFit={"cover"}
					width="1000"
					height="800"
					zIndex={-1}
					src="/images/left_unsplash.png"
					alt="bgimg"
				/>
				<Flex justifyContent="center" alignItems="center" height="100vh">
					<Box>
						<Text justifyItems="center" fontSize="96" fontWeight={700}>
							Challenger
						</Text>
						<Text fontSize="28" fontWeight={400}>
							Complete Challenges. Develop New Skills.
						</Text>
						<Text fontSize="28" fontWeight={400}>
							{" "}
							Earn Rewards. Share Your Achievements.
						</Text>
						<Center p={7}>
							<Button
								leftIcon={
									<Image
										width="15"
										height="15"
										src="/icons/swords.svg"
										alt="swords"
									/>
								}
								fontSize={16}
								textColor={"white"}
								fontWeight={400}
								border="1px solid #FFFFFF"
								borderRadius={9999}
								background="linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(44.76deg, #7147F8 3%, #B34CF0 48.43%, #D74FEC 93.01%);"
							>
								VIEW CHALLENGES
							</Button>
						</Center>
					</Box>
				</Flex>
				<Image
					position="absolute"
					objectFit={"cover"}
					width="1340"
					height="800"
					top={0}
					right={0}
					zIndex={-2}
					src="/images/right_unsplash.png"
					alt="bgimg"
				/>
			</Box>
		</>
	);
};
