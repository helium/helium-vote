import { useMint } from "@helium/helium-react-hooks";
import {
  PositionWithMeta,
  useHeliumVsrState,
} from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import React, { useEffect, useMemo, useState } from "react";
import { getMinDurationFmt, getTimeLeftFromNowFmt } from "@/lib/dateTools";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { useMetaplexMetadata } from "@/hooks/useMetaplexMetadata";
import { humanReadable } from "@/lib/utils";
import { Button } from "./ui/button";

interface AssignProxyModalProps {
  onSubmit: (args: {
    positions: PositionWithMeta[];
    recipient: PublicKey;
    expirationTime: BN;
  }) => Promise<void>;
  wallet?: PublicKey;
}

export const AssignProxyModal: React.FC<
  React.PropsWithChildren<AssignProxyModalProps>
> = ({ onSubmit, wallet, children }) => {
  const [open, setOpen] = useState(false);

  const { loading, positions, mint } = useHeliumVsrState();
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    new Set<string>()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const unproxiedPositions = useMemo(
    () =>
      positions?.filter(
        (p) => !p.proxy || p.proxy.nextOwner.equals(PublicKey.default)
      ) || [],
    [positions]
  );
  const today = new Date();
  const augustFirst = Date.UTC(
    today.getMonth() > 7 ? today.getFullYear() + 1 : today.getFullYear(),
    7,
    1
  );
  const maxDate = Math.min(
    augustFirst - 1000,
    ...unproxiedPositions
      .filter((p) => selectedPositions.has(p.pubkey.toBase58()) && p.proxy)
      // @ts-ignore
      .map((p) => p.proxy.expirationTime.toNumber() * 1000)
  );
  const maxDays = Math.floor(
    (maxDate - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const [selectedDays, setSelectedDays] = useState(maxDays);
  const [recipient, setRecipient] = useState(wallet?.toBase58() || "");
  const expirationTime = useMemo(
    () =>
      selectedDays === maxDays
        ? maxDate.valueOf() / 1000
        : new Date().valueOf() / 1000 + selectedDays * (24 * 60 * 60),
    [selectedDays, maxDays, maxDate]
  );
  useEffect(() => {
    if (selectedDays > maxDays) {
      setSelectedDays(maxDays);
    }
  }, [maxDays]);

  const changeRecipient = (e: any) => {
    setRecipient(e.target.value);
  };

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
          recipient: new PublicKey(recipient),
          expirationTime: new BN(
            Math.min(expirationTime, maxDate.valueOf() / 1000)
          ),
        });
        setOpen(false);
      }
    } catch (e: any) {
      setIsSubmitting(false);
      toast(e.message || "Unable to assign proxy");
    }
  };
  const handleOpenChange = () => {
    setIsSubmitting(false);
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pt-10 px-8 overflow-y-auto overflow-x-hidden max-md:min-w-full max-md:min-h-full max-h-screen">
        <h2 className="text-xl mb-4 flex flex-row items-center">
          Assign Voting Proxy
        </h2>
        {loading ? (
          <>
            <div className="bg-hv-gray-500 rounded-md w-full p-4 mb-4 font-normal text-s">
              <div>Fetching Positions available to Proxy</div>
            </div>
            <div className="p-4">
              <Loader2 className="size-5 animate-spin" />
            </div>
          </>
        ) : (
          <div className="p-2">
            <div className="bg-hv-gray-500 rounded-md w-full p-4 mb-4 font-normal text-s">
              <div>
                Once you assign this wallet as your proxy, it will be able to
                use your positions to vote on HIPs. You can override these votes
                or revoke the proxy at any point. The proxy will expire at the
                set expiration date.
              </div>
              <br />
              <div>
                Proxy assignments are reset <b>August 1st</b> yearly.
              </div>
            </div>
            <div>
              <h2 className="text-lg mt-4 mb-2">Expiration Time</h2>
              <input
                type="range"
                min="1"
                step="1"
                className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-neutral-200"
                max={maxDays}
                value={selectedDays}
                onChange={(e) => {
                  setSelectedDays(parseInt(e.target.value));
                }}
              />
              <div className="text-sm text-right">
                {selectedDays} days (
                {new Date(expirationTime * 1000).toLocaleString()})
              </div>
            </div>
            <div className="w-full flex flex-col gap-2 pt-4">
              <h2 className="text-lg mb-2">Positions to Assign</h2>

              {unproxiedPositions?.map((position) => {
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
            {!wallet && (
              <div className="w-full flex flex-col gap-2 pt-4">
                <h2 className="text-lg mb-2">Wallet to Assign</h2>
                <input
                  value={recipient}
                  onChange={changeRecipient}
                  className="text-black border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-300"
                  type="text"
                  placeholder="Wallet Address"
                />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col pt-4">
          <Button
            className="mb-4"
            onClick={handleOnSubmit}
            disabled={isSubmitting || !selectedPositions.size}
          >
            {isSubmitting && <Loader2 className="size-5 animate-spin" />}
            Proxy your Votes
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PositionItem = ({
  position,
  isSelected,
  onClick,
  mint,
}: {
  position: PositionWithMeta;
  isSelected: boolean;
  mint: PublicKey;
  onClick: () => void;
}) => {
  const { info: mintAcc } = useMint(mint);
  const { symbol } = useMetaplexMetadata(mint);
  const { lockup } = position;
  const lockupKind = Object.keys(lockup.kind)[0] as string;
  const isConstant = lockupKind === "constant";
  const lockedTokens =
    mintAcc && humanReadable(position.amountDepositedNative, mintAcc.decimals);
  const lockupTime = isConstant
    ? getMinDurationFmt(position.lockup.startTs, position.lockup.endTs)
    : getTimeLeftFromNowFmt(position.lockup.endTs);
  const lockupLabel = isConstant ? "duration" : "time left";
  const fullLabel = `${lockedTokens} ${symbol} locked with ${lockupTime} ${lockupLabel}`;

  return (
    <div
      className={`border rounded-md flex flex-row items-center gap-3 w-full p-4 hover:border-fgd-3 hover:bg-hv-gray-500 hover:cursor-pointer ${
        isSelected ? "border border-hv-blue-700" : "border-hv-gray-200"
      }`}
      onClick={onClick}
      key={position.pubkey.toBase58()}
    >
      {fullLabel}
    </div>
  );
};
