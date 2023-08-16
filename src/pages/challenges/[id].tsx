import { useSessionUser } from "@/providers/SessionUserProvider";
import { fetchApiResponse } from "@/util/lib";
import {
	Box,
	Heading,
	Flex,
	HStack,
	Image,
	Text,
	Card,
	Stack,
	Badge,
	Wrap,
	VStack,
	Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ReputationBadge from "../../components/ReputationBadge";
import UserAvatarLink from "../../components/UserAvatarLink";
import SubmissionCard from "../../components/SubmissionCard";
import SubmitSubmissionCard from "../../components/SubmitSubmissionCard";
import moment from "moment";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";

export default function Challenge() {
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [reputation, setReputation] = useState<number>(0);
	const [tags, setTags] = useState<string[]>([]);
	const [authorAvatarUrl, setAuthorAvatarUrl] = useState<string>("");
	const [authorProfileId, setAuthorProfileId] = useState<string>("");
	const [challengeId, setChallengeId] = useState<number>(0);
	const [challengePubKey, setChallengePubKey] = useState<string>("");
	const [submissions, setSubmissions] = useState<any[]>([]);

	const {
		metadata: sessionUserMetadata,
		isConnected,
		isModerator,
		hasProfile,
		publicKey: sessionUserPubKey,
	} = useSessionUser();
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (!id) return;
		async function loadData() {
			try {
				const [challengeResult, submissionResult] = await Promise.all([
					fetchApiResponse<any>({ url: `/api/challenges/${id}` }),
					fetchApiResponse<any>({
						url: `/api/submissions?challengeId=${id}`,
					}),
				]);
				if (!challengeResult.data) {
					router.push("/challenges");
					return;
				}
				const challenge = challengeResult.data.challenge;
				const submissions = submissionResult.data.submissions ?? [];

				let sortedSubmissions = [];
				if (submissions.length > 0) {
					// @ts-ignore Type is any so TS doesn't know this exists
					sortedSubmissions = submissions.sort((a, b) => {
						moment(b.dateUpdated).diff(moment(a.dateUpdated));
					});
				}

				// const challengeAuthor =
				// 	challenge.authorPubKey === sessionUserPubKey
				// 		? {
				// 				avatarUrl: sessionUserMetadata?.avatarUrl,
				// 				pubKey: sessionUserPubKey,
				// 		  }
				// 		: await fetchApiResponse<any>({
				// 				url: `/api/users/${challenge.authorPubKey}`,
				// 		  });
				setAuthorAvatarUrl(challenge.avatarUrl);
				setAuthorProfileId(challenge.authorPubKey);
				setTitle(challenge.title);
				setContent(challenge.content);
				setReputation(challenge.reputation);
				setTags(challenge.tags);
				setSubmissions(sortedSubmissions);
				setChallengeId(challenge.id);
				setChallengePubKey(challenge.pubKey);
			} catch (e) {
				console.log(e);
			}
		}
		loadData();
	}, [id, sessionUserPubKey, sessionUserMetadata?.avatarUrl, router]);

	return (
		<Box m={"16vh"} position={"relative"}>
			<Flex>
				<Box>
					<Stack spacing={8}>
						<Stack>
							<HStack align="baseline" justify={"space-between"}>
								<HStack spacing={4}>
									<UserAvatarLink
										size={["md", "lg"]}
										profileId={authorProfileId}
										placeholder={authorProfileId}
										avatarUrl={authorAvatarUrl}
									/>
									<Text fontSize={"37"} fontWeight={"700"}>
										{title}
									</Text>
								</HStack>

								<ReputationBadge reputation={reputation} />
							</HStack>
							<Wrap>
								{tags?.map((tag: string, index: number) => (
									<Badge fontSize={"xs"} colorScheme="green" key={index}>
										{tag}
									</Badge>
								))}
							</Wrap>
						</Stack>
						<Text
							my={"1rem"}
							mx={"2rem"}
							width={"70vw"}
							fontSize={"24"}
							fontWeight={"400"}
						>
							{content}
						</Text>
					</Stack>
				</Box>
			</Flex>
			<Divider />
			<HStack justifyContent={"space-between"}>
				<Heading as="h3" size="lg" my={4}>
					{!submissions.length || submissions.length === 0
						? "No submissions yet"
						: `${submissions.length} Submission${
								submissions.length > 1 ? "s" : ""
						  }`}
				</Heading>
			</HStack>
			<VStack spacing={6} minWidth={"80%"} align={"center"}>
				{hasProfile ? (
					isModerator ? (
						<></>
					) : (
						<SubmitSubmissionCard
							userProfilePubKey={sessionUserPubKey}
							userAvatarUrl={sessionUserMetadata?.avatarUrl}
							challengePubKey={challengePubKey}
							challengeId={challengeId}
						/>
					)
				) : (
					<></>
				)}
				{submissions.map((submission: any, index: number) => (
					<SubmissionCard
						key={index}
						submission={submission.content}
						submissionTimestamp={submission.dateUpdated}
						userAvatarUrl={submission.authorAvatarUrl}
						userProfilePubKey={submission.authorPubKey}
						awarded={submission.awarded}
					/>
				))}
			</VStack>
		</Box>
	);
}
