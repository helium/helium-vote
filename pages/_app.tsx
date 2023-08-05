import { AccountProvider } from "@helium/account-fetch-cache-hooks";
import { HNT_MINT } from "@helium/spl-utils";
import { HeliumVsrStateProvider } from "@helium/voter-stake-registry-hooks";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ToastContainer } from "react-toastify";
import "tailwindcss/tailwind.css";
import { Wallet } from "../components/Wallet";
import "../styles/index.css";
import "react-toastify/dist/ReactToastify.css";

function Wrapper({ children }) {
  const { connection } = useConnection();
  return (
    <AccountProvider connection={connection} commitment="confirmed">
      {children}
    </AccountProvider>
  );
}

function VsrState({ children }) {
  const { publicKey } = useWallet();
  const mint = HNT_MINT;
  return (
    <HeliumVsrStateProvider wallet={publicKey} mint={mint}>
      {children}
    </HeliumVsrStateProvider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <div className="dark">
      <Wallet>
        <Wrapper>
          <VsrState>
            <Component {...pageProps} />
          </VsrState>
        </Wrapper>
        <ToastContainer />
      </Wallet>
    </div>
  );
}

export default MyApp;
