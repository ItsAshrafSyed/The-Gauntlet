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
} from "@chakra-ui/react";
import moment from "moment";
import { FC } from "react";
import { useRouter } from "next/router";

type ChallengeGridViewProps = {
	title?: string;
	content?: string;
	reputation: number;
	tags?: string[];
	id: string;
	authorPubKey: string;
	authorAvatarUrl: string;
	challengeExpiration: number;
	lastActivity?: Date;
};

const categoryColors: { [key: string]: string } = {
	Client: "linear-gradient(180deg,#8D18D6 0%, rgba(17, 17, 17, 0.50) 57.09%)",
	Nfts: "linear-gradient(180deg, #249C66 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Concept: "linear-gradient(180deg, #0057BD 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Deploy: "linear-gradient(180deg, #D39E00 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Gaming: "linear-gradient(180deg, #CF2129 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Sdk: "linear-gradient(180deg, #D0630F 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Social: "linear-gradient(180deg, #D12769 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Staking: "linear-gradient(180deg, #01837D 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Video: "linear-gradient(180deg,#73747D 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	Wallets: "linear-gradient(180deg, #812D06 0%, rgba(17, 17, 17, 0.60) 57.09%)",
};

const tagColors: { [key: string]: string } = {
	Client: "#AA6CFC",
	Nfts: "#2CA870",
	Sdk: "#FD7651",
	Concept: " #675AFF",
	Deploy: "#FDE151",
	Gaming: "#FF6262",
	Social: "#E959BB",
	Staking: "#27ED93",
	Video: "#85ECFE",
	Wallets: "#086A3E",
};

const ChallengeGridView: FC<ChallengeGridViewProps> = (props) => {
	const router = useRouter();

	// Determine the background color based on the first tag (assuming each challenge has at least one tag)
	const firstTag = props.tags?.[0] || "";
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
	console.log(countdown);

	return (
		<div onClick={() => router.push(`/challenges/${props.id}`)}>
			{/* <Link href={`/challenges/${props.id}`}> */}
			<Card
				height={"70vh"}
				width={"30vw"}
				bg="#111"
				rounded={"lg"}
				textColor={"white"}
				background={selectedGradient}
				p={6}
			>
				<Wrap width={"8vw"}>
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

				<VStack mt={"30vh"} alignItems={"flex-start"}>
					<Text fontSize={"20"} fontWeight={"500"} width={"auto"}>
						{props.title}
					</Text>
					<Wrap width={"auto"}>
						<Image src="/icons/xp.svg" alt="xp" />
						{props.reputation}
					</Wrap>
				</VStack>
				<HStack mt={"10vh"} spacing={"8"} textColor={"gray.400"}>
					<Text width={"auto"}>
						{props.lastActivity
							? `updated ${moment(props.lastActivity).fromNow()}`
							: ""}
					</Text>
					<Text width={"auto"}>{countdown}</Text>
				</HStack>
			</Card>
			{/* </Link> */}
		</div>
	);
};

export default ChallengeGridView;
