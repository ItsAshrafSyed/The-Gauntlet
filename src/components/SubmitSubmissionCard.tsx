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
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";
import SuccessMessage from "./Modals/SuccessMessage";

export default function SubmitSubmissionCard({
	challengePubKey,
	challengeId,
	userProfilePubKey,
	userAvatarUrl,
}: any) {
	const [submission, setSubmission] = useState<string>("");
	const [createProfileModalOpen, setCreateProfileModalOpen] = useState(false);
	const [canSubmit, setCanSubmit] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const [responseMessage, setResponseMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { program, wallet, challengerClient, provider } = useWorkspace();
	const walletAdapterModalContext = useWalletModal();
	const { hasProfile } = useSessionUser();
	const router = useRouter();

	useEffect(() => {
		if (!submission) return;

		setCanSubmit(submission.length > 0);
	}, [submission]);

	const handleSubmission = async () => {
		if (!program || !challengerClient) return;
		if (!challengePubKey || !challengeId) return;
		if (!wallet) {
			walletAdapterModalContext.setVisible(true);
			return;
		}
		if (!hasProfile) {
			setCreateProfileModalOpen(true);
			return;
		}
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

			await challengerClient
				?.createSubmission(
					challengePubKey,
					wallet?.publicKey,
					hashedSubmissionAsPubkey
				)
				.then(async (res: any) => {
					await fetchApiResponse({
						url: "/api/submissions",
						method: "POST",
						body: {
							content: submission,
							challengePubKey: challengePubKey,
							challengeId: challengeId,
							authorPubKey: wallet?.publicKey?.toBase58(),
							pubKey: res.submission.toBase58(),
						},
					});
					if (res.txSigMessage) {
						setSubmitted(true);
						setResponseMessage("Successfully submitted your submission");
					} else {
						alert("Something went wrong");
					}
				})
				.then(() => {
					//dealy to allow for 30 sec the tx to be processed
					setTimeout(() => {
						router.reload();
					}, 4500);
				})
				.catch((e) => {
					console.log("error occured in the then block", e);
				});
		} catch (e) {
			console.log("error occured in the try block", e);
			setIsSubmitting(false);
			return;
		}
		setIsSubmitting(false);
		setSubmission("");

		// await fetchApiResponse({
		// 	url: "/api/submissions",
		// 	method: "POST",
		// 	body: {
		// 		content: submission,
		// 		challengePubKey: challengePubKey,
		// 		challengeId: challengeId,
		// 		authorPubKey: wallet?.publicKey?.toBase58(),
		// 	},
		// })
		// 	(async (res: any) => {
		// 		const result = await challengerClient?.createSubmission(
		// 			challengePubKey,
		// 			wallet?.publicKey,
		// 			hashedSubmissionAsPubkey
		// 		);

		// 		await fetchApiResponse({
		// 			url: "/api/submissions",
		// 			method: "PUT",
		// 			body: {
		// 				id: res.data.id,
		// 				pubKey: result?.submission.toBase58(),
		// 			},
		// 		});
		// 		if (result.txSigMessage) {
		// 			setSubmitted(true);
		// 			setResponseMessage("Successfully submitted your submission");
		// 		} else {
		// 			alert("Something went wrong");
		// 		}
		// 	})
	};

	return (
		<>
			<CreateProfileModal
				isOpen={createProfileModalOpen}
				onClose={() => {
					setCreateProfileModalOpen(false);
				}}
			/>
			<Card
				bg="#111"
				rounded={"lg"}
				width={"65vw"}
				textColor={"white"}
				borderBottom={"1px solid #1E1E23"}
				m={"4vh"}
				display={{ base: "none", md: "block" }}
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
				<CardFooter justifyContent={"end"}>
					<Button
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
						onClick={handleSubmission}
					>
						Submit
					</Button>
				</CardFooter>
			</Card>
			<SuccessMessage
				isOpen={submitted}
				successMessage={responseMessage}
				onClose={() => setSubmitted(false)}
			/>
		</>
	);
}
