import { LockTokensAccount } from "../components/LockTokensAccount";
import MetaTags from "../components/MetaTags"
import Page from "../components/Page";

const Staking = () => {
  return (
    <Page>
      <MetaTags
        title={"Stake Helium Tokens on heliumvote.com"}
        description={"Stake helium tokens on heliumvote.com"}
        url={`https://heliumvote.com/staking`}
      />
      <LockTokensAccount />  
    </Page>
  );
}

export default Staking;
