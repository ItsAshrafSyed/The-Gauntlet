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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWorkspace } from "../src/providers/WorkspaceProvider";
import { CHALLENGER_PROGRAM_ID, CRUX_KEY } from "../src/util/constants";
import { PublicKey } from "@solana/web3.js";
import { fetchApiResponse } from "../src/util/lib";

const WalletMultiButtonDynamic = dynamic(
	async () =>
		(await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
	{ ssr: false }
);

export const Navbar = () => {
	const router = useRouter();
	const [hasProfile, setHasProfile] = useState(false);
	const [profile, setProfile] = useState<any>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const walletAdapterModalContext = useWalletModal();

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
			setHasProfile(profileAccount ? true : false);
		}
		checkProfile();
	}, [provider, program, profile, provider?.wallet, walletAdapterModalContext]);

	const handleChallengesClick = () => {
		if (wallet) {
			if (hasProfile) {
				router.push("/challenges");
			} else {
				onOpen();
			}
		} else {
			walletAdapterModalContext.setVisible(true);
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
		setHasProfile(true);
		setIsSubmitting(false);
		onClose();
	};

	return (
		<>
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
							onClick={() => router.push("/")}
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
							onClick={handleChallengesClick}
						>
							Challenges
						</Button>
						{/* <Button
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
						
					</Button> */}
						<WalletMultiButtonDynamic />
					</ButtonGroup>
				</Box>
			</Flex>
		</>
	);
};
