import {
	Card,
	Badge,
	HStack,
	Link,
	Text,
	VStack,
	Box,
	Image,
	Wrap,
	Grid,
	GridItem,
	CardHeader,
	CardBody,
	CardFooter,
	Spacer,
} from "@chakra-ui/react";
import moment from "moment";
import { FC } from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchApiResponse } from "@/util/lib";
import { useSessionUser } from "@/providers/SessionUserProvider";

type ChallengeGridViewProps = {
	title?: string;
	content?: string;
	reputation: number;
	tags?: string[];
	id: string;
	authorPubKey: string;
	authorAvatarUrl: string;
	challengeExpiration: string;
	lastActivity?: Date;
};

const categoryColors: { [key: string]: string } = {
	"Physical Infrastructure Networks":
		"linear-gradient(180deg, #D39E00 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	"Artificial Intelligence":
		"linear-gradient(180deg, #D0630F 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	"Finance & Payments":
		"linear-gradient(180deg, #0057BD 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	"Gaming & Entertainment":
		"linear-gradient(180deg,#8D18D6 0%, rgba(17, 17, 17, 0.50) 57.09%)",
	"Mobile Consumer Apps":
		"linear-gradient(180deg, #01837D 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	"Crypto Infrastructure":
		"linear-gradient(180deg, #D12769 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	"DAOs & Network States":
		"linear-gradient(180deg, #FFFFF0 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	"Data & Analytics":
		"linear-gradient(180deg, #d5d5f2 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	NFTs: "linear-gradient(180deg, #CF2129 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Development:
		"linear-gradient(180deg, #85FF00 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Ideas: "linear-gradient(180deg, #008854  0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Social: "linear-gradient(180deg,#83c8de 0%, rgba(17, 17, 17, 0.60) 57.09%)",
};

const tagColors: { [key: string]: string } = {
	"Physical Infrastructure Networks": "#6b5104",
	"Artificial Intelligence": "#FD7651",
	"Finance & Payments": " #1b72bf",
	"Gaming & Entertainment": "#AA6CFC",
	"Mobile Consumer Apps": "#5e8583",
	"Crypto Infrastructure": "#E959BB",
	"DAOs & Network States": "#6e6e5d",
	"Data & Analytics": "#8e70b3",
	NFTs: "#FF6262",
	Development: "#8eb06a",
	Ideas: "   #2e614d",
	Social: "#427687",
};

const ChallengeGridView: FC<ChallengeGridViewProps> = (props) => {
	const router = useRouter();
	const [needsEvaluation, setNeedsEvaluation] = useState<number>(0);
	const { isModerator } = useSessionUser();

	useEffect(() => {
		async function loadData() {
			try {
				const submissionResult = await fetchApiResponse<any>({
					url: `/api/submissions?challengeId=${props.id}`,
				});
				const submissions = submissionResult.data.submissions ?? [];
				const nullStatusSubmissions = submissions.filter(
					(submission: any) => submission.status === null
				);
				const increasedNeedsEvaluation = nullStatusSubmissions.length;
				setNeedsEvaluation(increasedNeedsEvaluation);
			} catch (e) {
				console.log(e);
			}
		}
		loadData();
	}, [props.id]);

	// Determine the background color based on the first tag (assuming each challenge has at least one tag)
	const firstTag = props.tags?.[0] || "";
	const selectedGradient = categoryColors[firstTag] || "";

	// Countdown function
	function calculateTimeLeft(targetDate: any) {
		const targetDateTime: any = new Date(targetDate);
		const currentDateTime: any = new Date();
		const timeDiff = targetDateTime - currentDateTime;
		if (timeDiff < 0) {
			return "Expired";
		}
		const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
		const hoursLeft = Math.floor(
			(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
		const timeLeftString = `${daysLeft}d:${hoursLeft}h:${minutesLeft}m left`;
		return timeLeftString;
	}
	const targetDate = props.challengeExpiration;
	const timeLeft = calculateTimeLeft(targetDate);

	return (
		<Card
			bg="#111"
			rounded={"lg"}
			textColor={"white"}
			background={selectedGradient}
			border={"1px solid #1E1E23"}
			borderRadius={"16"}
			width={["90vw", "90vw", "30vw", "30vw"]}
			height={["48vh", "48vh", "60vh", "60vh"]}
			onClick={() => router.push(`/challenges/${props.id}`)}
		>
			<CardHeader>
				<Wrap width={"fit-content"}>
					{props?.tags?.map((tag: string, index: number) => (
						<Box
							background={tagColors[tag] || "gray"}
							px={"4"}
							py={"1"}
							key={index}
							borderRadius={"20"}
							fontSize={"14"}
							fontWeight={"400"}
						>
							{tag}
						</Box>
					))}
				</Wrap>
				{isModerator && needsEvaluation > 0 && (
					<Box
						position={"absolute"}
						top={"-1"}
						right={"-1"}
						background={"#FF6262"}
						borderRadius={"50%"}
						p={"2"}
					>
						<Text fontSize={"12"} fontWeight={"600"} color={"white"}>
							{needsEvaluation}
						</Text>
					</Box>
				)}
			</CardHeader>

			<CardBody mt={["8vh", "8vh", "16vh", "16vh"]}>
				<VStack alignItems={"flex-start"}>
					<Text fontSize={["18", "18", "20", "20"]} fontWeight={"500"}>
						{props.title}
					</Text>

					<HStack spacing={"-1"}>
						<Text
							fontSize={["18", "18", "20", "20"]}
							fontWeight={"600"}
							color={"#FF9728"}
						>
							{props.reputation}
						</Text>
						<Image
							src="/images/rp.png"
							alt="RP"
							width={"35px"}
							height={"35px"}
						/>
					</HStack>
				</VStack>
			</CardBody>
			<CardFooter>
				<HStack textColor={"gray.400"}>
					<Text width={"auto"}>
						{props.lastActivity
							? `posted ${moment(props.lastActivity).fromNow()}`
							: ""}
					</Text>
					<Spacer />
					<Text width={"auto"}>{timeLeft}</Text>
				</HStack>
			</CardFooter>
		</Card>
	);
};

export default ChallengeGridView;
