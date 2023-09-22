import { extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";

const globalStyles = extendTheme({
	styles: {
		global: {
			body: {
				bg: "#000000",
				fontFamily: "Inter",
				fontStyle: "normal",
				color: "#ffffff",
			},
		},
	},
});

export default globalStyles;
