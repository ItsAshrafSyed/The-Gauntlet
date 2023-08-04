import {
	createContext,
	useState,
	useEffect,
	useMemo,
	ReactNode,
	FC,
	useContext,
} from "react";
import { useWorkspace } from "./WorkspaceProvider";
import { fetchApiResponse } from "../util/lib";

export type SessionUserMetadata = {
	username: string;
	avatarUrl: string;
};

export type SessionUserContext = {
	isConnected: boolean;
	publicKey: string | null;
	metadata: SessionUserMetadata | null;
};

const SessionUserContext = createContext({
	isConnected: false,
	publicKey: null,
	metadata: null,
} as SessionUserContext);

export const SessionUserProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { wallet } = useWorkspace();
	const [metadata, setMetadata] = useState<SessionUserMetadata | null>(null);

	const publicKey = useMemo(() => {
		return wallet ? wallet.publicKey.toBase58() : null;
	}, [wallet]);

	// Exposed for more explicit checks
	const isConnected = useMemo(() => {
		return !!publicKey;
	}, [publicKey]);

	// Handles three possible scenarios:
	// 1. User does not have a wallet connected => null sessionUser and publicKey
	// 2. User has a wallet connected, but has not created a user account => null sessionUser and non-null publicKey
	// 3. User has a wallet connected, and has created a user account => non-null sessionUser and publicKey
	useEffect(() => {
		if (!publicKey) {
			setMetadata(null);
			return;
		}

		async function loadData() {
			try {
				// todo use actual type for User response
				const { user } = await fetchApiResponse<any>({
					url: `/api/users/${publicKey}`,
				});

				setMetadata(
					user
						? {
								username: user.username ?? "",
								avatarUrl: user.avatarUrl ?? "",
						  }
						: null
				);
			} catch (err) {
				console.log("error", err);
				return;
			}
		}

		loadData();
	}, [publicKey]);

	return (
		<SessionUserContext.Provider
			value={{
				isConnected,
				publicKey,
				metadata,
			}}
		>
			{children}
		</SessionUserContext.Provider>
	);
};

export const useSessionUser = (): SessionUserContext => {
	return useContext(SessionUserContext);
};
