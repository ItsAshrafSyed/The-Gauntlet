import {
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
} from "@chakra-ui/react";
import { FC } from "react";

type CreateProfileModalProps = {
	openModal: boolean;
};

const CreateProfileModal: FC<CreateProfileModalProps> = (props) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	if (props.openModal) {
		onOpen();
	}
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
						>
							Create Profile
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreateProfileModal;
