import { Badge } from "@chakra-ui/react";
import { FC } from "react";

const BountyBadge: FC<{ reputation: number }> = ({ reputation }) => (
	<Badge variant="subtle" colorScheme="green" fontSize={["xs", "md"]}>
		Reputation◎{reputation}
	</Badge>
);

export default BountyBadge;
