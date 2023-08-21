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
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { useSessionUser } from "../providers/SessionUserProvider";
import { CHALLENGER_PROGRAM_ID, CRUX_KEY } from "../util/constants";
import { PublicKey } from "@solana/web3.js";
import { fetchApiResponse } from "../util/lib";

export const Hero = () => {
	const router = useRouter();
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const { hasProfile } = useSessionUser();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const walletAdapterModalContext = useWalletModal();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [profile, setProfile] = useState<any>(null);
	const {
		isOpen: isModalOpen,
		onOpen: onModalOpen,
		onClose: onModalClose,
	} = useDisclosure();

	const handleChallengesClick = () => {
		if (wallet) {
			if (!hasProfile) {
				onOpen();
			} else {
				router.push("/challenges");
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
			<Box position="relative">
				{/* <Image
					position="absolute"
					objectFit={"cover"}
					width="1000"
					height="800"
					zIndex={-1}
					src="/images/left_unsplash.png"
					alt="bgimg"
				/> */}
				<Image
					position="absolute"
					objectFit={"cover"}
					width="100%"
					height="100%"
					zIndex={-1}
					src="/images/centre_unsplash.png"
					alt="bgimg"
				/>
				<Flex justifyContent="center" alignItems="center" height="100vh">
					<Box>
						<Text
							fontSize="64"
							fontWeight={600}
							textAlign={"center"}
							textTransform={"uppercase"}
							color={"#F4F4F4"}
							fontFamily={"Readex Pro"}
						>
							The Gauntlet
						</Text>
						<Text
							fontSize="20"
							textAlign={"center"}
							fontWeight={400}
							color={"#A0A0A0"}
						>
							Complete Challenges. Develop New Skills. Earn Rewards. Share Your
							Achievements.
						</Text>

						{/* <Text fontSize="28" textAlign={"center"} fontWeight={400}>
							Complete Challenges. Develop New Skills.
						</Text>
						<Text fontSize="28" textAlign={"center"} fontWeight={400}>
							Earn Rewards. Share Your Achievements.
						</Text> */}
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
								_hover={{
									bg: "transparent",
								}}
								textColor={"white"}
								fontWeight={400}
								border="1px solid #FFB84D"
								borderRadius={"8"}
								background="#261B0B"
								onClick={handleChallengesClick}
							>
								VIEW CHALLENGES
							</Button>
						</Center>
					</Box>
				</Flex>
				{/* <Image
					position="absolute"
					objectFit={"cover"}
					width="1340"
					height="800"
					top={0}
					right={0}
					zIndex={-2}
					src="/images/right_unsplash.png"
					alt="bgimg"
				/> */}
			</Box>
		</>
	);
};
