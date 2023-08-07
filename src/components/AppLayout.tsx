import { ChakraProvider, HStack, Container } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WorkspaceProvider } from "../providers/WorkspaceProvider";
import { WalletContextProvider } from "../providers/WalletContextProvider";
import { SessionUserProvider } from "../providers/SessionUserProvider";

interface LayoutProps {
	children: ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
	return (
		<ChakraProvider>
			<WalletContextProvider>
				<WorkspaceProvider>
					<SessionUserProvider>
						<main>
							<Navbar />
							<Container maxW="100vw" minHeight={"100vh"}>
								{children}
							</Container>
							<Footer />
						</main>
					</SessionUserProvider>
				</WorkspaceProvider>
			</WalletContextProvider>
		</ChakraProvider>
	);
}
