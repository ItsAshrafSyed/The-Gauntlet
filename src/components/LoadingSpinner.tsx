import ClipLoader from "react-spinners/ClipLoader";
import { Flex, Text } from "@chakra-ui/react";

type LoadingSpinnerProps = {
	isLoading: boolean;
};

const LoadingSpinner: FC<LoadingSpinnerProps> = (props) => {
	return (
		<Flex
			width="100vw"
			height="100vh"
			justify="center"
			align="center"
			flexDirection="column"
		>
			<ClipLoader color={"#FF9728"} loading={props.isLoading} size={150} />
			<Text fontSize="2xl" fontWeight="bold" color="white">
				Loading...
			</Text>
		</Flex>
	);
};

export default LoadingSpinner;
