import {
	Card,
	Badge,
	CardBody,
	CardHeader,
	HStack,
	Heading,
	Text,
	VStack,
	Box,
	Image,
	Wrap,
	Flex,
	Grid,
	GridItem,
} from "@chakra-ui/react";
import moment from "moment";
import { FC } from "react";
import { useRouter } from "next/router";

type ChallengeTableViewProps = {
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
const ChallengeTableView: FC<ChallengeTableViewProps> = (props) => {
	const router = useRouter();

	const firstTag = props.tags?.[0] || "";

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

	// Example usage
	const targetTimestamp = props.challengeExpiration; // Replace this with your target UNIX timestamp
	const countdown = unixTimestampToCountdown(targetTimestamp);

	return (
		<Flex justifyContent="center" alignItems="center">
			<div onClick={() => router.push(`/challenges/${props.id}`)}>
				<Grid
					bg="#0E0E10"
					borderRadius={"8px 8px 0px 0px"}
					width={"80vw"}
					templateColumns="2fr 1.5fr 1fr 1fr 1fr"
					padding={"1.5"}
					gap={4}
					alignItems={"center"}
					borderBottom={"1px solid #76777A"}
				>
					<GridItem textAlign="center">
						<Text fontSize={"20"} fontWeight={"500"}>
							{props.title}
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Flex flexWrap="wrap" justifyContent="center" alignItems="center">
							{props?.tags?.map((tag: string, index: number) => (
								<Box
									background={tagColors[tag] || "gray"}
									key={index}
									maxW="fit-content"
									py={"1"}
									px={"3"}
									borderRadius={"20"}
									fontSize={"14"}
									fontWeight={"500"}
									my={"1"}
								>
									{tag}
								</Box>
							))}
						</Flex>
					</GridItem>
					<GridItem textAlign="center">
						<Text fontSize={"20"} fontWeight={"500"} color={"#FF9728"}>
							{props.reputation} Points
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Text fontSize={"20"} fontWeight={"500"}>
							{props.lastActivity
								? `updated ${moment(props.lastActivity).fromNow()}`
								: ""}
						</Text>
					</GridItem>
					<GridItem textAlign="center">
						<Text fontSize={"20"} fontWeight={"500"}>
							{countdown}
						</Text>
					</GridItem>
				</Grid>
			</div>
		</Flex>
		// <Link href={`/challenges/${props.id}`}>
		// 	<Card
		// 		bg="#111"
		// 		rounded={"lg"}
		// 		width={"140vh"}
		// 		textColor={"white"}
		// 		borderBottom={"1px"}
		// 		padding={"5"}
		// 		align="baseline"
		// 	>
		// 		<HStack spacing={4}>
		// 			<Text fontSize={"20"} fontWeight={"500"} width={"25vw"}>
		// 				{props.title}
		// 			</Text>
		// 			<Wrap width={"10vw"}>
		// 				{props?.tags?.map((tag: string, index: number) => (
		// 					<Badge
		// 						fontSize={"s"}
		// 						colorScheme="green"
		// 						key={index}
		// 						borderRadius={"20"}
		// 					>
		// 						{tag}
		// 					</Badge>
		// 				))}
		// 			</Wrap>
		// 			<Wrap width={"8vw"}>
		// 				<Image src="/icons/xp.svg" alt="xp" />
		// 				{props.reputation}
		// 			</Wrap>
		// 			<Text width={"14vw"}>
		// 				{props.lastActivity
		// 					? `updated ${moment(props.lastActivity).fromNow()}`
		// 					: ""}
		// 			</Text>
		// 			<Text width={"15vw"}>{countdown}</Text>
		// 		</HStack>
		// 	</Card>
		// 	{/* </div> */}
		// </Link>
	);
};

export default ChallengeTableView;

{
	/* <CardHeader>
				<HStack justify={"space-between"} align="start">
					<VStack align="start">
						<HStack>
							<UserAvatarLink
								profileId={props.authorPubKey}
								placeholder={props.authorPubKey}
								avatarUrl={
									props.authorAvatarUrl?.length ? props.authorAvatarUrl : ""
								}
								size={["xs", "md"]}
							/>
							<Link href={`/challenges/${props.id}`}>
								<Heading as="h3" size={["md", "lg"]} noOfLines={1}>
									{props.title}
								</Heading>
							</Link>
						</HStack>
						<Wrap>
							{props?.tags?.map((tag: string, index: number) => (
								<Badge fontSize={"xs"} colorScheme="green" key={index}>
									{tag}
								</Badge>
							))}
						</Wrap>

						<Text fontSize={"sm"} color={"gray.200"}>
							{props.lastActivity
								? `updated ${moment(props.lastActivity).fromNow()}`
								: ""}
						</Text>
					</VStack>
					<VStack spacing={-0.5}>
						<ReputationBadge reputation={props.reputation} />
					</VStack>
				</HStack>
			</CardHeader>
			<CardBody pt="-1">
				<HStack>
					<Text fontSize={"md"} noOfLines={4}>
						{props.content}
					</Text>
				</HStack>
			</CardBody> */
}
