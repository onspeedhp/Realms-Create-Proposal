import {
  WalletMultiButton,
  WalletDisconnectButton,
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { createProposal } from '../functions/createProposal';

export const CreateProposal = () => {
  const wallet = useWallet();
  return (
    <>
      {wallet.publicKey ? (
        <>
          <button
            onClick={async () => {
              await createProposal(wallet);
            }}
          >
            Create Proposal
          </button>
          <WalletDisconnectButton style={{ backgroundColor: 'black' }} />
        </>
      ) : (
        <>
          <WalletMultiButton style={{ backgroundColor: 'black' }} />
        </>
      )}
    </>
  );
};
