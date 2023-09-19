import { FC, ReactNode, createContext, useContext } from "react";
import { Program, AnchorProvider, Idl, setProvider } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import {
	AnchorWallet,
	useAnchorWallet,
	useConnection,
} from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { CHALLENGER_PROGRAM_ID } from "../util/constants";
import { Challenger, IDL as ChallengerIDL } from "../util/challengerSdk";
import { ChallengerClient } from "../util/challengerSdk";
const WorkspaceContext = createContext({});

export interface Workspace {
	connection?: Connection;
	provider?: AnchorProvider;
	program?: Program<Challenger>;
	wallet?: AnchorWallet;
	challengerClient?: ChallengerClient;
}

const WorkspaceProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const wallet = useAnchorWallet();
	const { connection } = useConnection();

	const provider = new AnchorProvider(connection, wallet ?? MockWallet, {});
	setProvider(provider);

	const program = new Program(ChallengerIDL as Idl, CHALLENGER_PROGRAM_ID);

	const challengerClient = new ChallengerClient(
		connection,
		// @ts-ignore todo: align types here
		wallet,
		ChallengerIDL,
		CHALLENGER_PROGRAM_ID
	);

	const workspace = {
		connection,
		provider,
		program,
		wallet,
		challengerClient,
	};

	return (
		<WorkspaceContext.Provider value={workspace}>
			{children}
		</WorkspaceContext.Provider>
	);
};

const useWorkspace = (): Workspace => {
	return useContext(WorkspaceContext);
};

const MockWallet = {
	publicKey: Keypair.generate().publicKey,
	signTransaction: () => Promise.reject(),
	signAllTransactions: () => Promise.reject(),
};

export { WorkspaceProvider, useWorkspace };
