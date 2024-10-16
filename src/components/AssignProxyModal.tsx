import { useGovernance } from "@/providers/GovernanceProvider";
import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Loader2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { ExpirationTimeSlider } from "./ExpirationTimeSlider";
import { NetworkSelect } from "./NetworkSelect";
import { PositionPreview } from "./PositionPreview";
import { ProxySearch } from "./ProxySearch";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

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
  const { network: networkDefault } = useGovernance();
  const [network, setNetwork] = useState(networkDefault);

  const { loading, positions } = useGovernance();
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    new Set<string>()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const unproxiedPositions = useMemo(
    () =>
      positions?.filter(
        (p) => !p.proxy || p.proxy.nextVoter.equals(PublicKey.default)
      ) || [],
    [positions]
  );
  const today = new Date();
  const augustFirst = Date.UTC(
    today.getMonth() >= 7 ? today.getFullYear() + 1 : today.getFullYear(),
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

  const handleSelectedDays = (days: number) => {
    setSelectedDays(days > maxDays ? maxDays : days);
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
        setSelectedPositions(new Set([]));
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

  const selectedAll = unproxiedPositions.length === selectedPositions.size;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pt-10 px-8 overflow-y-auto overflow-x-hidden max-md:min-w-full max-md:min-h-full max-h-screen">
        <div className="flex flex-col gap-2">
          <div className="mb-1">
            <h2 className="text-2xl font-semibold leading-loose flex flex-row items-center">
              Assign Proxy
            </h2>
            <div className="text-white text-base font-normal">
              Enter the amount of voting power and cycle period you’d like to
              assign the selected voter
            </div>
          </div>

          <NetworkSelect
            network={network}
            onNetworkChange={(network) =>
              setNetwork(network as "hnt" | "mobile" | "iot")
            }
          />

          <ProxySearch value={recipient} onValueChange={setRecipient} />

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
            <div>
              <div className="w-full flex flex-col">
                <div className="flex flex-row justify-between items-center">
                  <div>Assign Positions</div>
                  <Button
                    onClick={() => {
                      if (selectedAll) {
                        setSelectedPositions(new Set([]));
                      } else {
                        setSelectedPositions(
                          new Set(
                            unproxiedPositions.map((p) => p.pubkey.toBase58())
                          )
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

                <div className="flex flex-col gap-2">
                  {unproxiedPositions?.map((position) => {
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
              <ExpirationTimeSlider
                maxDays={maxDays}
                setSelectedDays={handleSelectedDays}
                selectedDays={selectedDays}
                expirationTime={expirationTime}
              />
              <div className="mt-2 text-slate-400 text-xs font-normal leading-none">
                Your assigned proxy will expire by Aug 1 of each year by
                default, however you may select any date prior to this epoch
                date.
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
              disabled={isSubmitting || !selectedPositions.size || !recipient}
            >
              {isSubmitting && <Loader2 className="size-5 animate-spin" />}
              {!isSubmitting && "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PositionItem = ({
  position,
  isSelected,
  onClick,
}: {
  position: PositionWithMeta;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`rounded-xl border-4 gap-3 w-full p-0 hover:border-fgd-3 hover:bg-hv-gray-500 hover:cursor-pointer ${
        isSelected ? "border-ring" : "border-none"
      }`}
      onClick={onClick}
      key={position.pubkey.toBase58()}
    >
      <PositionPreview position={position} />
    </div>
  );
};
