import { useGovernance } from "@/providers/GovernanceProvider";
import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { PositionItem } from "./AssignProxyModal";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useSolanaUnixNow } from "@helium/helium-react-hooks";
import BN from "bn.js";

interface RevokeProxyModalProps {
  onSubmit: (args: { positions: PositionWithMeta[] }) => Promise<void>;
  wallet?: PublicKey;
}

export const RevokeProxyModal: React.FC<
  React.PropsWithChildren<RevokeProxyModalProps>
> = ({ onSubmit, wallet, children }) => {
  const [open, setOpen] = useState(false);

  const { loading, positions } = useGovernance();
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    new Set<string>()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const proxiedPositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          p.proxy &&
          !p.proxy.nextVoter.equals(PublicKey.default) &&
          (!wallet || p.proxy.nextVoter.equals(wallet))
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

      setOpen(false);
      setSelectedPositions(new Set([]));
    } catch (e: any) {
      setIsSubmitting(false);
      console.error(e);
      toast(e.message || "Unable to Revoke proxy");
    }
  };

  const handleOpenChange = () => {
    setIsSubmitting(false);
    setOpen(!open);
  };

  const selectedAll = proxiedPositions?.length === selectedPositions.size;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="pt-10 px-8 overflow-y-auto overflow-x-hidden max-md:min-w-full max-md:min-h-full max-h-screen">
        <div className="mb-1">
          <h2 className="text-xl mb-4 flex flex-row items-center">
            Revoke Proxies
          </h2>
          <div className="text-white text-base font-normal">
            Select the positions you would like to revoke from this voter.
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div>Proxied Positions</div>
          <Button
            onClick={() => {
              if (selectedAll) {
                setSelectedPositions(new Set([]));
              } else {
                setSelectedPositions(
                  new Set(proxiedPositions?.map((p) => p.pubkey.toBase58()))
                );
              }
            }}
            variant="link"
            className="text-white text-base font-normal"
            style={{ paddingRight: "0px" }}
          >
            {selectedAll ? "Deselect All" : "Select All"}
          </Button>
        </div>
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
            <div className="w-full flex flex-col gap-2">
              {proxiedPositions?.map((position) => {
                return (
                  <PositionItem
                    key={position.pubkey.toBase58()}
                    isSelected={selectedPositions?.has(
                      position.pubkey.toBase58()
                    )}
                    position={position}
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
        <div className="justify-stretch flex flex-row pt-2 gap-2.5">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Go Back
          </Button>
          <Button
            className="flex-1 text-white"
            onClick={handleOnSubmit}
            disabled={isSubmitting || !selectedPositions.size}
          >
            {isSubmitting && <Loader2 className="size-5 animate-spin" />}
            {!isSubmitting && "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
