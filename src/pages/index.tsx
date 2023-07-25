import { Hero } from "../../components/Hero";
import { Box } from "@chakra-ui/react";
import { TrendingChallenges } from "../../components/TrendingChallenges";
import { CreateOwnChallenge } from "../../components/CreateOwnChallenge";
import AppLayout from "../../components/AppLayout";
import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";

const Index: NextPageWithLayout = () => {
	return (
		<Box>
			<Hero />
			<TrendingChallenges />
			<CreateOwnChallenge />
		</Box>
	);
};
Index.getLayout = function getLayout(page: ReactElement) {
	return <AppLayout>{page}</AppLayout>;
};

export default Index;
