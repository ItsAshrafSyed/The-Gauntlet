import {
	Card,
	Badge,
	CardBody,
	CardHeader,
	HStack,
	Heading,
	Link,
	Text,
	VStack,
	Wrap,
} from "@chakra-ui/react";
import UserAvatarLink from "./UserAvatarLink";
import BountyBadge from "./BountyBadge";
import moment from "moment";
import { FC } from "react";

type ChallengeCardProps = {
	title?: string;
	content?: string;
	reputation: number;
	tags?: string[];
	id: string;
	authorPubKey: string;
	authorAvatarUrl: string;
	lastActivity?: Date;
};

const ChallengeCard: FC<ChallengeCardProps> = (props) => {
	return (
		<Card
			bg="#111"
			rounded={"lg"}
			width={"60vw"}
			textColor={"white"}
			border={"1px"}
		>
			<CardHeader>
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
						<BountyBadge reputation={props.reputation} />
					</VStack>
				</HStack>
			</CardHeader>
			<CardBody pt="-1">
				<HStack>
					<Text fontSize={"md"} noOfLines={4}>
						{props.content}
					</Text>
				</HStack>
			</CardBody>
		</Card>
	);
};

export default ChallengeCard;
