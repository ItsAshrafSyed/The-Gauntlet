import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import globalStyles from "@/styles/globalstyles";
import AppLayout from "../components/AppLayout";
import Script from "next/script";
import { GA_TRACKING_ID } from "../util/constants";
import { Analytics } from "@vercel/analytics/react";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<AppLayout>
			{/* Global Site Tag (gtag.js) - Google Analytics */}
			<Script
				strategy="afterInteractive"
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
			/>
			<Script
				id="gtag-init"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
				}}
			/>
			<Analytics />
			<ChakraProvider theme={globalStyles}>
				<Component {...pageProps} />
			</ChakraProvider>
		</AppLayout>
	);
}
