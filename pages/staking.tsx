import classNames from "classnames";
import { LockTokensAccount } from "../components/LockTokensAccount";
import MetaTags from "../components/MetaTags";
import Page from "../components/Page";
import { useState } from "react";
import ContentSection from "../components/ContentSection";

const Staking = () => {
  const [currentTab, setCurrentTab] = useState(0);
  return (
    <Page>
      <MetaTags
        title={"Stake Helium Tokens on heliumvote.com"}
        description={"Stake helium tokens on heliumvote.com"}
        url={`https://heliumvote.com/staking`}
      />

      <ContentSection className="pt-10 sm:pt-0">
        <LockTokensAccount />
      </ContentSection>
    </Page>
  );
};

export default Staking;
