import {
	Box,
	Flex,
	VStack,
	HStack,
	Text,
	Input,
	RadioGroup,
	Radio,
	Select,
	Textarea,
	Button,
	background,
} from "@chakra-ui/react";
import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";

export default function CreateChallenge() {
	const [data, setData] = useState({
		challengeName: "",
		challengeDescription: "",
		challengeURL: "",
		challengeReward: "",
		challengeCategory: "",
		challengeDifficulty: "",
	});

	return (
		<Box position={"relative"} mx={"25vw"} my={"4vh"}>
			<Text fontSize={"30"} fontWeight={"500"}>
				Create Challenge
			</Text>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log(data);
				}}
			>
				<FormControl>
					<FormLabel mt={5}>Challenge Name</FormLabel>
					<Input
						type="text"
						name="challengeName"
						placeholder="Enter a challenge name"
						value={data.challengeName}
						onChange={(e) => {
							setData({ ...data, challengeName: e.target.value });
						}}
					/>
				</FormControl>

				<FormControl>
					<FormLabel mt={3}>Challenge Description</FormLabel>
					<Textarea
						name="challengeDescription"
						placeholder="Enter a challenge description"
						value={data.challengeDescription}
						onChange={(e) => {
							setData({ ...data, challengeDescription: e.target.value });
						}}
						h={"20vh"}
					/>
				</FormControl>
				{/* <FormLabel mt={3}>Challenge Period</FormLabel> */}

				<FormControl>
					<FormLabel mt={3}>Website URL</FormLabel>
					<Input
						type="text"
						name="challengeURL"
						placeholder="Enter a website URL"
						value={data.challengeURL}
						onChange={(e) => {
							setData({ ...data, challengeURL: e.target.value });
						}}
					/>
				</FormControl>

				<FormControl>
					<FormLabel mt={3}>Reputation</FormLabel>
					<Input
						type="text"
						name="challengeReward"
						placeholder="Enter reputation number "
						value={data.challengeReward}
						onChange={(e) => {
							setData({ ...data, challengeReward: e.target.value });
						}}
					/>
				</FormControl>

				<FormControl>
					<FormLabel mt={3}>Challenge Category</FormLabel>
					{/* <Select
						placeholder="Choose a category"
						value={data.challengeCategory}
						onChange={(e) => {
							setData({ ...data, challengeCategory: e.target.value });
						}}
					>
						<option value="Defi">Defi</option>
						<option value="NFT">NFT</option>
						<option value="DePIN">DePIN</option>
					</Select> */}
				</FormControl>

				<FormControl>
					<FormLabel mt={3}>Challenge Difficulty</FormLabel>
					<RadioGroup
						value={data.challengeDifficulty}
						onChange={(e) => {
							setData({ ...data, challengeDifficulty: e });
						}}
					>
						<HStack spacing="24px">
							<Radio value="easy">Easy</Radio>
							<Radio value="medium">Medium</Radio>
							<Radio value="hard">Hard</Radio>
						</HStack>
					</RadioGroup>
				</FormControl>

				<FormControl mt={5}>
					<Button
						type="submit"
						value="Submit"
						variant={"solid"}
						textColor={"white"}
						_hover={{
							bg: "transparent",
						}}
						borderRadius={"9999"}
						border="1px solid #E5E7EB"
						background={
							"linear-gradient(135deg, #6366F1 0%, #D946EF 50%, #EC4899 100%)"
						}
					>
						Submit
					</Button>
				</FormControl>
			</form>
		</Box>
	);
}
