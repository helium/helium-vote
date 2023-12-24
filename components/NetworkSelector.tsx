import { TabPill } from "./TabPill";
import { useNetwork } from "../hooks/useNetwork";

export const NetworkSelector = () => {
  const { network } = useNetwork();

  return <div className="flex flex-col w-full">
    <div className="flex flex-row justify-stretch space-x-2 md:space-x-6">
      <TabPill
        active={network == "hnt"}
        name="HNT"
        href="/hnt"
        icon="/helium.svg"
      />
      <TabPill
        active={network == "mobile"}
        name="MOBILE"
        href="/mobile"
        icon="/mobile.svg"
      />
      <TabPill
        active={network == "iot"}
        name="IOT"
        href="/iot"
        icon="/iot.svg"
      />
    </div>
  </div>;
};
