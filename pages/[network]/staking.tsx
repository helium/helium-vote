import ContentSection from "../../components/ContentSection";
import { LockTokensAccount } from "../../components/LockTokensAccount";
import MetaTags from "../../components/MetaTags";
import { NetworkSelector } from "../../components/NetworkSelector";
import Page from "../../components/Page";

const Staking = () => {
  return (
    <Page className="bg-gray-800">
      <MetaTags
        title={"Stake Helium Tokens on heliumvote.com"}
        description={"Stake helium tokens on heliumvote.com"}
        url={`https://heliumvote.com/staking`}
      />

      <ContentSection>
        <NetworkSelector route="/$network/staking" />
      </ContentSection>
      <ContentSection className="mt-4">
        <LockTokensAccount />
      </ContentSection>
    </Page>
  );
};

export default Staking;
