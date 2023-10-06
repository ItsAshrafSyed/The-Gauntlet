import {
	Box,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";
import { FC } from "react";
import { useState } from "react";
import { useWorkspace } from "../../providers/WorkspaceProvider";
import { PublicKey } from "@solana/web3.js";
import { fetchApiResponse } from "../../util/lib";
import { CRUX_KEY, CHALLENGER_PROGRAM_ID } from "@/util/constants";
import "@fontsource-variable/readex-pro";
import { useRouter } from "next/router";
import SuccessMessage from "./SuccessMessage";
import FailureMessage from "./FailureMessage";

type CreateProfileModalProps = {
	isOpen: boolean; // Define the isOpen prop
	onClose: () => void;
	onOpen?: () => void;
};

const CreateProfileModal: FC<CreateProfileModalProps> = ({
	isOpen,
	onClose,
}) => {
	const router = useRouter();
	const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);
	const { provider, program, challengerClient, wallet } = useWorkspace();
	const [profile, setProfile] = useState<any>(null);
	const [isProfileCreated, setIsProfileCreated] = useState(false);
	const [notCreatedProfile, setNotCreatedProfile] = useState(false);
	const [responseMessage, setResponseMessage] = useState("");

	const handleCreateProfile = async () => {
		if (!challengerClient) return;
		if (!provider) return;
		if (!provider.wallet) return;
		setIsCreatingProfile(true);

		const [profilePda] = PublicKey.findProgramAddressSync(
			[
				Buffer.from("user_profile"),
				CRUX_KEY.toBytes(),
				provider.wallet.publicKey.toBytes(),
			],
			CHALLENGER_PROGRAM_ID
		);

		let profileAccount = await program?.account.userProfile.fetchNullable(
			profilePda
		);

		if (profileAccount) {
			alert("profile already exists");
			setProfile(profileAccount);
			setIsCreatingProfile(false);
		}

		try {
			const response = await challengerClient
				.createUserProfile(CRUX_KEY, provider.wallet?.publicKey)
				.then(async (res) => {
					await fetchApiResponse({
						url: `/api/users/`,
						method: "POST",
						body: {
							pubKey: provider.wallet?.publicKey.toBase58(),
							profilePdaPubKey: profilePda.toBase58(),
						},
					});
					if (res.txSigMessage) {
						setResponseMessage(res.txSigMessage);
						setIsProfileCreated(true);
					} else {
						setResponseMessage(res.txSigMessage);
						setNotCreatedProfile(true);
					}
				})
				.then(() => {
					setTimeout(() => {
						router.reload();
					}, 2500);
				})
				.catch((e) => {
					console.log("error occured in then block", e);
					setIsCreatingProfile(false);
					return;
				});
			// Check if the profile creation was successful
		} catch (e) {
			console.log(e);
			setIsCreatingProfile(false);
			return;
		}
		profileAccount = await program?.account.userProfile.fetchNullable(
			profilePda
		);
		setProfile(profileAccount);
		// setHasProfile(true);
		setIsCreatingProfile(false);
		onClose();
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg="#111" border={"1px solid #E5E7EB"}>
					<ModalHeader fontSize={"28"} fontWeight={"600"}>
						Create Profile
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody fontSize={"18"} fontWeight={"400"}>
						To submit your submission for the challenge, please create a profile
						first.
					</ModalBody>
					<ModalFooter>
						<Button
							variant="ghost"
							color={"white"}
							mr={3}
							onClick={onClose}
							_hover={{
								bg: "transparent",
								border: "1px solid #FFB84D",
							}}
						>
							Close
						</Button>
						<Button
							bg={"#FFB84D"}
							_hover={{
								bg: "transparent",
								color: "white",
								border: "1px solid #FFB84D",
							}}
							onClick={handleCreateProfile}
							isLoading={isCreatingProfile}
						>
							Create Profile
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			{isProfileCreated ? (
				<SuccessMessage
					isOpen={isProfileCreated} // Pass the state to the child modal
					successMessage={responseMessage}
					onClose={() => setIsProfileCreated(false)} // Close the child modal
				/>
			) : (
				<FailureMessage
					isOpen={notCreatedProfile} // Pass the state to the child modal
					failureMessage={responseMessage}
					onClose={() => setNotCreatedProfile(true)} // Close the child modal
				/>
			)}
		</>
	);
};
export default CreateProfileModal;
