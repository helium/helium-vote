import { describe, expect, it } from "vitest";
import NetworkLayout from "../[network]/layout";

const render = (network: string) =>
  NetworkLayout({ children: null, params: { network } });

describe("NetworkLayout", () => {
  it("gives not found for a segment that is not a Network", () => {
    expect(() => render("foo")).toThrow("NEXT_NOT_FOUND");
    expect(() => render("HNT")).toThrow("NEXT_NOT_FOUND");
  });

  it("renders a Network", () => {
    expect(() => render("hnt")).not.toThrow();
  });
});
