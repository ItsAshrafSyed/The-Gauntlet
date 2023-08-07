import {
	Card,
	CardBody,
	HStack,
	Textarea,
	CardFooter,
	Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import UserAvatarLink from "./UserAvatarLink";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import { fetchApiResponse } from "../util/lib";

export default function SubmissionCard({
	challengePubKey,
	challengeId,
	userProfilePubKey,
	userAvatarUrl,
}: any) {
	const [submission, setSubmission] = useState<string>("");
	const [canSubmit, setCanSubmit] = useState<boolean>(false);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const { program, wallet, challengerClient, provider } = useWorkspace();
	const walletAdapterModalContext = useWalletModal();

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
					const contentDataUrl = `https://challenger-hyt7.vercel.app/challenges/${challengeId}/${res.data.id}`;
					const result = await challengerClient?.createSubmission(
						challengePubKey,
						wallet?.publicKey,
						hashedSubmissionAsPubkey,
						contentDataUrl
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
		} catch (e) {
			console.log("error occured in the try block", e);
			setIsSubmitting(false);
			return;
		}
		setIsSubmitting(false);
		setSubmission("");
	};

	return (
		<Card
			bg="#111"
			rounded={"lg"}
			width={"70vw"}
			textColor={"white"}
			border={"1px"}
			m={"4vh"}
		>
			<CardBody>
				<HStack justify={"space-between"} align="start" mb={2}>
					<UserAvatarLink
						profileId={userProfilePubKey}
						placeholder={userProfilePubKey}
						avatarUrl={userAvatarUrl?.length ? userAvatarUrl : ""}
						size={["xs", "md"]}
					/>
					<Textarea
						placeholder="Enter your submission here"
						value={submission}
						onChange={(e) => setSubmission(e.target.value)}
					/>
				</HStack>
			</CardBody>
			<CardFooter mt={-4} justifyContent={"end"}>
				<Button
					colorScheme="yellow"
					isLoading={isSubmitting}
					isDisabled={!canSubmit}
					onClick={handleSubmission}
				>
					Submit
				</Button>
			</CardFooter>
		</Card>
	);
}
