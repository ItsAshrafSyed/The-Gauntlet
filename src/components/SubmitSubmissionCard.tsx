import {
	Card,
	CardBody,
	HStack,
	Textarea,
	Box,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalCloseButton,
	useDisclosure,
	ModalBody,
	CardFooter,
	Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import UserAvatarLink from "./UserAvatarLink";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { fetchApiResponse } from "../util/lib";
import { useSessionUser } from "../providers/SessionUserProvider";
import CreateProfileModal from "./Modals/CreateProfileModal";
import { useRouter } from "next/router";

export default function SubmitSubmissionCard({
	challengePubKey,
	challengeId,
	userProfilePubKey,
	userAvatarUrl,
}: any) {
	const [submission, setSubmission] = useState<string>("");
	const [createProfileModalOpen, setCreateProfileModalOpen] = useState(false);
	const [canSubmit, setCanSubmit] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { program, wallet, challengerClient, provider } = useWorkspace();
	const walletAdapterModalContext = useWalletModal();
	const { hasProfile } = useSessionUser();
	const router = useRouter();

	useEffect(() => {
		if (!submission) return;

		setCanSubmit(submission.length > 0);
	}, [submission]);

	const handleSubmitClick = () => {
		if (wallet) {
			if (hasProfile) {
				handleSubmission();
			} else {
				setCreateProfileModalOpen(true);
			}
		} else {
			console.log("wallet not connected");
			// show the wallet adapter setVisible(true);
		}
	};

	const handleSubmission = async () => {
		if (!program || !challengerClient) return;
		if (!challengePubKey || !challengeId) return;
		if (!wallet) {
			walletAdapterModalContext.setVisible(true);
			return;
		}
		console.log("handleSubmission");
		setIsSubmitting(true);
		try {
			const hashedSubmissionJson = await (
				await fetch("/api/hash", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ toHash: submission }),
				})
			).json();
			const hashedSubmissionAsPubkey = new PublicKey(
				hashedSubmissionJson.output.data as Buffer
			);

			await fetchApiResponse({
				url: "/api/submissions",
				method: "POST",
				body: {
					content: submission,
					challengePubKey: challengePubKey,
					challengeId: challengeId,
					authorPubKey: wallet?.publicKey?.toBase58(),
				},
			})
				.then(async (res: any) => {
					const result = await challengerClient?.createSubmission(
						challengePubKey,
						wallet?.publicKey,
						hashedSubmissionAsPubkey
					);

					await fetchApiResponse({
						url: "/api/submissions",
						method: "PUT",
						body: {
							id: res.data.id,
							pubKey: result?.submission.toBase58(),
						},
					});
				})
				.catch((e) => {
					console.log("error occured in the catch block", e);
				});
			//	onOpen();
		} catch (e) {
			console.log("error occured in the try block", e);
			setIsSubmitting(false);
			return;
		}
		setIsSubmitting(false);
		setSubmission("");
	};

	const openModal = () => {
		setCreateProfileModalOpen(true);
	};

	const closeModal = () => {
		setCreateProfileModalOpen(false);
	};

	return (
		<>
			<CreateProfileModal
				isOpen={createProfileModalOpen}
				onClose={closeModal}
			/>
			{/* <Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					textColor={"green"}
					background="rgba(0, 0, 0, 0.5)"
					border={"1px solid #E5E7EB"}
				>
					<ModalHeader>Success</ModalHeader>
					<ModalCloseButton />
					<ModalBody>Successfully submitted submission</ModalBody>

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
			</Modal> */}
			<Card
				bg="#111"
				rounded={"lg"}
				width={"65vw"}
				textColor={"white"}
				borderBottom={"1px solid #1E1E23"}
				m={"4vh"}
			>
				<CardBody>
					<HStack justify={"space-between"} align="start">
						<UserAvatarLink
							profileId={userProfilePubKey}
							placeholder={userProfilePubKey}
							avatarUrl={userAvatarUrl?.length ? userAvatarUrl : ""}
							size={["xs", "md"]}
						/>
						<Textarea
							height={"15vh"}
							placeholder="Make your own submission, start typing here"
							value={submission}
							onChange={(e) => setSubmission(e.target.value)}
							border={"1px solid  #1E1E23"}
							_hover={{
								border: "1px solid #FFB84D",
							}}
							focusBorderColor={"#FFB84D"}
						/>
					</HStack>
				</CardBody>
				<CardFooter justifyContent={"end"} h={"8vh"}>
					<Button
						mt={"-3vh"}
						isLoading={isSubmitting}
						isDisabled={!canSubmit}
						border="1px solid #FFB84D"
						borderRadius={"8"}
						background="#261B0B"
						variant={"solid"}
						textColor={"white"}
						_hover={{
							bg: "transparent",
						}}
						onClick={handleSubmitClick}
					>
						Submit
					</Button>
				</CardFooter>
			</Card>
		</>
	);
}
