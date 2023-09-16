import {
	Badge,
	Card,
	CardBody,
	CardHeader,
	HStack,
	VStack,
	Text,
	CardFooter,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
} from "@chakra-ui/react";
import UserAvatarLink from "./UserAvatarLink";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSessionUser } from "../providers/SessionUserProvider";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { getSubmissionStateFromString } from "@/util/lib";

const SubmissionCard = ({
	submission,
	submissionTimestamp,
	userAvatarUrl,
	userProfilePubKey,
	submissionPubKey,
	awarded,
}: any) => {
	const { isModerator, hasProfile } = useSessionUser();
	const { program, wallet, challengerClient } = useWorkspace();
	const [completed, setCompleted] = useState(false);
	const [rejected, setRejected] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isModalOpen,
		onOpen: onModalOpen,
		onClose: onModalClose,
	} = useDisclosure();

	useEffect(() => {
		const checkSubmissionState = async () => {
			if (
				!program ||
				!wallet ||
				!isModerator ||
				!hasProfile ||
				!challengerClient
			)
				return;
			// try {
			// 	const submissionState = await program?.account.submission.fetchNullable(
			// 		submissionPubKey
			// 	);
			// 	if (submissionState?.) {
			// 		setCompleted(true);
			// 		return;
			// 	}
			// 	if (submissionState?.submissionState.rejected) {
			// 		setRejected(true);
			// 		return;
			// 	}
			// } catch (e) {
			// 	console.log("error occured in catch block in submission card");
			// }
		};
		checkSubmissionState();
	}, [
		program,
		wallet,
		isModerator,
		hasProfile,
		challengerClient,
		submissionPubKey,
	]);

	const handleAcceptSubmission = async () => {
		if (!program || !wallet || !isModerator || !hasProfile || !challengerClient)
			return;
		const submissionState = getSubmissionStateFromString("Completed");

		const transaction = await challengerClient.evaluateSubmission(
			submissionPubKey,
			wallet.publicKey,
			// @ts-ignore hack to support Anchor enums
			submissionState
		);
		if (transaction) {
			onOpen();
		}
	};
	const handleRejectSubmission = async () => {
		if (!program || !wallet || !isModerator || !hasProfile || !challengerClient)
			return;
		const submissionState = getSubmissionStateFromString("Rejected");

		const transaction = await challengerClient.evaluateSubmission(
			submissionPubKey,
			wallet.publicKey,
			// @ts-ignore hack to support Anchor enums
			submissionState
		);

		if (transaction) {
			onModalOpen();
		}
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
					<ModalBody>Successfully Rejected Submission</ModalBody>

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
					textColor={"green"}
					background="rgba(0, 0, 0, 0.5)"
					border={"1px solid #E5E7EB"}
				>
					<ModalHeader>Success</ModalHeader>
					<ModalCloseButton />
					<ModalBody>Successfully Approved Submission</ModalBody>

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
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Card
				maxWidth={"70%"}
				minWidth={"70%"}
				bg="#111"
				textColor={"white"}
				border={"1px"}
				rounded={"lg"}
				padding={"3"}
			>
				<HStack justify={"space-between"} align="start" mb={2} mt={2}>
					<UserAvatarLink
						profileId={userProfilePubKey}
						username="Fozzy"
						placeholder={userProfilePubKey}
						avatarUrl={userAvatarUrl?.length ? userAvatarUrl : ""}
						size={["xs", "md"]}
					/>
					<Text fontSize={"18"} fontWeight={"500"}>
						{submission}
					</Text>
					<VStack align="start" spacing={0}>
						<Text fontSize={"15"} color={"gray.400"}>
							submitted {moment(submissionTimestamp).fromNow()}
						</Text>
					</VStack>
				</HStack>

				<HStack justify={"end"}>
					{hasProfile &&
						isModerator &&
						(completed || rejected ? (
							<>
								<Button
									background="#FFB84D"
									borderRadius={"8"}
									variant={"solid"}
									textColor={"white"}
									_hover={{
										bg: "#FFB84D",
									}}
								>
									{completed ? "Accepted" : "Rejected"}
								</Button>
							</>
						) : (
							<>
								<Button
									size={"sm"}
									border="1px solid #FFB84D"
									borderRadius={"8"}
									background="#261B0B"
									variant={"solid"}
									textColor={"white"}
									_hover={{
										bg: "transparent",
									}}
									onClick={handleAcceptSubmission}
								>
									Accept
								</Button>
								<Button
									size={"sm"}
									border="1px solid #FFB84D"
									borderRadius={"8"}
									background="#261B0B"
									variant={"solid"}
									textColor={"white"}
									_hover={{
										bg: "transparent",
									}}
									onClick={handleRejectSubmission}
								>
									Reject
								</Button>
							</>
						))}
				</HStack>
			</Card>
		</>
	);
};

export default SubmissionCard;
