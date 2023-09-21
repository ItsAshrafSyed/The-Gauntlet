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
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { CHALLENGER_PROGRAM_ID, CRUX_KEY } from "../util/constants";
import { PublicKey } from "@solana/web3.js";
import { fetchApiResponse } from "../util/lib";
import { useSessionUser } from "../providers/SessionUserProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import "@fontsource-variable/readex-pro";
import { shortenWalletAddress } from "../util/lib";
import { AiOutlineDown } from "react-icons/ai";

const WalletMultiButtonDynamic = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
	{ ssr: false }
);

export const Navbar = () => {
	const router = useRouter();
	//const [hasProfile, setHasProfile] = useState(false);
	const { connected, publicKey, disconnect, signMessage } = useWallet();
	const [profile, setProfile] = useState<any>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isModalOpen,
		onOpen: onModalOpen,
		onClose: onModalClose,
	} = useDisclosure();
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const { setVisible } = useWalletModal();
	const { hasProfile } = useSessionUser();

	// useEffect(() => {
	// 	if (!provider) return;
	// 	if (!provider.wallet) return;
	// 	if (!program) return;
	// 	if (profile) {
	// 		// setHasProfile(true);
	// 		return;
	// 	}
	// 	const [profilePda] = PublicKey.findProgramAddressSync(
	// 		[
	// 			Buffer.from("user_profile"),
	// 			CRUX_KEY.toBytes(),
	// 			provider.wallet.publicKey.toBytes(),
	// 		],
	// 		CHALLENGER_PROGRAM_ID
	// 	);
	// 	async function checkProfile() {
	// 		const profileAccount = await program?.account.userProfile.fetchNullable(
	// 			profilePda
	// 		);
	// 		// setHasProfile(profileAccount ? true : false);
	// 	}
	// 	checkProfile();
	// }, [
	// 	provider,
	// 	program,
	// 	profile,
	// 	provider?.wallet,
	// 	walletAdapterModalContext,
	// 	wallet,
	// ]);

	const handleChallengesClick = () => {
		if (wallet) {
			if (hasProfile) {
				router.push("/challenges");
			} else {
				onOpen();
			}
		} else {
			setVisible(true);
		}
	};

	const handleCreateProfile = async () => {
		if (!challengerClient) return;
		if (!provider) return;
		if (!provider.wallet) return;
		setIsSubmitting(true);

		const [profilePda] = PublicKey.findProgramAddressSync(
			[
				Buffer.from("user_profile"),
				CRUX_KEY.toBytes(),
				provider.wallet.publicKey.toBytes(),
			],
			CHALLENGER_PROGRAM_ID
		);

		let profileAccount = await program?.account.userProfile.fetchNullable(
			profilePda
		);

		if (profileAccount) {
			console.log("profile already exists");
			setProfile(profileAccount);
			setIsSubmitting(false);
		}

		try {
			console.log(`creating profile for ${provider.wallet.publicKey}`);
			await challengerClient.createUserProfile(
				CRUX_KEY,
				provider.wallet?.publicKey
			);
			await fetchApiResponse({
				url: `/api/users/`,
				method: "POST",
				body: {
					pubKey: provider.wallet?.publicKey.toBase58(),
					profilePdaPubKey: profilePda.toBase58(),
				},
			});
		} catch (e) {
			console.log(e);
			setIsSubmitting(false);
			return;
		}
		profileAccount = await program?.account.userProfile.fetchNullable(
			profilePda
		);
		setProfile(profileAccount);
		// setHasProfile(true);
		setIsSubmitting(false);
		onClose();
		onModalOpen();
	};

	return (
		<>
			<Modal isOpen={isModalOpen} onClose={onModalClose}>
				<ModalOverlay />
				<ModalContent
					textColor={"green"}
					background="rgba(0, 0, 0, 0.5)"
					border={"1px solid #E5E7EB"}
				>
					<ModalHeader>Success</ModalHeader>
					<ModalCloseButton />
					<ModalBody>Successfully created profile.</ModalBody>

					<ModalFooter>
						<Button
							mr={3}
							onClick={onModalClose}
							borderRadius={"9999"}
							border="1px solid #E5E7EB"
							_hover={{
								bg: "transparent",
								color: "white",
							}}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					textColor={"White"}
					background="rgba(0, 0, 0, 0.5)"
					border={"1px solid #E5E7EB"}
				>
					<ModalHeader>View Challenges</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						To View, Create, and Submit challenges, you must first create a
						profile.
					</ModalBody>

					<ModalFooter>
						<Button
							mr={3}
							onClick={onClose}
							borderRadius={"9999"}
							border="1px solid #E5E7EB"
							_hover={{
								bg: "transparent",
								color: "white",
							}}
						>
							Close
						</Button>
						<Button
							borderRadius="9999"
							variant="solid"
							border="1px solid #E5E7EB"
							background={
								"linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(44.76deg, #7147F8 3%, #B34CF0 48.43%, #D74FEC 93.01%);"
							}
							color={"white"}
							_hover={{
								bg: "transparent",
							}}
							isLoading={isSubmitting}
							onClick={handleCreateProfile}
						>
							Create Profile
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Flex
				bg={"black"}
				height="7%"
				p="3"
				borderBlockEndColor={"white"}
				borderBottomColor={"gray.500"}
				borderBottomWidth={0.1}
			>
				<Box p="2" onClick={() => router.push("/")}>
					<HStack>
						<Image src="/icons/logo.png" width={10} height={9} alt="logo" />
						<Heading size="md" fontWeight={500} fontSize={24}>
							The Gauntlet
						</Heading>
					</HStack>
				</Box>
				<Spacer />
				<Box>
					<ButtonGroup spacing={"0.5"} fontFamily={"Inter"}>
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
							// onClick={handleChallengesClick}
							onClick={() => router.push("/challenges")}
						>
							View Challenges
						</Button>

						{connected && publicKey ? (
							<>
								<Menu>
									<MenuButton
										as={Button}
										bg={"#151519"}
										color={" #FF9728"}
										borderRadius={"16"}
										borderColor={"#1E1E23"}
										_hover={{
											bg: "transparent",
										}}
										_active={{
											bg: "transparent",
										}}
										fontSize={18}
										fontWeight={700}
										fontFamily={"Readex Pro Variable"}
										rightIcon={<AiOutlineDown />}
									>
										{shortenWalletAddress(publicKey?.toBase58())}
									</MenuButton>
									<MenuList
										__css={{
											background: "#151519",
											border: "1px solid #1E1E23",
											fontSize: "18",
											fontFamily: "Readex Pro Variable",
											fontWeight: "800",
											borderRadius: "5",
											width: "fit-content",
											boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
											p: "2",
											mr: "2",
										}}
									>
										<MenuItem bg={"#151519"} onClick={() => disconnect()}>
											Disconnect
										</MenuItem>
									</MenuList>
								</Menu>
							</>
						) : (
							<Button
								borderRadius="8"
								variant="solid"
								_hover={{
									bg: "transparent",
									color: "white",
									border: "1px solid #E5E7EB",
								}}
								fontSize={16}
								textColor="Black"
								fontWeight={700}
								fontFamily={"Readex Pro Variable"}
								onClick={() => setVisible(true)}
								background={"#FF9728"}
							>
								CONNECT WALLET
							</Button>
						)}
						{/* <WalletMultiButtonDynamic /> */}
					</ButtonGroup>
				</Box>
			</Flex>
		</>
	);
};
