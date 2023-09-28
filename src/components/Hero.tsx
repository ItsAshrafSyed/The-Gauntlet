import {
	Box,
	Flex,
	Image,
	Button,
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
	Container,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { useSessionUser } from "../providers/SessionUserProvider";
import { CHALLENGER_PROGRAM_ID, CRUX_KEY } from "../util/constants";
import { PublicKey } from "@solana/web3.js";
import { fetchApiResponse } from "../util/lib";
import "@fontsource-variable/readex-pro";

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

	return (
		<>
			<Flex position="relative" minW={"100vw"}>
				<Image
					position="absolute"
					objectFit={"cover"}
					//filter="blur(0.35px)"
					width="100%"
					height="100%"
					zIndex={-3}
					src="/images/bg.jpeg"
					alt="bgimg"
				/>
				<Flex
					justifyContent="center"
					alignItems="center"
					height="100vh"
					width="100vw"
				>
					<Box>
						<Text
							fontSize="64"
							fontWeight={600}
							textAlign={"center"}
							textTransform={"uppercase"}
							color={"#F4F4F4"}
							fontFamily={"Readex Pro Variable"}
							textShadow="-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000"
						>
							The Gauntlet
						</Text>
						<Text
							fontSize="20"
							textAlign={"center"}
							fontWeight={400}
							color={"#cfcfcf"}
							textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"
						>
							Complete Challenges. Develop New Skills. Earn Rewards. Share Your
							Achievements.
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
								_hover={{
									bg: "transparent",
								}}
								textColor={"white"}
								fontWeight={400}
								border="1px solid #FFB84D"
								borderRadius={"8"}
								background="#261B0B"
								// onClick={handleChallengesClick}
								onClick={() => router.push("/challenges")}
							>
								VIEW CHALLENGES
							</Button>
						</Center>
					</Box>
				</Flex>
			</Flex>
		</>
	);
};
