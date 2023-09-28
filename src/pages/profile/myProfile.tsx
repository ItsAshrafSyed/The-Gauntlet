import {
	Box,
	Button,
	Flex,
	HStack,
	Icon,
	Text,
	VStack,
	Container,
	Card,
	Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchApiResponse, shortenWalletAddress } from "../../util/lib";
import UserAvatarLink from "@/components/UserAvatarLink";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useWallet } from "@solana/wallet-adapter-react";

export default function MyProfile() {
	const [userProfile, setUserProfile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { publicKey } = useWallet();
	const pubKey = publicKey?.toBase58();
	const router = useRouter();

	useEffect(() => {
		setIsLoading(true);
		console.log("err in useEff", pubKey);
		if (!publicKey) return;
		console.log("get user");
		const loadData = async () => {
			// todo define and use type for users
			const result = await fetchApiResponse<any>({
				url: `/api/users/${pubKey}`,
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
	}, [publicKey, router, router.query, pubKey]);

	return (
		<>
			{isLoading ? (
				<LoadingSpinner isLoading={isLoading} />
			) : (
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
							<HStack></HStack>
						</VStack>
					</Flex>
				</Card>
			)}
		</>
	);
}
