import * as anchor from '@coral-xyz/anchor'
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Keypair, Connection } from '@solana/web3.js'
import { SOLANA_RPC_URL, CHALLENGER_PROGRAM_ID } from './constants'
import { Challenger, IDL as ChallengerIDL } from './idl/challenger'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'

// Do not use this from front-end code. This is only for server-side code.
export const createWorkspace = () => {
    const signingKeypair = Keypair.generate()
    // console.log(`Created keypair for ${signingKeypair.publicKey}`)

    const wallet = new NodeWallet(signingKeypair)
    const provider = new AnchorProvider(
        new Connection(SOLANA_RPC_URL || 'https://api.devnet.solana.com'),
        wallet,
        {}
    )

    anchor.setProvider(provider)

    // @ts-ignore Forum is the right type, TS just thinks it isn't
    const program = new anchor.Program(
        ChallengerIDL as anchor.Idl,
        CHALLENGER_PROGRAM_ID
    ) as Program<Challenger>

    return {
        provider,
        program,
    }
}
