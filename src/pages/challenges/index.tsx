import {
	Box,
	HStack,
	Text,
	VStack,
	Image,
	Card,
	Button,
	CardHeader,
	CardBody,
	IconButton,
	Input,
	InputGroup,
	Icon,
	Center,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Flex,
	InputLeftElement,
	Spacer,
} from "@chakra-ui/react";
import { ChevronDownIcon, Search2Icon } from "@chakra-ui/icons";
import { useState, useEffect, use } from "react";
import { PublicKey } from "@solana/web3.js";
import { CHALLENGER_PROGRAM_ID, CRUX_KEY } from "../../util/constants";
import { useRouter } from "next/router";
import moment from "moment";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { DailyChallenge } from "../../../components/DailyChallenge";
import { fetchApiResponse } from "@/util/lib";
import ChallengeCard from "../../../components/ChallengeCard";

type Challenge = {
	id: string;
	title: string;
	content: string;
	pubKey: string;
	authorPubKey: string;
	reputation: number;
	tags: string[];
	avatarUrl: string;
	dateUpdated: Date;
};

export default function Challenges() {
	const Router = useRouter();
	const [isModerator, setIsModerator] = useState(false);
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const [hasProfile, setHasProfile] = useState(false);
	const [profile, setProfile] = useState<any>(null);
	const [challenges, setChallenges] = useState<Challenge[] | null>(null);

	useEffect(() => {
		async function getChallenges() {
			if (!program) return;
			const { data } = await fetchApiResponse<any>({
				url: "/api/challenges",
			});
			const challenges = data.challenges;
			challenges.sort((a: Challenge, b: Challenge) =>
				moment(b.dateUpdated).diff(moment(a.dateUpdated))
			);

			console.log(challenges);

			setChallenges(challenges);
		}
		getChallenges();
	}, [program]);

	useEffect(() => {
		if (!provider) return;
		if (!provider.wallet) return;
		if (!program) return;
		if (profile) {
			setHasProfile(true);
			return;
		}
		const [profilePda] = PublicKey.findProgramAddressSync(
			[
				Buffer.from("user_profile"),
				CRUX_KEY.toBytes(),
				provider.wallet.publicKey.toBytes(),
			],
			CHALLENGER_PROGRAM_ID
		);
		async function checkProfile() {
			const profileAccount = await program?.account.userProfile.fetchNullable(
				profilePda
			);
			console.log(profileAccount?.isModerator);
			setIsModerator(profileAccount?.isModerator ? true : false);
			setHasProfile(profileAccount ? true : false);
		}
		checkProfile();
	}, [provider, program, profile, provider?.wallet, wallet]);

	return (
		<>
			{isModerator ? (
				<Box position={"relative"}>
					<HStack m={10} spacing={5}>
						<Button
							leftIcon={
								<Image
									width="15"
									height="15"
									src="/icons/plus.svg"
									alt="plus"
								/>
							}
							position={"absolute"}
							right={"60vh"}
							borderRadius="9999"
							variant="solid"
							fontSize={14}
							width={"33vh"}
							height={"6vh"}
							textColor="white"
							fontWeight={400}
							border="1px solid #E5E7EB"
							_hover={{
								bg: "transparent",
							}}
							background={
								"linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(44.76deg, #7147F8 3%, #B34CF0 48.43%, #D74FEC 93.01%);"
							}
							onClick={() => Router.push("/createChallenge")}
						>
							CREATE CHALLENGE
						</Button>

						<Button
							position={"absolute"}
							right={"10vw"}
							borderRadius="9999"
							variant="solid"
							fontSize={14}
							width={"33vh"}
							height={"6vh"}
							textColor="white"
							fontWeight={400}
							border="1px solid #E5E7EB"
							_hover={{
								bg: "transparent",
							}}
							background={
								"linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(44.76deg, #7147F8 3%, #B34CF0 48.43%, #D74FEC 93.01%);"
							}
						>
							VIEW SUBMISSIONS
						</Button>
					</HStack>
					<HStack m={"20"}>
						<Text fontSize={"48"} fontWeight={"700"}>
							{" "}
							All Challenges
						</Text>
					</HStack>

					{/* <Card
						mx={"32"}
						position={"absolute"}
						color={"white"}
						width={"40vw"}
						height={"40vh"}
						borderRadius={"16"}
						border={"1px solid var(--grey, #848895)"}
						backgroundColor={"#111"}
					>
						<Text>dynamic data from db</Text>
					</Card> */}

					<VStack align="center">
						{challenges?.map((challenge: Challenge, index: number) => (
							<ChallengeCard
								key={index}
								title={challenge.title}
								content={challenge.content}
								reputation={challenge.reputation}
								tags={challenge.tags}
								id={challenge.id}
								authorPubKey={challenge.authorPubKey}
								authorAvatarUrl={challenge.avatarUrl}
								lastActivity={challenge.dateUpdated}
							/>
						))}
					</VStack>
				</Box>
			) : (
				<Box position={"relative"}>
					<HStack m={"20"}>
						<Text fontSize={"48"} fontWeight={"700"}>
							{" "}
							All Challenges
						</Text>
					</HStack>

					{/* <Card
						mx={"32"}
						position={"absolute"}
						color={"white"}
						width={"40vw"}
						height={"40vh"}
						borderRadius={"16"}
						border={"1px solid var(--grey, #848895)"}
						backgroundColor={"#111"}
					>
						<Text>dynamic data from db</Text>
					</Card> */}

					<VStack align="center">
						{challenges?.map((challenge: Challenge, index: number) => (
							<ChallengeCard
								key={index}
								title={challenge.title}
								content={challenge.content}
								reputation={challenge.reputation}
								tags={challenge.tags}
								id={challenge.id}
								authorPubKey={challenge.authorPubKey}
								authorAvatarUrl={challenge.avatarUrl}
								lastActivity={challenge.dateUpdated}
							/>
						))}
					</VStack>
				</Box>
			)}
		</>
	);
}
