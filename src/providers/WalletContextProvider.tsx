import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { FC, useMemo, ReactNode } from "react";
import { SOLANA_RPC_URL } from "@/util/constants";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const endpoint = useMemo(() => SOLANA_RPC_URL ?? clusterApiUrl("devnet"), []);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={[]} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export default WalletContextProvider;
