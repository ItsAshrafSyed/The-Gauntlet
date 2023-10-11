import { Card, HStack, VStack, Text, Button } from "@chakra-ui/react";
import UserAvatarLink from "./UserAvatarLink";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSessionUser } from "../providers/SessionUserProvider";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { getSubmissionStateFromString } from "@/util/lib";
import { useRouter } from "next/router";
import ContentWithLinks from "./ContentWithLinks";

const SubmissionCard = ({
	submission,
	submissionTimestamp,
	userAvatarUrl,
	userProfilePubKey,
	submissionPubKey,
}: any) => {
	const { isModerator, hasProfile, userPublicKey } = useSessionUser();
	const { program, wallet, challengerClient } = useWorkspace();
	const [isAcceptHandled, setIsAcceptHandled] = useState(false);
	const [isRejectHandled, setIsRejectHandled] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [rejected, setRejected] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const checkSubmissionState = async () => {
			if (!program || !wallet || !hasProfile || !challengerClient) return;
			try {
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

			const transaction = await challengerClient.evaluateSubmission(
				submissionPubKey,
				wallet.publicKey,
				// @ts-ignore hack to support Anchor enums
				submissionState
			);
			if (transaction) {
				alert("Successfully Accepted Submission");
				router.reload();
			}
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

			const transaction = await challengerClient.evaluateSubmission(
				submissionPubKey,
				wallet.publicKey,
				// @ts-ignore hack to support Anchor enums
				submissionState
			);

			if (transaction) {
				alert("Successfully Rejected Submission");
				router.reload();
			}
		} catch (e) {
			console.log(
				"error occured handlerejectsubmission in try block in submission card"
			);
		}

		setIsRejectHandled(false);
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
					</HStack>
					<Text
						alignSelf="flex-start"
						style={{ whiteSpace: "pre-wrap" }}
						px={8}
						fontSize={["12", "12", "18", "18"]}
						fontWeight={"350"}
						textColor={"#AAABAE)"}
					>
						<ContentWithLinks content={submission} />
					</Text>
				</VStack>
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
