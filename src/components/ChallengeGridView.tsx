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
} from "@chakra-ui/react";
import moment from "moment";
import { FC } from "react";
import { useRouter } from "next/router";

type ChallengeGridViewProps = {
	title?: string;
	content?: string;
	reputation: number;
	tags?: string;
	id: string;
	authorPubKey: string;
	authorAvatarUrl: string;
	challengeExpiration: number;
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

	// Determine the background color based on the first tag (assuming each challenge has at least one tag)
	const tagsArray = props.tags?.split(",") || [];
	const firstTag = tagsArray[0] || "";
	const selectedGradient = categoryColors[firstTag] || "";

	// Countdown function
	function unixTimestampToCountdown(targetUnixTimestamp: number): string {
		const currentTime = new Date().getTime();
		const targetTime = targetUnixTimestamp * 1000; // Convert target timestamp to milliseconds

		const timeDifference = targetTime - currentTime;

		if (timeDifference <= 0) {
			return "Challenge Expired";
		}

		const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor(
			(timeDifference % (1000 * 60 * 60)) / (1000 * 60)
		);

		const countdownString = `${days}d:${hours}h:${minutes}m`;
		return countdownString;
	}

	const targetTimestamp = props.challengeExpiration;
	const countdown = unixTimestampToCountdown(targetTimestamp);

	return (
		<Card
			bg="#111"
			rounded={"lg"}
			textColor={"white"}
			background={selectedGradient}
			border={"1px solid #1E1E23"}
			borderRadius={"16"}
			width={["90vw", "90vw", "30vw", "30vw"]}
			height={["45vh", "45vh", "60vh", "60vh"]}
			onClick={() => router.push(`/challenges/${props.id}`)}
		>
			<CardHeader>
				<Wrap width={"fit-content"}>
					{props?.tags?.split(",").map((tag, index) => (
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
			</CardHeader>

			<CardBody mt={["9vh", "9vh", "16vh", "16vh"]}>
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
				<HStack spacing={"8"} textColor={"gray.400"}>
					<Text width={"auto"}>
						{props.lastActivity
							? `posted ${moment(props.lastActivity).fromNow()}`
							: ""}
					</Text>
					<Text width={"auto"}>{countdown}</Text>
				</HStack>
			</CardFooter>
		</Card>
	);
};

export default ChallengeGridView;
