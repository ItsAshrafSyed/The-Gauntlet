import {
	Box,
	Flex,
	Heading,
	Image,
	Spacer,
	ButtonGroup,
	Button,
	CardHeader,
	AbsoluteCenter,
	Center,
	Text,
	VStack,
	Card,
	CardBody,
	SimpleGrid,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	HStack,
} from "@chakra-ui/react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { TopActiveUsers } from "./TopActiveUsers";
import { UpcomingEvents } from "./UpcomingEvens";
import { useWorkspace } from "../src/providers/WorkspaceProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const CreateOwnChallenge = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { provider, program, forumClient, wallet } = useWorkspace();
	const walletAdapterModalContext = useWalletModal();
	const [hasProfile, setHasProfile] = useState(false);

	const handleCreateChallege = () => {
		if (wallet?.publicKey) {
			hasProfile
				? Router.push("/createChallenge")
				: Router.push("/createProfile");
		} else {
			walletAdapterModalContext.setVisible(true);
		}
	};

	const Router = useRouter();
	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Modal Title</ModalHeader>
					<ModalCloseButton />
					<ModalBody textColor={"black"}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae,
						cumque. A voluptatum sapiente officia reiciendis saepe ullam
						mollitia tempora, neque fuga doloremque magnam consequuntur autem
						voluptates atque quibusdam, ex eos!
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button variant="ghost">Secondary Action</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Box position="relative">
				<Box m={"36"} mt={"85vh"}>
					<HStack>
						<Image
							width="60%"
							height="150%"
							position={"absolute"}
							right={"0"}
							zIndex="-1"
							objectFit={"fill"}
							src="/images/3unsplash.png"
							alt="bgImg"
						/>
						<TopActiveUsers />
						<Spacer />
						<UpcomingEvents />
					</HStack>
				</Box>
				<Box position={"absolute"} mt={-7} ml={"20"}>
					<HStack>
						<Flex>
							<Card
								overflow="hidden"
								background="rgba(29, 29, 29, 0.5)"
								borderRadius={5}
								width={"160vh"}
								height={"55vh"}
								fontFamily={"Inter"}
								textColor={"white"}
							>
								<CardHeader>
									<Center
										fontSize={48}
										fontWeight={700}
										fontFamily={"Inter"}
										mt={"2vh"}
									>
										Create Your Own Challenge
									</Center>
								</CardHeader>
								<CardBody>
									<Text
										fontSize={20}
										fontWeight={400}
										pl={"32"}
										pr={"32"}
										textAlign={"center"}
									>
										The Challenger is a project run by Solana Foundation that is
										aimed to engage and educate participants in events. This
										will be a competition during the events where you will be
										able to compete for Prizes completing the different
										challenges of the event! 🏆
									</Text>
								</CardBody>
								<Button
									leftIcon={
										<Image
											width="15"
											height="15"
											src="/icons/plus.svg"
											alt="plus"
										/>
									}
									borderRadius="9999"
									variant="solid"
									fontSize={14}
									width={"30vh"}
									height={"7vh"}
									ml={"63vh"}
									mb={"6vh"}
									zIndex={1}
									textColor="white"
									fontWeight={400}
									border="1px solid #E5E7EB"
									_hover={{
										bg: "transparent",
									}}
									background={
										"linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(44.76deg, #7147F8 3%, #B34CF0 48.43%, #D74FEC 93.01%);"
									}
									onClick={handleCreateChallege}
								>
									CREATE CHALLENGE
								</Button>
							</Card>
						</Flex>
						<Image
							position={"absolute"}
							zIndex="-1"
							ml={"-20"}
							objectFit={"fill"}
							src="/images/4unsplash.png"
							alt="bgImg"
						/>
					</HStack>
				</Box>
			</Box>
		</>
	);
};
