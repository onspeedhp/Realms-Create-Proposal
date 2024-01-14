import { Connection, PublicKey } from '@solana/web3.js';
import { createBase64Proposal } from '../helpers/createBase64Proposal';
import {
  getAllProposals,
  getTokenOwnerRecord,
  getTokenOwnerRecordAddress,
} from '@solana/spl-governance';
import { EndpointTypes } from '../constants/index';
import { Wallet, WalletContextState } from '@solana/wallet-adapter-react';

const ENDPOINT_URL = 'https://api.devnet.solana.com';

const CLUSTER = 'devnet';

// Pubkey
const REALM = new PublicKey('N4DpBDjivrRYEegGW49tSZDnzyQSWzhwAzXqGhHY5dg');

// Owner
const GOVERNANCE_PROGRAM = new PublicKey(
  'GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw'
);

// Community mint
const PROPOSAL_MINT = new PublicKey(
  'FQ3uRgs1YEuQHkT3xaQd61DUpuuFxTyZQQa42wAgvLmm'
);

class GovernanceCli {
  private connectionContext = {
    cluster: CLUSTER as EndpointTypes,
    current: new Connection(ENDPOINT_URL, 'recent'),
    endpoint: ENDPOINT_URL,
  };
  wallet: WalletContextState;
  constructor(wallet: WalletContextState) {
    this.wallet = wallet;
    this.connectionContext.cluster = 'devnet';
  }

  async createProposal() {
    const governancePk = '5VX99mcbhZW4hXyPvfs4tQze6TamyDPtTncpUD2a9wrz';
    const delegatedWallet = '';

    const title = 'Testing Syncvote Proposal';
    const description = 'Testing Syncvote Proposal';
    const instructions: string[] = [];

    let tokenOwnerRecordPk: PublicKey | null = null;
    if (delegatedWallet) {
      tokenOwnerRecordPk = await getTokenOwnerRecordAddress(
        GOVERNANCE_PROGRAM,
        REALM,
        PROPOSAL_MINT,
        new PublicKey(delegatedWallet)
      );
    } else {
      tokenOwnerRecordPk = await getTokenOwnerRecordAddress(
        GOVERNANCE_PROGRAM,
        REALM,
        PROPOSAL_MINT,
        this.wallet.publicKey!
      );
    }
    const [tokenOwnerRecord, proposals] = await Promise.all([
      getTokenOwnerRecord(this.connectionContext.current, tokenOwnerRecordPk),
      getAllProposals(
        this.connectionContext.current,
        GOVERNANCE_PROGRAM,
        REALM
      ),
    ]);
    const proposalIndex = proposals.flatMap((x) => x).length;

    try {
      const address = await createBase64Proposal(
        this.connectionContext.current,
        this.wallet,
        tokenOwnerRecord,
        new PublicKey(governancePk),
        REALM,
        GOVERNANCE_PROGRAM,
        PROPOSAL_MINT,
        title,
        description,
        proposalIndex,
        [...instructions]
      );
      console.log(
        `Success proposal created url: https://realms.today/dao/${REALM.toBase58()}/proposal/${address.toBase58()}`
      );
    } catch (e) {
      console.log('ERROR: ', e);
    }
  }
}

export const createProposal = async (wallet: WalletContextState) => {
  //Load wallet from file system assuming its in default direction /Users/-USERNAME-/.config/solana/id.json
  const cli = new GovernanceCli(wallet);
  await cli.createProposal();
};
