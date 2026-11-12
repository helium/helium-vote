import { organizationKey } from "@helium/organization-sdk";
import { PublicKey } from "@solana/web3.js";
import { describe, expect, it } from "vitest";
import {
  networkToName,
  organizationNetwork,
  parseGovNetwork,
} from "../constants";

describe("parseGovNetwork", () => {
  it("accepts each Network", () => {
    expect(parseGovNetwork("hnt")).toBe("hnt");
    expect(parseGovNetwork("mobile")).toBe("mobile");
    expect(parseGovNetwork("iot")).toBe("iot");
  });

  it("rejects other text", () => {
    expect(parseGovNetwork("foo")).toBeUndefined();
    expect(parseGovNetwork("HNT")).toBeUndefined();
  });
});

describe("networkToName", () => {
  it("names the Organization of each Network", () => {
    expect(networkToName.hnt).toBe("Helium");
    expect(networkToName.mobile).toBe("Helium MOBILE");
    expect(networkToName.iot).toBe("Helium IOT");
  });
});

describe("organizationNetwork", () => {
  it("gives the Network that owns the Organization", () => {
    expect(organizationNetwork(organizationKey("Helium IOT")[0])).toBe("iot");
  });

  it("gives undefined for an Organization no Network owns", () => {
    expect(organizationNetwork(PublicKey.default)).toBeUndefined();
  });
});
