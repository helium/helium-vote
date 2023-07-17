import "tailwindcss/tailwind.css";
import "../styles/index.css";
import { AccountProvider } from "@helium/account-fetch-cache-hooks";
import { useConnection } from "@solana/wallet-adapter-react";
import { Wallet } from "../components/Wallet";

function Wrapper({ children })  {
  const { connection } = useConnection();
  return <AccountProvider connection={connection} commitment="confirmed">{children}</AccountProvider>;
}

function MyApp({ Component, pageProps }) {
  return (
    <Wallet>
      <Wrapper>
        <Component {...pageProps} />
      </Wrapper>
    </Wallet>
  );
}

export default MyApp;
