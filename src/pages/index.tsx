import { Navbar } from "../../components/Navbar";
import { Hero } from "../../components/Hero";
import { Box } from "@chakra-ui/react";
import { TrendingChallenges } from "../../components/TrendingChallenges";

export default function Home() {
	return (
		<Box>
			<Navbar />
			<Hero />
			<TrendingChallenges />
		</Box>
	);
}
