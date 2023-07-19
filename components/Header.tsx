import dynamic from "next/dynamic";

// add this
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);


export function Header() {
  return <div className="flex flex-row justify-end w-full p-4">
    <WalletMultiButton style={{ backgroundColor: "#B14FFF" }} />
  </div>;
}