import {
  SplitPositionInputSchema,
  TokenAmountInputSchema,
  TransferPositionInputSchema,
} from "@helium/blockchain-api";
import BN from "bn.js";
import { describe, expect, it } from "vitest";
import {
  baseUnits,
  formatTokenAmount,
  isTokenAmountEdit,
  isTokenAmountInput,
  normalizeTokenAmountInput,
  parseTokenAmount,
  toApiAmount,
} from "../tokenAmount";

describe("isTokenAmountInput", () => {
  it("accepts each step of typing a small decimal", () => {
    for (const raw of ["", "0", "0.", "0.0", "0.00005"]) {
      expect(isTokenAmountInput(raw, 6)).toBe(true);
    }
  });

  it("accepts a leading decimal point", () => {
    expect(isTokenAmountInput(".5", 6)).toBe(true);
  });

  it("rejects more decimals than the mint has", () => {
    expect(isTokenAmountInput("0.0000001", 6)).toBe(false);
  });

  it("rejects decimals for a mint with no decimals", () => {
    expect(isTokenAmountInput("1.5", 0)).toBe(false);
    expect(isTokenAmountInput("15", 0)).toBe(true);
    expect(isTokenAmountInput("1.", 0)).toBe(false);
  });

  it("accepts any fraction length while the mint is loading", () => {
    expect(isTokenAmountInput("0.123456789", undefined)).toBe(true);
    expect(isTokenAmountInput("1.2.3", undefined)).toBe(false);
  });

  it("rejects text that is not a decimal number", () => {
    for (const raw of ["-1", "1e5", "abc", "1.2.3", " 1"]) {
      expect(isTokenAmountInput(raw, 6)).toBe(false);
    }
  });
});

describe("isTokenAmountEdit", () => {
  it("rejects an edit that adds a fraction digit over the limit", () => {
    expect(isTokenAmountEdit("0.000001", "0.0000011", 6)).toBe(false);
  });

  it("accepts backspace on text with too many fraction digits", () => {
    expect(isTokenAmountEdit("0.12345678", "0.1234567", 6)).toBe(true);
  });

  it("rejects a shorter edit that is not a decimal", () => {
    for (const next of ["abc", "-1", "1e3"]) {
      expect(isTokenAmountEdit("100.5", next, 8)).toBe(false);
    }
  });
});

describe("normalizeTokenAmountInput", () => {
  it("reads a comma as the decimal separator", () => {
    expect(normalizeTokenAmountInput("1,5")).toBe("1.5");
  });

  it("leaves text that has a point or no comma unchanged", () => {
    expect(normalizeTokenAmountInput("1,000.5")).toBe("1,000.5");
    expect(normalizeTokenAmountInput("12")).toBe("12");
  });

  it("leaves several commas with no point unchanged", () => {
    expect(normalizeTokenAmountInput("1,000,000")).toBe("1,000,000");
  });

  it("gives an edit the field accepts for a comma decimal", () => {
    expect(isTokenAmountEdit("1", normalizeTokenAmountInput("1,5"), 6)).toBe(
      true
    );
  });
});

// The parsed kind, with a valid amount written in base units.
const parse = (raw: string, decimals: number | undefined, balance: number) => {
  const result = parseTokenAmount(raw, decimals, baseUnits(new BN(balance)));
  return result.kind === "valid" ? result.amount.toString() : result.kind;
};

describe("parseTokenAmount", () => {
  it("flags text that is not a token amount", () => {
    expect(parse("abc", 6, 10_000_000)).toBe("invalid");
    expect(parse("0.0000001", 6, 10_000_000)).toBe("invalid");
  });

  it("treats an empty field or a lone point as empty", () => {
    expect(parse("", 6, 10_000_000)).toBe("empty");
    expect(parse(".", 6, 10_000_000)).toBe("empty");
  });

  it("gives no amount while the mint is loading", () => {
    expect(parse("1.5", undefined, 10_000_000)).toBe("mintLoading");
  });

  it("treats every spelling of zero as zero", () => {
    for (const raw of ["0", "0.", "0.000", ".0"]) {
      expect(parse(raw, 6, 10_000_000)).toBe("zero");
    }
  });

  it("flags an amount above the balance", () => {
    expect(parse("10.000001", 6, 10_000_000)).toBe("exceedsBalance");
  });

  it("flags any positive amount when the balance is zero", () => {
    expect(parse("0.00001", 6, 0)).toBe("exceedsBalance");
  });

  it("gives the amount in base units, up to and including the balance", () => {
    expect(parse("0.00005", 6, 10_000_000)).toBe("50");
    expect(parse(".5", 6, 10_000_000)).toBe("500000");
    expect(parse("10", 6, 10_000_000)).toBe("10000000");
    expect(parse("15", 0, 15)).toBe("15");
  });

  it("keeps every digit of an amount too large for a float", () => {
    const balance = baseUnits(new BN("13446333427367269"));
    const result = parseTokenAmount("134463334.27367269", 8, balance);
    expect(result.kind === "valid" && result.amount.eq(balance)).toBe(true);
  });
});

describe("formatTokenAmount", () => {
  it("writes small amounts without exponent notation", () => {
    expect(formatTokenAmount(baseUnits(new BN(1)), 8)).toBe("0.00000001");
  });

  it("drops trailing fraction zeros but keeps whole-number zeros", () => {
    expect(formatTokenAmount(baseUnits(new BN(100_000_000)), 6)).toBe("100");
    expect(formatTokenAmount(baseUnits(new BN(1_500_000)), 6)).toBe("1.5");
    expect(formatTokenAmount(baseUnits(new BN(0)), 6)).toBe("0");
    expect(formatTokenAmount(baseUnits(new BN(15)), 0)).toBe("15");
  });

  it("gives text that parses back to the same amount", () => {
    for (const amount of ["100981957", "13446333427367269", "1"]) {
      const raw = formatTokenAmount(baseUnits(new BN(amount)), 8);
      expect(isTokenAmountInput(raw, 8)).toBe(true);
      const result = parseTokenAmount(raw, 8, baseUnits(new BN(amount)));
      expect(result.kind === "valid" && result.amount.toString()).toBe(amount);
    }
  });
});

describe("toApiAmount", () => {
  // Create, split and merge each send toApiAmount of a parsed amount.
  const schemas = [
    TokenAmountInputSchema.shape.amount,
    SplitPositionInputSchema.shape.amount,
    TransferPositionInputSchema.shape.amount,
  ];

  it("gives text that each position schema accepts", () => {
    for (const raw of ["0.00005", "1.5", "134463334.27367269"]) {
      const result = parseTokenAmount(raw, 8, baseUnits(new BN("13446333427367269")));
      if (result.kind !== "valid") throw new Error(raw);
      for (const schema of schemas) {
        expect(schema.safeParse(toApiAmount(result.amount)).success).toBe(true);
      }
    }
  });

  it("gives base units, not decimal text", () => {
    expect(toApiAmount(baseUnits(new BN(150_000_000)))).toBe("150000000");
    for (const schema of schemas) {
      expect(schema.safeParse("1.5").success).toBe(false);
    }
  });
});
