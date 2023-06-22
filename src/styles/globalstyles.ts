import { extendTheme } from "@chakra-ui/react";
import { color } from "framer-motion";

const globalStyles = extendTheme({
	styles: {
		global: {
			body: {
				bg: "#000000",
				fontFamily: "Rubik",
				fontStyle: "normal",
				color: "#ffffff",
			},
		},
	},
});

export default globalStyles;
