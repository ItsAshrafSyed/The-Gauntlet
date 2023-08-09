import {
	Badge,
	Card,
	CardBody,
	CardHeader,
	HStack,
	VStack,
	Text,
} from "@chakra-ui/react";
import UserAvatarLink from "./UserAvatarLink";
import moment from "moment";

const SubmissionCard = ({
	submission,
	submissionTimestamp,
	userAvatarUrl,
	userProfilePubKey,
	awarded,
}: any) => (
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
	</Card>
);

export default SubmissionCard;
