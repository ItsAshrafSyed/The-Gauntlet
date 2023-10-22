import {
	Box,
	Flex,
	Button,
	FormControl,
	Text,
	HStack,
	Image,
	FormLabel,
	Input,
	Textarea,
	NumberInput,
	NumberInputField,
} from "@chakra-ui/react";
import Select from "react-select";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionUser } from "@/providers/SessionUserProvider";
import { useWorkspace } from "../../../providers/WorkspaceProvider";
import { PublicKey } from "@solana/web3.js";
import { CRUX_KEY, CHALLENGER_SITE_URL } from "../../../util/constants";
import { BN } from "@coral-xyz/anchor";
import { fetchApiResponse, getTagFromString } from "../../../util/lib";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import styles from "../../../styles/pages";
import { createRoot } from "react-dom/client";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type TagMultiSelectOptions = {
	value: string;
	label: string;
};
const tagOptions = [
	{ value: "artificialintelligence", label: "Artificial Intelligence" },
	{ value: "cryptoinfrastructure", label: "Crypto Infrastructure" },
	{ value: "daosandnetworkstates", label: "DAOs & Network States" },
	{ value: "dataandanalytics", label: "Data & Analytics" },
	{ value: "development", label: "Development" },
	{ value: "financeandpayments", label: "Finance & Payments" },
	{ value: "gamingandentertainment", label: "Gaming & Entertainment" },
	{ value: "ideas", label: "Ideas" },
	{ value: "nfts", label: "NFTs" },
	{ value: "social", label: "Social" },
	{
		value: "physicalinfrastructurenetworks",
		label: "Physical Infrastructure Networks",
	},
	{
		value: "mobileconsumerapps",
		label: "Mobile Consumer Apps",
	},
] as TagMultiSelectOptions[];

const customStyles = {
	multiValueLabel: (provided: any) => ({
		...provided,
		color: "white",
	}),

	control: (provided: any, state: any) => ({
		...provided,
		backgroundColor: "#060606",
		color: "white",
		boxShadow: state.isFocused ? null : null,
	}),
	menu: (provided: any) => ({
		...provided,
		backgroundColor: "#0E0E10",
	}),
	option: (provided: any, state: any) => ({
		...provided,
		border: state.isFocused ? "1px solid #FF9728" : "none",
		boxShadow: state.isFocused ? null : null,
		backgroundColor: state.isFocused ? "#FF9728" : null,
		":hover": {
			border: "1px solid #FF9728", // Option border color on hover
			// This line disable the blue border
			boxShadow: "none",
			backgroundColor: "#FF9728",
		},
	}),
	multiValue: (provided: any) => ({
		...provided,
		backgroundColor: "#0E0E10",
		border: "1px solid #FF9728",
	}),
};

export default function EditChallenge() {
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const [selectedTags, setSelectedTags] = useState<TagMultiSelectOptions[]>([]);
	const [challengePeriod, setChallengePeriod] = useState<Value>(new Date());
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [challengePubKey, setChallengePubKey] = useState<string>("");
	const [challengeCreated, setChallengeCreated] = useState(false);
	const [responseMessage, setResponseMessage] = useState("");
	const [reputationString, setReputationString] = useState<string>("5");
	const [challengeTitle, setChallengeTitle] = useState("");
	const [challengeDetails, setChallengeDetails] = useState("");
	const {
		isConnected,
		isModerator,
		hasProfile,
		userPublicKey: sessionUserPubKey,
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

				setChallengePubKey(challenge.pubKey);
				setChallengeTitle(challenge.title);
				setChallengeDetails(challenge.content);
				setReputationString(challenge.reputation);
			} catch (e) {
				console.log(e);
			}
		}
		loadData();
	}, [id, sessionUserPubKey, router]);

	useEffect(() => {
		const datePickerContainer = document.getElementById("datePickerContainer");
		if (datePickerContainer) {
			const dateTimePicker = (
				<DateTimePicker
					onChange={setChallengePeriod}
					value={challengePeriod}
					portalContainer={datePickerContainer}
					className={styles.inputGroup}
					calendarClassName={styles.wrapper}
					clockClassName={styles.wrapper}
					dayPlaceholder="dd"
					monthPlaceholder="mm"
					yearPlaceholder="yyyy"
					hourPlaceholder="hh"
					minutePlaceholder="mm"
				/>
			);
			createRoot(datePickerContainer).render(dateTimePicker);
		}
	}, [challengePeriod]);

	const convertToUnixTimestamp = (challengePeriod: Date) => {
		return Math.floor(challengePeriod.getTime() / 1000);
	};

	const handleEditChallenge = async () => {
		if (
			!provider ||
			!program ||
			!challengerClient ||
			!wallet ||
			!hasProfile ||
			!isModerator
		)
			return;
		setIsSubmitting(true);

		// this will convert challenge period to unix timestamp
		const challengePeriodUnix = convertToUnixTimestamp(challengePeriod as Date);

		try {
			const hashedChallengeJson = await (
				await fetch("/api/hash", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ toHash: challengeDetails }),
				})
			).json();

			let hashedChallengeAsPubKey: PublicKey;
			hashedChallengeAsPubKey = new PublicKey(
				hashedChallengeJson.output.data as Buffer
			);

			// to generate comma separated tags
			const separatedTags = selectedTags.map((tag) => tag.label);
			const commaSeparatedTags = separatedTags.join(",");

			// to generate tags as array of enums
			const tagsToSend = selectedTags.map((tag) =>
				// @ts-ignore hack to support Anchor enums
				getTagFromString(tag.value)
			);

			const contentDataUrl = `${CHALLENGER_SITE_URL}/challenges/${id}`;

			await challengerClient
				.editChallenge(
					new PublicKey(challengePubKey),
					provider.wallet?.publicKey,
					hashedChallengeAsPubKey,
					challengeTitle,
					contentDataUrl,
					// @ts-ignore hack to support Anchor enums
					tagsToSend,
					new BN(challengePeriodUnix),
					new BN(parseFloat(reputationString))
				)
				.then(async (result) => {
					await fetchApiResponse({
						url: `/api/challenges/${id}`,
						method: "PUT",
						body: {
							id: id,
							pubKey: result?.challenge.toBase58(),
							title: challengeTitle,
							content: challengeDetails,
							reputation: reputationString,
							tags: commaSeparatedTags,
							challengePeriod: challengePeriod,
							authorPubKey: provider.wallet?.publicKey?.toBase58(),
						},
					});
				})
				.then(() => {
					setIsSubmitting(false);
					alert("Challenge edited successfully");
					setTimeout(() => {
						router.push(`/challenges/${id}`);
					}, 2000);
				})
				.catch((e) => {
					console.log("error occured in the then catch block", e);
				});
		} catch (e) {
			console.log("error occured in the try block", e);
			setIsSubmitting(false);
			return;
		}
		setIsSubmitting(false);
	};

	return (
		<Box position={"relative"} mx={"25vw"} my={"4vh"}>
			<Text
				fontSize={"30"}
				fontWeight={"500"}
				fontFamily={"Readex Pro Variable"}
			>
				EDIT CHALLENGE {id}
			</Text>
			<Box>
				<FormControl mt={"5vh"}>
					<FormLabel fontSize={18} fontWeight={500}>
						Challenge Title
					</FormLabel>
					<Input
						bg={"#060606"}
						borderRadius={"8"}
						fontSize={"16"}
						fontWeight={"400"}
						border={" 1px solid #76777A"}
						type="text"
						name="challengeTitle"
						placeholder="Enter a challenge Title"
						value={challengeTitle}
						onChange={(e) => {
							setChallengeTitle(e.target.value);
						}}
					/>
				</FormControl>

				<FormControl mt={"3vh"}>
					<FormLabel fontSize={18} fontWeight={500}>
						Challenge Description
					</FormLabel>
					<Textarea
						bg={"#060606"}
						borderRadius={"8"}
						fontSize={"16"}
						fontWeight={"400"}
						border={" 1px solid #76777A"}
						name="challengeDetails"
						placeholder="Enter a challenge Challenge Description"
						value={challengeDetails}
						onChange={(e) => {
							setChallengeDetails(e.target.value);
						}}
						h={"20vh"}
					/>
				</FormControl>

				<FormControl mt={"3vh"}>
					<FormLabel fontSize={18} fontWeight={500}>
						{" "}
						Select Challange Period
					</FormLabel>
					<div id="datePickerContainer" />
				</FormControl>

				<FormControl mt={"3vh"}>
					<FormLabel fontSize={18} fontWeight={500}>
						Reputation Points
					</FormLabel>
					<HStack>
						<Image
							src="/images/rp.png"
							alt="rp"
							width={"40px"}
							height={"40px"}
						/>
						<NumberInput
							bg={"#060606"}
							borderRadius={"8"}
							fontSize={"16"}
							fontWeight={"400"}
							border={" 1px solid #76777A"}
							name="challengeReward"
							placeholder="Enter reputation number "
							value={reputationString}
							onChange={(e) => {
								setReputationString(e);
							}}
						>
							<NumberInputField placeholder="Enter reputation reward" />
						</NumberInput>
					</HStack>
				</FormControl>

				<FormControl mt={"3vh"} width={"20vw"}>
					<FormLabel fontSize={18} fontWeight={500}>
						Category
					</FormLabel>
					<Select
						isMulti
						placeholder="Select tags"
						options={tagOptions}
						value={selectedTags}
						styles={customStyles}
						onChange={(selected) => {
							setSelectedTags(selected as TagMultiSelectOptions[]);
						}}
					/>
				</FormControl>

				<FormControl mt={"4vh"}>
					<Button
						variant={"solid"}
						textColor={"white"}
						_hover={{
							bg: "transparent",
						}}
						border="1px solid #FFB84D"
						borderRadius={"8"}
						background="#261B0B"
						isLoading={isSubmitting}
						onClick={handleEditChallenge}
					>
						Submit
					</Button>
				</FormControl>
			</Box>
		</Box>
	);
}
