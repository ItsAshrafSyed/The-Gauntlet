import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import globalStyles from "@/styles/globalstyles";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={globalStyles}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}
