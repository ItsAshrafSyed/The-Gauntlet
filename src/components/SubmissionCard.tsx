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
} from "@chakra-ui/react";
import UserAvatarLink from "./UserAvatarLink";
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

		console.log(transaction);
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

		console.log(transaction);
	};

	return (
		<Card
			maxWidth={"80%"}
			minWidth={"80%"}
			bg="#111"
			textColor={"white"}
			border={"1px"}
			rounded={"lg"}
		>
			<CardHeader>
				<HStack justify={"space-between"} align="start" mb={2}>
					<UserAvatarLink
						profileId={userProfilePubKey}
						username="Fozzy"
						placeholder={userProfilePubKey}
						avatarUrl={userAvatarUrl?.length ? userAvatarUrl : ""}
						size={["xs", "md"]}
					/>
					<VStack align="start" spacing={0}>
						<Text>submitted {moment(submissionTimestamp).fromNow()}</Text>
						{awarded ? <Badge colorScheme={"yellow"}>Awarded</Badge> : <></>}
					</VStack>
				</HStack>
			</CardHeader>
			<CardBody mt={-4}>
				<Text>{submission}</Text>
			</CardBody>
			<CardFooter>
				<HStack>
					{hasProfile ? (
						isModerator ? (
							<>
								<Button onClick={handleAcceptSubmission}>Accept</Button>
								<Button onClick={handleRejectSubmission}>Reject</Button>
							</>
						) : (
							<></>
						)
					) : (
						<></>
					)}
				</HStack>
			</CardFooter>
		</Card>
	);
};

export default SubmissionCard;
