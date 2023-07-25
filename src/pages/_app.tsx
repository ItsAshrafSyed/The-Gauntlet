import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import globalStyles from "@/styles/globalstyles";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { ReactElement, ReactNode } from "react";
import { NextPage } from "next/types";

export type NextPageWithLayout = NextPage & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export default function App({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

	return getLayout(
		<>
			<ChakraProvider theme={globalStyles}>
				<Navbar />
				<Component {...pageProps} />
				<Footer />
			</ChakraProvider>
		</>
	);
}
