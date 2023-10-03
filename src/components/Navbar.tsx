import {
	Box,
	Flex,
	Heading,
	Spacer,
	Image,
	ButtonGroup,
	HStack,
	Button,
	Icon,
	IconButton,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import "@fontsource-variable/readex-pro";
import { WalletConnect } from "./Modals/wallet/WalletConnect";

import { useState } from "react";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";

export const Navbar = () => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState("none");

	const handleHomeClick = () => {
		router.push("/");
		setIsOpen("none");
	};
	const handleLeaderboardClick = () => {
		router.push("/leaderboard");
		setIsOpen("none");
	};
	const handleChallengesClick = () => {
		router.push("/challenges");
		setIsOpen("none");
	};
	return (
		<>
			<Flex
				w="100vw"
				bg={"#0E0E10"}
				blur={"blur(10px)"}
				borderBottom={"1.5px solid #1E1E23"}
				align={"center"}
				justify={"space-between"}
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
				<Box display={["none", "none", "flex", "flex"]}>
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
				<IconButton
					aria-label="Open Menu"
					size={"lg"}
					bg={"#666"}
					icon={<HamburgerIcon />}
					display={["flex", "flex", "none", "none"]}
					onClick={() => setIsOpen("flex")}
				/>
			</Flex>
			<Flex
				w="100vw"
				bg={"rgba(29, 29, 29, 0.5)"}
				backdropBlur={10}
				h={"100vh"}
				zIndex={20}
				overflow={"auto"}
				flexDir={"column"}
				top={"0"}
				left={"0"}
				display={isOpen}
			>
				<Flex justify={"flex-end"}>
					<IconButton
						aria-label="Close Menu"
						size={"lg"}
						bg={"#666"}
						icon={<CloseIcon />}
						onClick={() => setIsOpen("none")}
					/>
				</Flex>
				<Flex flexDir="column" align={"center"} justify={"space-evenly"}>
					<Button
						colorScheme="white"
						variant="ghost"
						fontWeight={500}
						fontSize={20}
						onClick={handleHomeClick}
					>
						Home
					</Button>
					<Button
						colorScheme="white"
						variant="ghost"
						fontWeight={500}
						fontSize={20}
						onClick={handleLeaderboardClick}
					>
						Leaderboard
					</Button>
					<Button
						colorScheme="white"
						variant="ghost"
						fontWeight={500}
						fontSize={20}
						onClick={handleChallengesClick}
					>
						View Challenges
					</Button>

					<WalletConnect />
				</Flex>
			</Flex>
		</>
	);
};
