import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Text,
	Textarea,
} from "@chakra-ui/react";
import { useState } from "react";

export default function CreateProfile() {
	const [data, setData] = useState({
		profileName: "",
		profileDescription: "",
		email: "",
	});
	return (
		<Box position={"relative"} mx={"25vw"} my={"4vh"}>
			<Text fontSize={"30"} fontWeight={"500"}>
				Create Profile
			</Text>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					console.log(data);
				}}
			>
				<FormControl>
					<FormLabel mt={5}>Profile Name</FormLabel>
					<Input
						type="text"
						name="profileName"
						placeholder="Enter a profile name"
						value={data.profileName}
						onChange={(e) => {
							setData({ ...data, profileName: e.target.value });
						}}
					/>
				</FormControl>
				<FormControl>
					<FormLabel mt={3}>Profile Description</FormLabel>
					<Textarea
						name="profileDescription"
						placeholder="Enter a profile description"
						value={data.profileDescription}
						onChange={(e) => {
							setData({ ...data, profileDescription: e.target.value });
						}}
						h={"20vh"}
					/>
				</FormControl>
				<FormControl>
					<FormLabel mt={3}>Email</FormLabel>
					<Input
						type="email"
						name="email"
						placeholder="Enter an email"
						value={data.email}
						onChange={(e) => {
							setData({ ...data, email: e.target.value });
						}}
					/>
				</FormControl>

				<Button
					mt={"5"}
					type="submit"
					colorScheme="blue"
					onClick={() => {
						console.log(data);
					}}
				>
					Create Profile
				</Button>
			</form>
		</Box>
	);
}
