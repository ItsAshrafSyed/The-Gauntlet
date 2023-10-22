import {
	Box,
	Text,
	Input,
	Textarea,
	Button,
	useDisclosure,
	NumberInput,
	NumberInputField,
	HStack,
	Image,
} from "@chakra-ui/react";
import Select from "react-select";
import { createRoot } from "react-dom/client";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import styles from "../../styles/pages";
import { fetchApiResponse, getTagFromString } from "../../util/lib";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { PublicKey } from "@solana/web3.js";
import {
	CHALLENGER_PROGRAM_ID,
	CRUX_KEY,
	CHALLENGER_SITE_URL,
} from "../../util/constants";
import { BN } from "@coral-xyz/anchor";
import { useRouter } from "next/router";

import { useSessionUser } from "../../providers/SessionUserProvider";
import SuccessMessage from "@/components/Modals/SuccessMessage";
import "@fontsource-variable/readex-pro";

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

export default function CreateChallenge() {
	const { provider, program, challengerClient, wallet } = useWorkspace();

	const [selectedTags, setSelectedTags] = useState<TagMultiSelectOptions[]>([]);
	const [challengePeriod, setChallengePeriod] = useState<Value>(new Date());
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [canSubmitChallenge, setCanSubmitChallenge] = useState(false);
	const [challengeCreated, setChallengeCreated] = useState(false);
	const [responseMessage, setResponseMessage] = useState("");
	const [reputationString, setReputationString] = useState("5");
	const [challengeTitle, setChallengeTitle] = useState("");
	const [challengeDetails, setChallengeDetails] = useState("");
	const { isOpen, onOpen, onClose } = useDisclosure();
	const router = useRouter();
	const { hasProfile, isModerator } = useSessionUser();

	useEffect(() => {
		setCanSubmitChallenge(
			challengeTitle.length > 0 &&
				challengeDetails.length > 0 &&
				reputationString.length > 0 &&
				selectedTags.length > 0 &&
				challengePeriod !== null
		);
	}, [
		challengeTitle,
		challengeDetails,
		reputationString,
		selectedTags,
		challengePeriod,
	]);

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

	const resetForm = () => {
		setSelectedTags([]);
		setReputationString("5");
		setChallengeTitle("");
		setChallengePeriod(new Date());
		setChallengeDetails("");
	};

	const handleCreateChallenge = async () => {
		if (!canSubmitChallenge) return;
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

			await fetchApiResponse({
				url: "/api/challenges",
				method: "POST",
				body: {
					title: challengeTitle,
					content: challengeDetails,
					challengePeriod: challengePeriod,
					reputation: reputationString,
					tags: commaSeparatedTags,
					authorPubKey: provider.wallet?.publicKey?.toBase58(),
				},
			})
				.then(async (res: any) => {
					const contentDataUrl = `${CHALLENGER_SITE_URL}/challenges/${res.data.id}`;

					const result = await challengerClient?.createChallenge(
						CRUX_KEY,
						provider.wallet?.publicKey,
						hashedChallengeAsPubKey,
						challengeTitle,
						contentDataUrl,
						// @ts-ignore hack to support Anchor enums
						tagsToSend,
						new BN(challengePeriodUnix),
						new BN(parseFloat(reputationString))
					);

					await fetchApiResponse({
						url: "/api/challenges",
						method: "PUT",
						body: {
							id: res.data.id,
							pubKey: result?.challenge.toBase58(),
						},
					});
					if (result.txSigMessage) {
						setChallengeCreated(true);
						setResponseMessage("Successfully created the challenge");
					} else {
						alert("Something went wrong");
					}
				})
				.then(() => {
					setTimeout(() => {
						router.push("/challenges");
					}, 5000);
				})
				.catch((err) => {
					console.log("error occured in then block", err);
				});
		} catch (e) {
			console.log("error occured in the try block", e);
			resetForm();
			setIsSubmitting(false);
			return;
		}
		resetForm();
		setIsSubmitting(false);
		onOpen();
	};

	return (
		<>
			<Box position={"relative"} mx={"25vw"} my={"4vh"}>
				<Text
					fontSize={"30"}
					fontWeight={"500"}
					fontFamily={"Readex Pro Variable"}
				>
					CREATE CHALLENGE
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
							isDisabled={!canSubmitChallenge}
							onClick={handleCreateChallenge}
						>
							Submit
						</Button>
					</FormControl>
				</Box>
			</Box>
			<SuccessMessage
				isOpen={challengeCreated}
				successMessage={responseMessage}
				onClose={() => {
					setChallengeCreated(false);
				}}
			/>
		</>
	);
}
