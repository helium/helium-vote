import ContentSection from "../../../components/ContentSection";
import MetaTags from "../../../components/MetaTags";
import Page from "../../../components/Page";
import Proxies from "../../../components/Proxies";

export default function ProxiesPage() {
  return (
    <Page>
      <MetaTags />
      <ContentSection>
        <Proxies />
      </ContentSection>
    </Page>
  );
}
