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
	Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchApiResponse, shortenWalletAddress } from "../../util/lib";
import UserAvatarLink from "@/components/UserAvatarLink";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectSocials from "@/components/Modals/ConnectSocials";
import { FaTwitter, FaDiscord, FaGithub, FaCopy } from "react-icons/fa";

export default function MyProfile() {
	const [userProfile, setUserProfile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const { publicKey } = useWallet();
	const pubKey = publicKey?.toBase58();
	const router = useRouter();

	useEffect(() => {
		setIsLoading(true);
		if (!publicKey) return;
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
	console.log(userProfile);

	const handleEdit = () => {
		setIsEditing(true);
	};

	function copyToClipboard(text: string) {
		const textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand("copy");
		document.body.removeChild(textArea);
	}

	return (
		<>
			{isLoading ? (
				<LoadingSpinner isLoading={isLoading} />
			) : (
				<>
					<Container maxW="container.xl" mt={10}>
						<Card
							p={10}
							bg={"#151519"}
							borderRadius={"16"}
							borderColor={"#1E1E23"}
							boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
							color={"white"}
						>
							<Flex
								direction={{ base: "column", md: "row" }}
								alignItems={{ base: "center", md: "flex-start" }}
								justifyContent="space-between"
							>
								<Flex alignItems="center" mb={{ base: 5, md: 0 }}>
									<UserAvatarLink
										profileId={pubKey}
										placeholder={pubKey}
										size="xl"
									/>
									<VStack ml={5} alignItems="flex-start">
										<Tooltip label="Copy Address" aria-label="Copy Address">
											<Text
												fontSize="xl"
												fontWeight="bold"
												_hover={{ cursor: "pointer", color: "blue.500" }}
												onClick={() => {
													copyToClipboard(userProfile?.pubKey);
												}}
											>
												{shortenWalletAddress(userProfile?.pubKey)}
											</Text>
										</Tooltip>
									</VStack>
								</Flex>
								<HStack>
									<Button
										variant="outline"
										colorScheme="blue"
										size="lg"
										onClick={handleEdit}
									>
										Edit Profile
									</Button>
								</HStack>
							</Flex>
							<Flex
								direction={{ base: "column", md: "row" }}
								alignItems={{ base: "center", md: "flex-start" }}
								justifyContent="space-between"
								mt={"2vh"}
							>
								<Flex alignItems="center" mb={{ base: 5, md: 0 }}>
									<VStack>
										<HStack alignSelf={"flex-start"}>
											<Text fontSize="l" color="gray.500">
												User Profile
											</Text>
											<Tooltip label="Copy Address" aria-label="Copy Address">
												<Text
													fontSize="xl"
													fontWeight="bold"
													_hover={{ cursor: "pointer", color: "blue.500" }}
													onClick={() => {
														copyToClipboard(userProfile?.profilePdaPubKey);
													}}
												>
													{shortenWalletAddress(userProfile?.profilePdaPubKey)}
												</Text>
											</Tooltip>
										</HStack>
										<HStack spacing={"4"}>
											<HStack>
												<Text fontSize="l" color="gray.500">
													Challenges Submitted
												</Text>
												<Text fontSize="xl" fontWeight="bold">
													{userProfile?.challengesSubmitted}
												</Text>
											</HStack>
											<HStack>
												<Text fontSize="l" color="gray.500">
													Challenges Completed
												</Text>
												<Text fontSize="xl" fontWeight="bold">
													{userProfile?.challengesCompleted}
												</Text>
											</HStack>
											<HStack>
												<Text fontSize="l" color="gray.500">
													Reputation Earned
												</Text>
												<Text fontSize="xl" fontWeight="bold">
													{userProfile?.reputation}
												</Text>
											</HStack>
										</HStack>
									</VStack>
								</Flex>
							</Flex>
							<Flex
								direction={{ base: "column", md: "row" }}
								alignItems={{ base: "center", md: "flex-start" }}
								justifyContent="space-between"
								mt={"2vh"}
							>
								<Flex alignItems="center" mb={{ base: 5, md: 0 }}>
									<VStack alignItems={"flex-start"}>
										<HStack>
											<FaTwitter size={"3vh"} color="gray" />
											<Link
												fontSize="l"
												href={userProfile?.twitterUrl}
												isExternal
											>
												{userProfile?.twitterUrl
													? userProfile?.twitterUrl
													: "N/A"}
											</Link>
										</HStack>
										<HStack>
											<FaDiscord size={"3vh"} color="gray" />
											<Link
												fontSize="l"
												href={userProfile?.discordUrl}
												isExternal
											>
												{userProfile?.discordUrl
													? userProfile?.discordUrl
													: "N/A"}
											</Link>
										</HStack>
										<HStack>
											<FaGithub size={"3vh"} color="gray" />
											<Link
												fontSize="l"
												href={userProfile?.githubUrl}
												isExternal
											>
												{userProfile?.githubUrl
													? userProfile?.githubUrl
													: "N/A"}
											</Link>
										</HStack>
									</VStack>
								</Flex>
							</Flex>
						</Card>
					</Container>
					<ConnectSocials
						isOpen={isEditing}
						onClose={() => {
							setIsEditing(false);
						}}
					/>
				</>
			)}
		</>
	);
}
