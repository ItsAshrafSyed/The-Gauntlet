import { Hero } from "../components/Hero";
import { Box } from "@chakra-ui/react";
import { TrendingChallenges } from "../components/TrendingChallenges";
import { CreateOwnChallenge } from "../components/CreateOwnChallenge";

export default function Home() {
	return (
		<Box>
			<Hero />
			{/* <TrendingChallenges /> */}
			{/* <CreateOwnChallenge /> */}
		</Box>
	);
}
