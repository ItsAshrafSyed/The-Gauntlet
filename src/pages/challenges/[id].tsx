import { useSessionUser } from "@/providers/SessionUserProvider";
import { fetchApiResponse } from "@/util/lib";
import {
	Box,
	Flex,
	HStack,
	Image,
	Text,
	Card,
	Stack,
	Badge,
	Wrap,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ReputationBadge from "../../../components/ReputationBadge";
import UserAvatarLink from "../../../components/UserAvatarLink";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";

export default function Challenge() {
	const [title, setTitle] = useState<string>("");
	const [content, setContent] = useState<string>("");
	const [reputation, setReputation] = useState<number>(0);
	const [tags, setTags] = useState<string[]>([]);
	const [authorAvatarUrl, setAuthorAvatarUrl] = useState<string>("");
	const [authorProfileId, setAuthorProfileId] = useState<string>("");
	const [challengeId, setChallengeId] = useState<string>("");
	const [challengePubKey, setChallengePubKey] = useState<string>("");

	const {
		metadata: sessionUserMetadata,
		isConnected,
		publicKey: sessionUserPubKey,
	} = useSessionUser();
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		if (!id) return;
		async function loadData() {
			try {
				const challengeResult = await fetchApiResponse<any>({
					url: `/api/challenges/${id}`,
				});
				if (!challengeResult.data) {
					router.push("/challenges");
					return;
				}
				const challenge = challengeResult.data.challenge;
				setTitle(challenge.title);
				setContent(challenge.content);
				setReputation(challenge.reputation);
				setTags(challenge.tags);
				setAuthorProfileId(challenge.authorPubKey);
				setChallengeId(challenge.id);
				setChallengePubKey(challenge.pubKey);
				setAuthorAvatarUrl(challenge.avatarUrl);
			} catch (e) {
				console.log(e);
			}
		}
		loadData();
	}, [id, sessionUserPubKey, sessionUserMetadata?.avatarUrl]);

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
									<Text fontSize={"64"} fontWeight={"700"}>
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
		</Box>
	);
}
