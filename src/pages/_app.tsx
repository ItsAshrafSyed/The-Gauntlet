import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import globalStyles from "@/styles/globalstyles";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={globalStyles}>
			<Navbar />
			<Component {...pageProps} />
			<Footer />
		</ChakraProvider>
	);
}
