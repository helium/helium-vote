import { AccountProvider } from "@helium/account-fetch-cache-hooks";
import { useConnection } from "@solana/wallet-adapter-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";
import { Wallet } from "../components/Wallet";
import "../styles/index.css";

function Wrapper({ children }) {
  const { connection } = useConnection();
  return (
    <AccountProvider connection={connection} commitment="confirmed">
      {children}
    </AccountProvider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <div className="dark">
      <Wallet>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
        <ToastContainer />
      </Wallet>
    </div>
  );
}

export default MyApp;
