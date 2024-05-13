import { useGovernance } from "@/providers/GovernanceProvider";
import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import { DialogContent } from "@radix-ui/react-dialog";
import { PublicKey } from "@solana/web3.js";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { PositionItem } from "./AssignProxyModal";
import { Button } from "./ui/button";
import { Dialog } from "./ui/dialog";

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
  const { loading, positions, mint } = useGovernance();
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    new Set<string>()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const proxiedPositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          p.proxy &&
          !p.proxy.nextOwner.equals(PublicKey.default) &&
          (!wallet || p.proxy.nextOwner.equals(wallet))
      ),
    [positions, wallet]
  );

  const handleOnSubmit = async () => {
    try {
      const positionsByKey = positions?.reduce((acc, p) => {
        acc[p.pubkey.toString()] = p;
        return acc;
      }, {} as Record<string, PositionWithMeta>);
      setIsSubmitting(true);
      if (positionsByKey) {
        await onSubmit({
          positions: Array.from(selectedPositions).map(
            (p) => positionsByKey[p]
          ),
        });
      }

      onClose();
    } catch (e: any) {
      setIsSubmitting(false);
      toast(e.message || "Unable to Revoke proxy");
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent>
        <h2 className="text-xl mb-4 flex flex-row items-center">
          Revoke Voting Proxy
        </h2>
        {loading ? (
          <>
            <div className="bg-hv-gray-500 rounded-md w-full p-4 mb-4 font-normal text-s">
              <div>Fetching Positions available to Revoke Proxy</div>
            </div>
            <div className="p-4">
              <Loader2 className="size-5 animate-spin" />
            </div>
          </>
        ) : (
          <div className="p-2">
            <div className="w-full flex flex-col gap-2 pt-4">
              <h2 className="text-lg mb-2">Positions to Revoke</h2>

              {proxiedPositions?.map((position) => {
                return (
                  <PositionItem
                    key={position.pubkey.toBase58()}
                    isSelected={selectedPositions?.has(
                      position.pubkey.toBase58()
                    )}
                    position={position}
                    mint={mint!}
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
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="size-5 animate-spin" />}
            Revoke Proxy
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
