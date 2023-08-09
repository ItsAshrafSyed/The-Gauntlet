// import { useRouter } from "next/router";
// import { ReactElement, useEffect, useState } from "react";
// import { Heading, Divider, Text, Container } from "@chakra-ui/react";
// import AppLayout from "../../components/AppLayout";

// import UserProfileBanner from "../../components/UserProfileBanner";
// import { fetchApiResponse } from "../../util/lib";

// const UserProfilePage = () => {
// 	const [userProfile, setUserProfile] = useState<any>(null);
// 	const router = useRouter();
// 	const { id } = router.query;

// 	useEffect(() => {
// 		if (!id) return;

// 		const loadData = async () => {
// 			// todo define and use type for users
// 			const result = await fetchApiResponse<any>({
// 				url: `/api/users/${id}`,
// 			});

// 			if (!result) {
// 				router.push("/404");
// 				return;
// 			}
// 			const { user, socials } = result.data;

// 			setUserProfile({
// 				...user,
// 				socialLinks: socials.length
// 					? socials.map((social: any) => {
// 							return {
// 								source: social.type,
// 								url: social.url,
// 							};
// 					  })
// 					: [],
// 			});
// 		};
// 		loadData();
// 	}, [id, router, router.query]);

// 	return (
// 		<Container minWidth="80%" mt="2rem">
// 			<UserProfileBanner
// 				userId={(id as string) ? id : ""}
// 				avatarUrl={userProfile?.avatarUrl ? userProfile.avatarUrl : ""}
// 				socialLinks={userProfile?.socialLinks ?? []}
// 				status={userProfile?.status ? userProfile.status : ""}
// 				userStats={{ questions: 2, answers: 7 }}
// 				username={userProfile?.username ? userProfile.username : ""}
// 			/>
// 			<Divider />
// 			<Heading size="lg" mt="1rem">
// 				{`About ${userProfile?.username ? userProfile.username : ""}`}
// 			</Heading>
// 			<Text>{userProfile?.bio ? userProfile.bio : ""}</Text>
// 		</Container>
// 	);
// };

// UserProfilePage.getLayout = function getLayout(page: ReactElement) {
// 	return <AppLayout>{page}</AppLayout>;
// };

// export default UserProfilePage;
