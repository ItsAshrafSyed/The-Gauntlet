import {
	Box,
	HStack,
	Text,
	VStack,
	Image,
	Card,
	Button,
	CardHeader,
	CardBody,
	IconButton,
	Input,
	InputGroup,
	Icon,
	Center,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Flex,
	InputLeftElement,
	Spacer,
} from "@chakra-ui/react";
import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { CHALLENGER_PROGRAM_ID, CRUX_KEY } from "../../util/constants";
import { useRouter } from "next/router";

import { useWorkspace } from "../../providers/WorkspaceProvider";
import { DailyChallenge } from "../../../components/DailyChallenge";

export default function Challenges() {
	const Router = useRouter();
	const [isModerator, setIsModerator] = useState(false);
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const [hasProfile, setHasProfile] = useState(false);
	const [profile, setProfile] = useState<any>(null);

	useEffect(() => {
		if (!provider) return;
		if (!provider.wallet) return;
		if (!program) return;
		if (profile) {
			setHasProfile(true);
			return;
		}
		const [profilePda] = PublicKey.findProgramAddressSync(
			[
				Buffer.from("user_profile"),
				CRUX_KEY.toBytes(),
				provider.wallet.publicKey.toBytes(),
			],
			CHALLENGER_PROGRAM_ID
		);
		async function checkProfile() {
			const profileAccount = await program?.account.userProfile.fetchNullable(
				profilePda
			);
			console.log(profileAccount?.isModerator);
			setIsModerator(profileAccount?.isModerator ? true : false);
			setHasProfile(profileAccount ? true : false);
		}
		checkProfile();
	}, [provider, program, profile, provider?.wallet]);

	return (
		<>
			{isModerator ? (
				<Box position={"relative"}>
					<HStack m={10} spacing={5}>
						<Button
							leftIcon={
								<Image
									width="15"
									height="15"
									src="/icons/plus.svg"
									alt="plus"
								/>
							}
							position={"absolute"}
							right={"60vh"}
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
							onClick={() => Router.push("/createChallenge")}
						>
							CREATE CHALLENGE
						</Button>

						<Button
							position={"absolute"}
							right={"10vw"}
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
							VIEW SUBMISSIONS
						</Button>
					</HStack>
					<HStack m={"20"}>
						<Text fontSize={"48"} fontWeight={"700"}>
							{" "}
							All Challenges
						</Text>
					</HStack>

					<Card
						mx={"32"}
						position={"absolute"}
						color={"white"}
						width={"40vw"}
						height={"40vh"}
						borderRadius={"16"}
						border={"1px solid var(--grey, #848895)"}
						backgroundColor={"#111"}
					>
						<Text>dynamic data from db</Text>
					</Card>
				</Box>
			) : (
				<Box position={"relative"}>
					<HStack m={"20"}>
						<Text fontSize={"48"} fontWeight={"700"}>
							{" "}
							All Challenges
						</Text>
					</HStack>

					<Card
						mx={"32"}
						position={"absolute"}
						color={"white"}
						width={"40vw"}
						height={"40vh"}
						borderRadius={"16"}
						border={"1px solid var(--grey, #848895)"}
						backgroundColor={"#111"}
					>
						<Text>dynamic data from db</Text>
					</Card>
				</Box>
			)}
		</>
	);
}

{
	/* 
			<Box position={"relative"}>
				<Button
					leftIcon={
						<Image width="15" height="15" src="/icons/plus.svg" alt="plus" />
					}
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

				<Box m="24">
					<HStack>
						<Button
							variant="link"
							color={"white"}
							fontSize={24}
							fontWeight={"500"}
						>
							All
						</Button>
					</HStack>
					<HStack m={"7"} spacing={4} position={"absolute"}>
						<Box>
							<InputGroup>
								<InputLeftElement
									width={10}
									height={10}
									// eslint-disable-next-line react/no-children-prop
									children={<Search2Icon color={"#848895"} />}
								/>
								<Input
									fontSize={16}
									fontWeight={400}
									fontFamily={"Inter"}
									width={"45vh"}
									placeholder="Search Challenges"
									backgroundColor={"#111"}
									borderRadius={"16"}
									border={"1px solid var(--grey, #848895)"}
								/>
							</InputGroup>
						</Box>
					</HStack>
				</Box>
				<Card
					mx={"32"}
					position={"absolute"}
					color={"white"}
					width={"40vw"}
					height={"40vh"}
					borderRadius={"16"}
					border={"1px solid var(--grey, #848895)"}
					backgroundColor={"#111"}
				>
					<Text>dynamic data from db</Text>
				</Card>
			</Box> */
}
