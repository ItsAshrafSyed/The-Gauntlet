import { PublicKey } from '@solana/web3.js';
import { CHALLENGER_PROG_ID } from './index';

export const findCruxAuthorityPDA = async (crux: PublicKey) => {
    return PublicKey.findProgramAddress(
        [crux.toBytes()],
        CHALLENGER_PROG_ID
    );
};

export const findCruxTreasuryPDA = async (crux: PublicKey) => {
    return PublicKey.findProgramAddress(
        [Buffer.from('treasury'), crux.toBytes()],
        CHALLENGER_PROG_ID
    );
};

export const findUserProfilePDA = async (crux: PublicKey, profileOwner: PublicKey) => {
    return PublicKey.findProgramAddress(
        [Buffer.from('user_profile'), crux.toBytes(), profileOwner.toBytes()],
        CHALLENGER_PROG_ID
    );
};

export const findChallengePDA = async (crux: PublicKey, challengeSeed: PublicKey) => {
    return PublicKey.findProgramAddress(
        [Buffer.from('challenge'), crux.toBytes(), challengeSeed.toBytes()],
        CHALLENGER_PROG_ID
    );
};

export const findSubmissionPDA = async (challenge: PublicKey, userProfile: PublicKey, ) => {
    return PublicKey.findProgramAddress(
        [Buffer.from('submission'), challenge.toBytes(), userProfile.toBytes()],
        CHALLENGER_PROG_ID
    );
};
