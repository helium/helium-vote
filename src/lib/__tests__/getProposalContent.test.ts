import { organizationKey } from "@helium/organization-sdk";
import { PublicKey } from "@solana/web3.js";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchProposal } = vi.hoisted(() => ({ fetchProposal: vi.fn() }));

vi.mock("@helium/proposal-sdk", () => ({
  init: async () => ({ account: { proposalV0: { fetch: fetchProposal } } }),
}));

import { getProposalContent } from "../utils";

const fetchUri = vi.fn();

const proposal = (namespace: PublicKey, uri: string) => ({
  name: "HIP 1",
  namespace,
  uri,
});

const heliumOrganization = organizationKey("Helium")[0];

describe("getProposalContent", () => {
  beforeEach(() => {
    fetchProposal.mockReset();
    fetchUri.mockReset();
    fetchUri.mockResolvedValue({ text: async () => "content" });
    vi.stubGlobal("fetch", fetchUri);
  });

  it("gives not found, without fetching the uri, for a Proposal no Network owns", async () => {
    fetchProposal.mockResolvedValue(
      proposal(PublicKey.default, "https://example.com/hip")
    );

    await expect(getProposalContent(PublicKey.default)).rejects.toThrow(
      "NEXT_NOT_FOUND"
    );
    expect(fetchUri).not.toHaveBeenCalled();
  });

  it("fetches an upper-case http uri over https", async () => {
    fetchProposal.mockResolvedValue(proposal(heliumOrganization, "HTTP://x"));

    const result = await getProposalContent(PublicKey.default);

    expect(fetchUri).toHaveBeenCalledWith("https://x", expect.anything());
    expect(result).toEqual({ content: "content", name: "HIP 1", network: "hnt" });
  });

  it("gives not found for a uri that is not https", async () => {
    for (const uri of ["ftp://x", "file:///etc/passwd", "not a url"]) {
      fetchProposal.mockResolvedValue(proposal(heliumOrganization, uri));

      await expect(getProposalContent(PublicKey.default)).rejects.toThrow(
        "NEXT_NOT_FOUND"
      );
    }
    expect(fetchUri).not.toHaveBeenCalled();
  });
});
