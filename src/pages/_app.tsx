import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import globalStyles from "@/styles/globalstyles";
import AppLayout from "../components/AppLayout";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AppLayout>
			<ChakraProvider theme={globalStyles}>
				<Component {...pageProps} />
			</ChakraProvider>
		</AppLayout>
	);
}
