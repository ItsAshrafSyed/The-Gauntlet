import {
	Box,
	Flex,
	Heading,
	Spacer,
	Image,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	ButtonGroup,
	HStack,
	Button,
	MenuButton,
	Menu,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import "@fontsource-variable/readex-pro";
import { WalletConnect } from "./Modals/wallet/WalletConnect";

export const Navbar = () => {
	const router = useRouter();
	return (
		<>
			<Flex
				blur={"blur(10px)"}
				height="10vh"
				p="3"
				borderBottom={"1.5px solid #666"}
			>
				<Box p="2" onClick={() => router.push("/")}>
					<HStack>
						<Image src="/icons/logo.png" width={10} height={9} alt="logo" />
						<Heading
							size="md"
							fontWeight={500}
							fontSize={24}
							fontFamily={"Readex Pro Variable"}
						>
							The Gauntlet
						</Heading>
					</HStack>
				</Box>
				<Spacer />
				<Box>
					<ButtonGroup spacing={"0.5"}>
						<Button
							colorScheme="white"
							variant="ghost"
							fontWeight={500}
							fontSize={20}
							onClick={() => router.push("/")}
						>
							Home
						</Button>
						<Button
							colorScheme="white"
							variant="ghost"
							fontWeight={500}
							fontSize={20}
							onClick={() => router.push("/leaderboard")}
						>
							Leaderboard
						</Button>
						<Button
							colorScheme="white"
							variant="ghost"
							fontWeight={500}
							fontSize={20}
							onClick={() => router.push("/challenges")}
						>
							View Challenges
						</Button>
					</ButtonGroup>

					<WalletConnect />
				</Box>
			</Flex>
		</>
	);
};
