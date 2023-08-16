import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import globalStyles from "@/styles/globalstyles";
import AppLayout from "../components/AppLayout";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AppLayout>
			<ChakraProvider theme={globalStyles}>
				<Component {...pageProps} />
			</ChakraProvider>
		</AppLayout>
	);
}
