import {
	Box,
	Flex,
	Heading,
	Spacer,
	Image,
	ButtonGroup,
	HStack,
	Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export const Navbar = () => {
	const router = useRouter();
	return (
		<Flex
			bg={"black"}
			height="7%"
			p="3"
			borderBlockEndColor={"white"}
			borderBottomColor={"gray.500"}
			borderBottomWidth={0.1}
		>
			<Box
				p="2"
				onClick={() => {
					window.location.href = "/";
				}}
			>
				<HStack>
					<Image src="/icons/logo.png" width={10} height={9} alt="logo" />
					<Heading size="md" fontWeight={400} fontSize={24}>
						Challenger
					</Heading>
				</HStack>
			</Box>
			<Spacer />
			<Box>
				<ButtonGroup spacing={7} fontFamily={"Inter"}>
					<Button
						colorScheme="white"
						variant="link"
						fontWeight={500}
						fontSize={20}

						// onClick={() => router.push("/")}
					>
						Home
					</Button>
					<Button
						colorScheme="white"
						variant="link"
						fontWeight={500}
						fontSize={20}
						// onClick={() => router.push("/about")}
					>
						Leader Board
					</Button>
					<Button
						colorScheme="white"
						variant="link"
						fontWeight={500}
						fontSize={20}
						onClick={() => {
							window.location.href = "/challenges";
						}}
					>
						Challenges
					</Button>
					<Button
						borderRadius="9999"
						variant="solid"
						_hover={{
							bg: "transparent",
						}}
						fontSize={14}
						textColor="white"
						fontWeight={400}
						border="1px solid #E5E7EB"
						background={
							"linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(44.76deg, #7147F8 3%, #B34CF0 48.43%, #D74FEC 93.01%);"
						}
					>
						CONNECT
					</Button>
				</ButtonGroup>
			</Box>
		</Flex>
	);
};
