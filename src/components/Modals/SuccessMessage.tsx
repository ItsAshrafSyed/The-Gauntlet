import React from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
} from "@chakra-ui/react";
import { FC } from "react";

type SuccessMessageProps = {
	successMessage: string;
	isOpen: boolean;
	onClose: () => void;
	onOpen?: () => void;
};

const SuccessMessage: FC<SuccessMessageProps> = ({
	isOpen,
	successMessage,
	onClose,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent bg="#111" border={"1px solid #E5E7EB"}>
				<ModalHeader color={"green"}>Success</ModalHeader>
				<ModalCloseButton />
				<ModalBody>{successMessage}</ModalBody>
				<ModalFooter>
					<button onClick={onClose}>Close</button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default SuccessMessage;
