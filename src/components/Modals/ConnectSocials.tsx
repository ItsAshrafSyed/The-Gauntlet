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

type FailureMessageProps = {
	failureMessage: string;
	isOpen: boolean;
	onClose: () => void;
	onOpen?: () => void;
};

const FailureMessage: FC<FailureMessageProps> = ({
	isOpen,
	failureMessage,
	onClose,
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent bg="#111" border={"1px solid #E5E7EB"}>
				<ModalHeader color={"Red"}>Failed</ModalHeader>
				<ModalCloseButton />
				<ModalBody>{failureMessage}</ModalBody>
				<ModalFooter>
					<button onClick={onClose}>Close</button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default FailureMessage;
