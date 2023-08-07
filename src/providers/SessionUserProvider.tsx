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
	hasProfile: boolean;
	isModerator: boolean;
	publicKey: string | null;
	metadata: SessionUserMetadata | null;
};

const SessionUserContext = createContext({
	isConnected: false,
	hasProfile: false,
	isModerator: false,
	publicKey: null,
	metadata: null,
} as SessionUserContext);

export const SessionUserProvider: FC<{ children: ReactNode }> = ({
	children,
}) => {
	const { wallet, program } = useWorkspace();
	const [metadata, setMetadata] = useState<SessionUserMetadata | null>(null);
	const [isModerator, setIsModerator] = useState(false);
	const [hasProfile, setHasProfile] = useState(false);

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
				const response = await fetchApiResponse<any>({
					url: `/api/users/${publicKey}`,
				});
				const user = response.data.user;
				if (user) {
					setHasProfile(true);
				}
				setMetadata(
					user
						? {
								username: user.username ?? "",
								avatarUrl: user.avatarUrl ?? "",
						  }
						: null
				);
				const profileAccount = await program?.account.userProfile.fetchNullable(
					user.profilePdaPubKey
				);
				setIsModerator(profileAccount?.isModerator ? true : false);
			} catch (err) {
				console.log("error", err);
				return;
			}
		}

		loadData();
	}, [publicKey, program, wallet]);

	return (
		<SessionUserContext.Provider
			value={{
				isConnected,
				publicKey,
				hasProfile,
				isModerator,
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
