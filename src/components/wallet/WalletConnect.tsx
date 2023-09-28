import {
	Box,
	Flex,
	Text,
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	HStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { shortenWalletAddress } from "../../util/lib";
import { useRouter } from "next/router";
import { AiOutlineDown } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { FaUserCog, FaUserCircle } from "react-icons/fa";

export const WalletConnect = () => {
	const { connected, publicKey, disconnect, signMessage } = useWallet();
	const { setVisible } = useWalletModal();
	const router = useRouter();

	const handleConnect = () => {};

	const handleDisconnect = () => {
		disconnect().then(() => {
			router.reload();
		});
	};

	return (
		<>
			{connected && publicKey ? (
				<>
					<Menu>
						<MenuButton
							as={Button}
							bg={"#151519"}
							color={" #FF9728"}
							borderRadius={"16"}
							borderColor={"#1E1E23"}
							_hover={{
								bg: "transparent",
							}}
							_active={{
								bg: "transparent",
							}}
							fontSize={18}
							fontWeight={700}
							fontFamily={"Readex Pro Variable"}
							rightIcon={<AiOutlineDown />}
							leftIcon={<FaUserCircle size={"1.8rem"} />}
						>
							{shortenWalletAddress(publicKey?.toBase58())}
						</MenuButton>
						<MenuList
							__css={{
								background: "#151519",
								border: "1px solid #1E1E23",
								fontSize: "18",
								fontFamily: "Readex Pro Variable",
								fontWeight: "800",
								borderRadius: "5",
								boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
								w: "max-content",
								h: "max-content",
								p: "2",
								mr: "2",
							}}
						>
							<MenuItem
								bg={"#151519"}
								onClick={() => router.push(`/profile/myProfile`)}
							>
								<HStack>
									<FaUserCog />
									<Text>Profile Settings</Text>
								</HStack>
							</MenuItem>
							<MenuItem bg={"#151519"} onClick={handleDisconnect}>
								<HStack>
									<FiLogOut />
									<Text>Disconnect</Text>
								</HStack>
							</MenuItem>
						</MenuList>
					</Menu>
				</>
			) : (
				<Button
					borderRadius="8"
					variant="solid"
					_hover={{
						bg: "transparent",
						color: "white",
						border: "1px solid #E5E7EB",
					}}
					fontSize={16}
					textColor="Black"
					fontWeight={700}
					fontFamily={"Readex Pro Variable"}
					onClick={() => setVisible(true)}
					background={"#FF9728"}
				>
					CONNECT WALLET
				</Button>
			)}
		</>
	);
};
