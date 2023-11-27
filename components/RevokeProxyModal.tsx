import { useMint } from "@helium/helium-react-hooks";
import {
  PositionWithMeta,
  useHeliumVsrState,
} from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import React, { useEffect, useMemo, useState } from "react";
import { useMetaplexMetadata } from "../hooks/useMetaplexMetadata";
import { getMinDurationFmt, getTimeLeftFromNowFmt } from "../utils/dateTools";
import { humanReadable } from "../utils/formatting";
import { notify } from "../utils/notifications";
import Button, { SecondaryButton } from "./Button";
import { LoadingDots } from "./Loading";
import Modal from "./Modal";
import { PositionItem } from "./AssignProxyModal";

interface RevokeProxyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (args: { positions: PositionWithMeta[] }) => Promise<void>;
  wallet?: PublicKey;
}

export const RevokeProxyModal: React.FC<RevokeProxyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  wallet,
}) => {
  const { loading, positions, mint } = useHeliumVsrState();
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    new Set<string>()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const delegatedPositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          p.votingDelegation &&
          !p.votingDelegation.nextOwner.equals(PublicKey.default) &&
          (!wallet || p.votingDelegation.nextOwner.equals(wallet))
      ),
    [positions]
  );

  const handleOnSubmit = async () => {
    try {
      const positionsByKey = positions.reduce((acc, p) => {
        acc[p.pubkey.toString()] = p;
        return acc;
      }, {} as Record<string, PositionWithMeta>);
      setIsSubmitting(true);
      await onSubmit({
        positions: Array.from(selectedPositions).map((p) => positionsByKey[p]),
      });
      onClose();
    } catch (e) {
      setIsSubmitting(false);
      notify({
        type: "error",
        message: e.message || "Unable to Revoke proxy",
        error: e,
      });
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <h2 className="text-xl mb-4 flex flex-row items-center">
        Revoke Voting Proxy
      </h2>
      {loading ? (
        <>
          <div className="bg-hv-gray-500 rounded-md w-full p-4 mb-4 font-normal text-s">
            <div>Fetching Positions available to Revoke Proxy</div>
          </div>
          <div className="p-4">
            <LoadingDots />
          </div>
        </>
      ) : (
        <div className="p-2">
          <div className="w-full flex flex-col gap-2 pt-4">
            <h2 className="text-lg mb-2">Positions to Revoke</h2>

            {delegatedPositions?.map((position) => {
              return (
                <PositionItem
                  isSelected={selectedPositions?.has(
                    position.pubkey.toBase58()
                  )}
                  position={position}
                  mint={mint}
                  onClick={() => {
                    setSelectedPositions((sel) => {
                      const key = position.pubkey.toBase58();
                      const newS = new Set(sel);
                      if (sel.has(key)) {
                        newS.delete(key);
                        return newS;
                      } else {
                        newS.add(key);
                        return newS;
                      }
                    });
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
      <div className="flex flex-col pt-4">
        <Button
          className="mb-4"
          onClick={handleOnSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Revoke Proxy
        </Button>
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
      </div>
    </Modal>
  );
};
