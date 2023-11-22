import { HeliumVsrStateProvider } from "@helium/voter-stake-registry-hooks";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useNetwork } from "../hooks/useNetwork";
import { Header } from "./Header";

const Page: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { wallet } = useWallet();
  const { mint, setMint } = useNetwork();
  const { connection } = useConnection()

  return (
    <>
      <main className="w-full min-h-screen">
        <Header votingMint={mint} setVotingMint={setMint} />
        <div className="min-h-screen w-full pb-20 py-10">
          <HeliumVsrStateProvider
            heliumVoteUri="http://localhost:8081"
            // @ts-ignore
            wallet={wallet?.adapter}
            mint={mint}
            connection={connection}
          >
            {children}
          </HeliumVsrStateProvider>
        </div>
      </main>
    </>
  );
};

export default Page;
