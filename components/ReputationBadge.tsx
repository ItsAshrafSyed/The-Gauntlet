import { Badge } from "@chakra-ui/react";
import { FC } from "react";

const ReputationBadge: FC<{ reputation: number }> = ({ reputation }) => (
	<Badge variant="subtle" colorScheme="green" fontSize={["xs", "md"]}>
		Reputation◎{reputation}
	</Badge>
);

export default ReputationBadge;
