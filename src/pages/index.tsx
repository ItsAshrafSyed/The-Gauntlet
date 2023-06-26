import { Navbar } from "../../components/Navbar";
import { Hero } from "../../components/Hero";
import { Box } from "@chakra-ui/react";
import { TrendingChallenges } from "../../components/TrendingChallenges";
import { CreateOwnChallenge } from "../../components/CreateOwnChallenge";
import { Footer } from "../../components/Footer";

export default function Home() {
	return (
		<Box>
			<Navbar />
			<Hero />
			<TrendingChallenges />
			<CreateOwnChallenge />
			<Footer />
		</Box>
	);
}
