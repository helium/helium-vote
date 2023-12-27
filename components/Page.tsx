import { HeliumVsrStateProvider } from "@helium/voter-stake-registry-hooks";
import { Header } from "./Header";
import { Wallet } from "@coral-xyz/anchor";
import { useAnchorProvider } from "@helium/helium-react-hooks";
import { useNetwork } from "../hooks/useNetwork";

const Page: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => {
  const anchorProvider = useAnchorProvider();
  const { mint } = useNetwork();

  return (
    <>
      <main className={`${className} w-full min-h-screen`}>
        <Header />
        <div className="min-h-screen w-full pb-20 py-10">
          <HeliumVsrStateProvider
            connection={anchorProvider?.connection}
            wallet={anchorProvider?.wallet as Wallet}
            mint={mint}
          >
            {children}
          </HeliumVsrStateProvider>
        </div>
      </main>
    </>
  );
};

export default Page;
