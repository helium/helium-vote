import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Header } from "./Header";

const Page: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <main className="w-full min-h-screen">
        <Header />
        <div className="min-h-screen w-full pb-20 pt-5 sm:py-20">
          {children}
        </div>
      </main>
    </>
  );
};

export default Page;
