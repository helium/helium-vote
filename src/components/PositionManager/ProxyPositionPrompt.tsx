"use client";

import { useGovernance } from "@/providers/GovernanceProvider";
import {
  PositionWithMeta,
  useKnownProxy,
} from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { FC, useMemo, useState } from "react";
import { RiUserSharedFill } from "react-icons/ri";
import { ExpirationTimeSlider } from "../ExpirationTimeSlider";
import { ProxySearch } from "../ProxySearch";
import { Button } from "../ui/button";

export const ProxyPositionPrompt: FC<{
  position: PositionWithMeta;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: ({
    proxy,
    expirationTime,
    isRevoke,
  }: {
    proxy?: string;
    expirationTime?: number;
    isRevoke?: boolean;
  }) => Promise<void>;
}> = ({ position, isSubmitting, onCancel, onConfirm }) => {
  const isProxied =
    position.proxy?.nextVoter &&
    !position.proxy?.nextVoter.equals(PublicKey.default);
  const { knownProxy } = useKnownProxy(position.proxy?.nextVoter);
  const [proxy, setProxy] = useState<string>(
    position.proxy?.nextVoter.equals(PublicKey.default)
      ? ""
      : position.proxy?.nextVoter.toBase58() || ""
  );
  const [isRenewing, setIsRenewing] = useState(false);
  const { network } = useGovernance();

  const today = new Date();
  const augustFirst = Date.UTC(
    today.getMonth() === 6
      ? today.getFullYear() + 1
      : today.getMonth() > 6
      ? today.getFullYear() + 1
      : today.getFullYear(),
    7,
    1
  );
  const maxDate = augustFirst - 1000;
  const maxDays = Math.floor(
    (maxDate - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  const [selectedDays, setSelectedDays] = useState(maxDays);
  const expirationTime = useMemo(
    () =>
      selectedDays === maxDays
        ? maxDate.valueOf() / 1000
        : new Date().valueOf() / 1000 + selectedDays * (24 * 60 * 60),
    [selectedDays, maxDays, maxDate]
  );

  const handleSubmit = async (isRevoke: boolean) => {
    setIsRenewing(!isRevoke);
    await onConfirm({ proxy, expirationTime, isRevoke });
  };

  return (
    <div className="flex flex-col h-full p-8 max-md:p-4 max-w-2xl mx-auto overflow-auto md:justify-center gap-4">
      <div className="hidden max-md:flex flex-row w-full justify-end mb-4">
        <X className="size-6" onClick={onCancel} />
      </div>
      <div className="flex flex-col gap-1">
        <h3>Update Proxy</h3>
        {isProxied ? (
          <>
            <p className="text-base">
              Your position is currently proxied to{" "}
              {knownProxy?.name || position?.proxy?.nextVoter.toBase58()}
            </p>
            {position.isProxyRenewable && (
              <p className="text-sm text-yellow-500 mt-2">
                Your proxy assignment is expiring soon
              </p>
            )}
            {position.isProxyExpired && (
              <p className="text-sm text-red-500 mt-2">
                Your proxy assignment has expired
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-base">
              Assign proxy to a trusted voter if you don&rsquo;t want to vote.
              You can override any active votes anytime - your vote takes
              precedence over a proxy.
            </p>
            <div className="w-full flex flex-row justify-center mt-4 mb-2">
              <Link href={`/${network}/proxies`} className="w-full">
                <Button variant="secondary" className="gap-2 w-full">
                  <RiUserSharedFill className="size-4" />
                  Browse Proxies
                </Button>
              </Link>
            </div>
            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-slate-500"></div>
              <span className="flex-shrink mx-4 text-sm font-semibold text-slate-500">
                OR
              </span>
              <div className="flex-grow border-t border-slate-500"></div>
            </div>
          </>
        )}
      </div>
      {isProxied ? (
        <div className="flex flex-col max-md:flex-grow justify-end gap-2">
          {(position.isProxyRenewable || position.isProxyExpired) && (
            <>
              <ExpirationTimeSlider
                maxDays={maxDays}
                setSelectedDays={setSelectedDays}
                selectedDays={selectedDays}
                expirationTime={expirationTime}
              />
              <div className="flex flex-row justify-between items-center gap-2">
                <Button
                  className="text-foreground gap-2 flex-1"
                  disabled={isSubmitting}
                  onClick={() => handleSubmit(false)}
                >
                  {isSubmitting && isRenewing && (
                    <Loader2 className="size-5 animate-spin" />
                  )}
                  {isSubmitting && isRenewing ? "Renewing" : "Renew"}
                </Button>
              </div>
              <div className="relative flex py-3 items-center">
                <div className="flex-grow border-t border-slate-500"></div>
                <span className="flex-shrink mx-4 text-sm font-semibold text-slate-500">
                  OR
                </span>
                <div className="flex-grow border-t border-slate-500"></div>
              </div>
            </>
          )}
          <div className="flex flex-row justify-between items-center gap-2">
            <Button variant="secondary" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="text-foreground gap-2 flex-1"
              disabled={isSubmitting}
              onClick={() => handleSubmit(true)}
            >
              {isSubmitting && !isRenewing && (
                <Loader2 className="size-5 animate-spin" />
              )}
              {isSubmitting && !isRenewing ? "Revoking" : "Revoke"}
            </Button>
          </div>
          <div className="flex flex-row justify-center">
            <p className="text-xs text-muted-foreground text-center">
              A network fee will be required
            </p>
          </div>
        </div>
      ) : (
        <>
          <ProxySearch value={proxy} onValueChange={setProxy} />
          <ExpirationTimeSlider
            maxDays={maxDays}
            setSelectedDays={setSelectedDays}
            selectedDays={selectedDays}
            expirationTime={expirationTime}
          />
          <div className="flex flex-col max-md:flex-grow justify-end gap-2">
            <div className="flex flex-row justify-between items-center gap-2">
              <Button variant="secondary" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                className="text-foreground gap-2 flex-1"
                disabled={isSubmitting}
                onClick={() => handleSubmit(false)}
              >
                {isSubmitting && <Loader2 className="size-5 animate-spin" />}
                {isSubmitting ? "Assigning" : "Assign"}
              </Button>
            </div>
            <div className="flex flex-row justify-center">
              <p className="text-xs text-muted-foreground text-center">
                A network fee will be required
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
