import { Avatar, Link } from "@chakra-ui/react";

const UserAvatarLink = ({
	profileId,
	username,
	avatarUrl,
	size,
	placeholder,
}: any) => (
	<Link href={`/profile/${profileId}`} _hover={{ opacity: 0.8 }}>
		<Avatar size={size} name={placeholder} src={avatarUrl} />
	</Link>
);

export default UserAvatarLink;
