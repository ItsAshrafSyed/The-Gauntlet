import {
	Card,
	HStack,
	VStack,
	Text,
	Button,
	IconButton,
	Flex,
	Stack,
	Textarea,
} from "@chakra-ui/react";
import UserAvatarLink from "./UserAvatarLink";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSessionUser } from "../providers/SessionUserProvider";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { fetchApiResponse, getSubmissionStateFromString } from "@/util/lib";
import { useRouter } from "next/router";
import ContentWithLinks from "./ContentWithLinks";
import { FiEdit3 } from "react-icons/fi";
import { PublicKey } from "@solana/web3.js";

const SubmissionCard = ({
	submission,
	submissionId,
	submissionTimestamp,
	userAvatarUrl,
	userProfilePubKey,
	submissionPubKey,
}: any) => {
	const { isModerator, hasProfile, userPublicKey } = useSessionUser();
	const { program, wallet, challengerClient, provider } = useWorkspace();
	const [isAcceptHandled, setIsAcceptHandled] = useState(false);
	const [isRejectHandled, setIsRejectHandled] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [rejected, setRejected] = useState(false);
	const [isEdting, setIsEditing] = useState(false);
	const [submissionContent, setSubmissionContent] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const checkSubmissionState = async () => {
			if (!program || !wallet || !hasProfile || !challengerClient) return;
			try {
				setSubmissionContent(submission);
				const submissionState = await program?.account.submission.fetchNullable(
					submissionPubKey
				);
				if (submissionState?.submissionState.completed) {
					setCompleted(true);
					return;
				}
				if (submissionState?.submissionState.rejected) {
					setRejected(true);
					return;
				}
			} catch (e) {
				console.log("error occured in catch block in submission card");
			}
		};
		checkSubmissionState();
	}, [
		program,
		wallet,
		isModerator,
		submission,
		hasProfile,
		challengerClient,
		submissionPubKey,
	]);

	const handleAcceptSubmission = async () => {
		setIsAcceptHandled(true);
		try {
			if (
				!program ||
				!wallet ||
				!isModerator ||
				!hasProfile ||
				!challengerClient
			)
				return;
			const submissionState = getSubmissionStateFromString("Completed");

			await challengerClient
				.evaluateSubmission(
					submissionPubKey,
					wallet.publicKey,
					// @ts-ignore hack to support Anchor enums
					submissionState
				)
				.then(async () => {
					await fetchApiResponse({
						method: "PUT",
						url: "/api/submissions/",
						body: {
							id: submissionId,
							status: "Completed",
						},
					});
				})
				.then(() => {
					alert("Successfully Accepted Submission");
					router.reload();
				})
				.catch((e) => {
					console.log(
						"error occured in then block  catch in submission card",
						e
					);
				});
		} catch (e) {
			console.log(
				"error occured handleacceptsubmission in try block in submission card"
			);
		}
		setIsAcceptHandled(false);
	};
	const handleRejectSubmission = async () => {
		setIsRejectHandled(true);
		try {
			if (
				!program ||
				!wallet ||
				!isModerator ||
				!hasProfile ||
				!challengerClient
			)
				return;
			const submissionState = getSubmissionStateFromString("Rejected");

			await challengerClient
				.evaluateSubmission(
					submissionPubKey,
					wallet.publicKey,
					// @ts-ignore hack to support Anchor enums
					submissionState
				)
				.then(async () => {
					await fetchApiResponse({
						method: "PUT",
						url: "/api/submissions/",
						body: {
							id: submissionId,
							status: "Rejected",
						},
					});
				})
				.then(() => {
					alert("Successfully Rejected Submission");
					router.reload();
				})
				.catch((e) => {
					console.log(
						"error occured in then block  catch in submission card",
						e
					);
				});
		} catch (e) {
			console.log(
				"error occured handlerejectsubmission in try block in submission card"
			);
		}

		setIsRejectHandled(false);
	};

	const handleEditSubmission = async () => {
		try {
			setIsLoading(true);
			const hashedSubmissionJson = await (
				await fetch("/api/hash", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ toHash: submissionContent }),
				})
			).json();
			const hashedSubmissionAsPubkey = new PublicKey(
				hashedSubmissionJson.output.data as Buffer
			);

			await challengerClient
				?.editSubmission(
					submissionPubKey,
					wallet?.publicKey ?? userProfilePubKey,
					hashedSubmissionAsPubkey
				)
				.then(async (res: any) => {
					await fetchApiResponse({
						url: `/api/submissions/${submissionId}`,
						method: "PUT",
						body: {
							id: submissionId,
							content: submissionContent,
							contentHash: hashedSubmissionAsPubkey.toBase58(),
							pubKey: res.submission.toBase58(),
						},
					});
				})
				.then(async () => {
					await fetchApiResponse({
						method: "PUT",
						url: "/api/submissions/",
						body: {
							id: submissionId,
							status: null,
						},
					});
				})
				.then(() => {
					setIsEditing(false);
					setIsLoading(false);
					alert("Successfully edited your submission");
					setTimeout(() => {
						router.reload();
					}, 1000);
				})
				.catch((e) => {
					console.log("error occured in the then block", e);
				});
			setIsLoading(false);
		} catch (e) {
			console.log(
				"error occured in handleEditSubmission in submission card",
				e
			);
		}
	};

	return (
		<>
			<Card
				bg="#111"
				textColor={"white"}
				width={{ base: "90vw", md: "65vw" }}
				border={"1px solid #1E1E23"}
				rounded={"lg"}
				padding={"3"}
			>
				<VStack justifyContent="space-between" mb={2} mt={2}>
					<HStack alignSelf="flex-start">
						<UserAvatarLink
							profileId={userProfilePubKey}
							username="Fozzy"
							placeholder={userProfilePubKey}
							avatarUrl={userAvatarUrl?.length ? userAvatarUrl : ""}
							size={["xs", "md"]}
						/>
						<Text
							fontSize={["8", "8", "15", "15"]}
							color="gray.400"
							whiteSpace="nowrap"
						>
							{moment(submissionTimestamp).fromNow()}
						</Text>
						{userProfilePubKey === userPublicKey && (
							<IconButton
								aria-label="Edit Submission"
								icon={<FiEdit3 />}
								size="sm"
								bg="#FFB84D"
								borderRadius={"8"}
								variant={"ghost"}
								isDisabled={completed}
								onClick={() => setIsEditing(!isEdting)}
							/>
						)}
					</HStack>

					{isEdting ? (
						<>
							<Textarea
								value={submissionContent}
								onChange={(e) => setSubmissionContent(e.target.value)}
							/>
							<Button
								variant={"solid"}
								textColor={"white"}
								_hover={{
									bg: "transparent",
								}}
								border="1px solid #FFB84D"
								borderRadius={"8"}
								background="#261B0B"
								isLoading={isLoading}
								onClick={handleEditSubmission}
							>
								Submit
							</Button>
						</>
					) : (
						<Text
							alignSelf="flex-start"
							style={{ whiteSpace: "pre-wrap" }}
							px={8}
							fontSize={["12", "12", "18", "18"]}
							fontWeight={"350"}
							textColor={"#AAABAE)"}
							width={{ base: "90vw", md: "65vw" }}
						>
							<ContentWithLinks content={submission} />
						</Text>
					)}
				</VStack>
				{!isEdting && (
					<HStack justify={"end"}>
						{completed || rejected ? (
							userProfilePubKey === userPublicKey && (
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
							)
						) : (
							<></>
						)}
					</HStack>
				)}

				<HStack justify={"end"}>
					{hasProfile &&
						isModerator &&
						(completed || rejected ? (
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
									isLoading={isAcceptHandled}
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
									isLoading={isRejectHandled}
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
