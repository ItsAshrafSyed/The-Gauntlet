import {
	Card,
	Badge,
	HStack,
	Link,
	Text,
	VStack,
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

const gradientColors = [
	"linear-gradient(180deg, #8041D2 0%, rgba(17, 17, 17, 0.50) 57.09%)",
	"linear-gradient(180deg, #249C66 0%, rgba(17, 17, 17, 0.60) 57.09%)",
	"linear-gradient(180deg, #E46B49 0%, rgba(17, 17, 17, 0.60) 57.09%)",
];

const ChallengeGridView: FC<ChallengeGridViewProps> = (props) => {
	const router = useRouter();
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

	const randomGradientIndex = Math.floor(Math.random() * gradientColors.length);

	const selectedGradient = gradientColors[randomGradientIndex];

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
						<Badge
							fontSize={"s"}
							colorScheme="green"
							key={index}
							borderRadius={"20"}
						>
							{tag}
						</Badge>
					))}
				</Wrap>

				<HStack mt={"30vh"}>
					<Text fontSize={"20"} fontWeight={"500"} width={"auto"}>
						{props.title}
					</Text>
					<Wrap>
						<Image src="/icons/xp.svg" alt="xp" />
						{props.reputation}
					</Wrap>
				</HStack>
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
