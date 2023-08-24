import { HeliumVsrStateProvider } from "@helium/voter-stake-registry-hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNetwork } from "../hooks/useNetwork";
import { Header } from "./Header";

const Page: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { publicKey } = useWallet();
  const { network, setNetwork, mint, setMint } = useNetwork();

  return (
    <>
      <main className="w-full min-h-screen">
        <Header votingMint={mint} setVotingMint={setMint} />
        <div className="min-h-screen w-full pb-20 py-10">
          <HeliumVsrStateProvider wallet={publicKey} mint={mint}>
            {children}
          </HeliumVsrStateProvider>
        </div>
      </main>
    </>
  );
};

export default Page;
