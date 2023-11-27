import { useMint } from "@helium/helium-react-hooks";
import {
  useHeliumVsrState,
  useVotingDelegatePositions,
  useVotingUndelegatePositions,
  useVotingDelegatedTo,
} from "@helium/voter-stake-registry-hooks";
import { EnhancedProxy } from "@helium/voter-stake-registry-sdk";
import BN from "bn.js";
import ReactMarkdown from "react-markdown";
import { humanReadable } from "../utils/formatting";
import { RevokeProxyButton } from "./RevokeProxyButton";
import { useMemo, useState } from "react";
import { ProxyButton } from "./ProxyButton";
import { AssignProxyModal } from "./AssignProxyModal";
import { PublicKey } from "@solana/web3.js";
import { RevokeProxyModal } from "./RevokeProxyModal";
import VoteHistory from "./VoteHistory";

export default function Proxies({
  proxy,
  detail,
  image,
}: {
  proxy: EnhancedProxy;
  detail: string;
  image: string;
}) {
  const { mint } = useHeliumVsrState();
  const { info: mintAcc } = useMint(mint);
  const decimals = mintAcc?.decimals;
  const [proxyModalVisible, setProxyModalVisible] = useState(false);
  const handleSetProxy = () => {
    setProxyModalVisible(true);
  };
  const [revokeProxyModalVisible, setRevokeProxyModalVisible] = useState(false);
  const handleSetRevokeProxy = () => {
    setRevokeProxyModalVisible(true);
  };
  const { votingDelegatePositions } = useVotingDelegatePositions();
  const { votingUndelegatePositions } = useVotingUndelegatePositions();
  const wallet = useMemo(() => new PublicKey(proxy.wallet), [proxy.wallet]);
  const { votingPower } = useVotingDelegatedTo(wallet);

  return (
    <div className="flex flex-col items-start bg-gray-800 text-white p-10">
      <img className="w-24 h-24 rounded-full mb-4" src={image} alt="Profile" />
      <h1 className="text-4xl font-bold mb-2">{proxy.name}</h1>
      {votingPower && (
        <div className="flex items-center">
          <span className="font-bold mr-2">My Delegations:</span>
          {humanReadable(votingPower, decimals)}
        </div>
      )}
      <RevokeProxyButton
        wallet={wallet}
        onClick={handleSetRevokeProxy}
        isLoading={false}
      />
      <ProxyButton
        className="ml-4 mt-4"
        onClick={handleSetProxy}
        isLoading={false}
      />
      {proxyModalVisible && (
        <AssignProxyModal
          isOpen={proxyModalVisible}
          onClose={() => setProxyModalVisible(false)}
          onSubmit={votingDelegatePositions}
          wallet={wallet}
        />
      )}
      {revokeProxyModalVisible && (
        <RevokeProxyModal
          isOpen={revokeProxyModalVisible}
          onClose={() => setRevokeProxyModalVisible(false)}
          onSubmit={votingUndelegatePositions}
          wallet={wallet}
        />
      )}
      <div className="text-lg mb-6">
        <div className="flex items-center">
          <span className="font-bold mr-2">Wallet:</span>
          <span>{proxy.wallet}</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-2">Num Delegations:</span>
          <span>{proxy.numDelegations}</span>
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-2">Delegated Tokens:</span>
          <span>
            {proxy.delegatedVeTokens ? humanReadable(
              new BN(proxy.delegatedVeTokens),
              decimals
            ) : "0"}
          </span>
        </div>
        <div className="flex items-center">
          <span className="font-bold mr-2">Percent:</span>
          <span>{Number(proxy.percent).toFixed(2)}</span>
        </div>
      </div>
      <div className="prose prose-dark whitespace-pre-wrap leading-snug">
        <ReactMarkdown>{detail}</ReactMarkdown>
      </div>
      <VoteHistory wallet={wallet}/>
    </div>
  );
}
