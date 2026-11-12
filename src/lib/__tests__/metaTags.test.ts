import { describe, expect, it } from "vitest";
import { SITE_URL } from "../routes.mjs";
import { formMetaTags, formProposalMetaTags } from "../utils";

describe("formMetaTags", () => {
  it("sets the image and site name under the keys Next reads", () => {
    const tags = formMetaTags({ openGraphImageAbsoluteUrl: "https://x/o.png" });
    expect(tags.openGraph).toMatchObject({
      images: ["https://x/o.png"],
      siteName: "Helium Vote",
    });
    expect(tags.twitter).toMatchObject({ images: ["https://x/o.png"] });
  });

  it("truncates a long description", () => {
    const tags = formMetaTags({ description: "word ".repeat(50) });
    expect(String(tags.description).length).toBeLessThanOrEqual(160);
  });

  it("uses the url as the canonical url", () => {
    const tags = formMetaTags({ url: `${SITE_URL}/hnt` });
    expect(tags.alternates?.canonical).toBe(`${SITE_URL}/hnt`);
  });
});

describe("formProposalMetaTags", () => {
  it("gives an absolute canonical url for the Proposal path", () => {
    const tags = formProposalMetaTags({
      name: "HIP 1",
      description: "Vote",
      path: "/hnt/proposals/abc",
    });
    expect(tags.alternates?.canonical).toBe(`${SITE_URL}/hnt/proposals/abc`);
  });
});
