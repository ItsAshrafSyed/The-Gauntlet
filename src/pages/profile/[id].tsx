import {
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	Icon,
	Text,
	VStack,
	Container,
	Card,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/router";
import { fetchApiResponse, shortenWalletAddress } from "../../util/lib";
import UserAvatarLink from "@/components/UserAvatarLink";
import LoadingSpinner from "@/components/LoadingSpinner";
import { set } from "@coral-xyz/anchor/dist/cjs/utils/features";

export default function UserProfilePage() {
	const [userProfile, setUserProfile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		setIsLoading(true);
		if (!id || typeof id !== "string") return;
		const loadData = async () => {
			// todo define and use type for users
			const result = await fetchApiResponse<any>({
				url: `/api/users/${id}`,
			});

			if (!result) {
				router.push("/404");
				return;
			}
			const { userProfile } = result.data;

			setUserProfile({
				...userProfile,
			});
			setIsLoading(false);
		};
		loadData();
	}, [id, router, router.query]);

	return (
		<>
			{isLoading ? (
				<LoadingSpinner isLoading={isLoading} />
			) : (
				//code a card in the centre of the page that displays the user's profile with shadow and border radius

				<Card
					bg={"#151519"}
					borderRadius={"16"}
					borderColor={"#1E1E23"}
					boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
					w={"max-content"}
					h={"max-content"}
					mt={"5%"}
					mb={"5%"}
					ml={"auto"}
					mr={"auto"}
					p={"5%"}
					fontSize={18}
					fontWeight={700}
				>
					<Flex
						justifyContent={"center"}
						alignItems={"center"}
						flexDirection={"column"}
					>
						<UserAvatarLink placeholder={userProfile?.pubKey} size={"2xl"} />
						<Text
							color={"#FF9728"}
							fontSize={"2xl"}
							fontWeight={"bold"}
							fontFamily={"Readex Pro Variable"}
							mt={"2%"}
						>
							{shortenWalletAddress(userProfile?.pubKey)}
						</Text>
						<VStack align={"flex-start"}>
							<Text color={"white"} fontWeight={"bold"} mt={"2%"}>
								Profile Account:{" "}
								{shortenWalletAddress(userProfile?.profilePdaPubKey)}
							</Text>
							<Text
								color={"white"}
								fontSize={"xl"}
								fontWeight={"bold"}
								mt={"2%"}
							>
								Reputation Earned: {userProfile?.reputation}
							</Text>
							<Text
								color={"white"}
								fontSize={"xl"}
								fontWeight={"bold"}
								mt={"2%"}
							>
								Challenges Completed: {userProfile?.challengesCompleted}
							</Text>
							<Text
								color={"white"}
								fontSize={"xl"}
								fontWeight={"bold"}
								mt={"2%"}
							>
								Challenges Submitted: {userProfile?.challengesSubmitted}
							</Text>
						</VStack>
					</Flex>
				</Card>
			)}
		</>
	);
}
