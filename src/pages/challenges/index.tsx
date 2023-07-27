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
import { useRouter } from "next/router";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { DailyChallenge } from "../../../components/DailyChallenge";
import { on } from "events";

export default function Challenges() {
	const Router = useRouter();
	const [hasProfile, setHasProfile] = useState(false);
	const [isModerator, setIsModerator] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { provider, program, challengerClient, wallet } = useWorkspace();

	return (
		<>
			<Box position={"relative"}>
				<DailyChallenge />
			</Box>
		</>
	);
}

{
	/* <Modal isOpen={isOpen} onClose={onClose}>
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
