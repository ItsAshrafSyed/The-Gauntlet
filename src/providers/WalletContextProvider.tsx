import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
	BackpackWalletAdapter,
	CoinbaseWalletAdapter,
	GlowWalletAdapter,
	PhantomWalletAdapter,
	SolflareWalletAdapter,
	SolletExtensionWalletAdapter,
	TokenaryWalletAdapter,
	TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { web3 } from "@coral-xyz/anchor";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import { SOLANA_RPC_URL } from "@/util/constants";

require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	// const network =
	// 	env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
	// 		? WalletAdapterNetwork.Mainnet
	// 		: WalletAdapterNetwork.Devnet;
	const endpoint = useMemo(() => SOLANA_RPC_URL ?? clusterApiUrl("devnet"), []);
	const wallets = useMemo(
		() => [
			new BackpackWalletAdapter(),
			new CoinbaseWalletAdapter(),
			new GlowWalletAdapter(),
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new SolletExtensionWalletAdapter(),
			new TorusWalletAdapter(),
			new TokenaryWalletAdapter(),
		],
		[]
	);

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>{children}</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export default WalletContextProvider;

// import {
// 	ConnectionProvider,
// 	WalletProvider,
// } from "@solana/wallet-adapter-react";
// import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
// import { clusterApiUrl } from "@solana/web3.js";
// import { FC, useMemo, ReactNode } from "react";
// import { SOLANA_RPC_URL } from "@/util/constants";

// require("@solana/wallet-adapter-react-ui/styles.css");

// export const WalletContextProvider: FC<{ children: ReactNode }> = ({
// 	children,
// }) => {
// 	const endpoint = useMemo(() => SOLANA_RPC_URL ?? clusterApiUrl("devnet"), []);

// 	return (
// 		<ConnectionProvider endpoint={endpoint}>
// 			<WalletProvider wallets={[]} autoConnect>
// 				<WalletModalProvider>{children}</WalletModalProvider>
// 			</WalletProvider>
// 		</ConnectionProvider>
// 	);
// };

// export default WalletContextProvider;
