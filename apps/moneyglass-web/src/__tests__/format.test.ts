import { describe, expect, it } from "vitest";

import { bigIntToNumber, formatCurrency, formatCurrencyExact, formatNumber } from "../lib/format";

describe("formatCurrency", () => {
  it("1兆円以上を「X.X兆円」形式で返す", () => {
    expect(formatCurrency(1_500_000_000_000)).toBe("1.5兆円");
    expect(formatCurrency(1_000_000_000_000)).toBe("1.0兆円");
  });

  it("1億以上を「X.X億円」形式で返す", () => {
    expect(formatCurrency(350_000_000)).toBe("3.5億円");
    expect(formatCurrency(100_000_000)).toBe("1.0億円");
  });

  it("1万以上を「XX万円」形式で返す", () => {
    expect(formatCurrency(50_000)).toBe("5万円");
    expect(formatCurrency(10_000)).toBe("1万円");
    expect(formatCurrency(123_456)).toBe("12万円");
  });

  it("1万未満を「X,XXX円」形式で返す", () => {
    expect(formatCurrency(9999)).toBe("9,999円");
    expect(formatCurrency(100)).toBe("100円");
    expect(formatCurrency(0)).toBe("0円");
  });

  it("BigInt 入力に対応する", () => {
    expect(formatCurrency(BigInt(1_500_000_000_000))).toBe("1.5兆円");
    expect(formatCurrency(BigInt(5000))).toBe("5,000円");
  });

  it("string 入力に対応する", () => {
    expect(formatCurrency("350000000")).toBe("3.5億円");
    expect(formatCurrency("1234")).toBe("1,234円");
  });
});

describe("formatNumber", () => {
  it("カンマ区切りでフォーマットする", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber("9999")).toBe("9,999");
  });
});

describe("formatCurrencyExact", () => {
  it("「¥X,XXX」形式で返す", () => {
    expect(formatCurrencyExact(1234)).toBe("¥1,234");
    expect(formatCurrencyExact(1000000)).toBe("¥1,000,000");
    expect(formatCurrencyExact(BigInt(5000))).toBe("¥5,000");
    expect(formatCurrencyExact("999")).toBe("¥999");
  });
});

describe("bigIntToNumber", () => {
  it("BigInt から number に変換する", () => {
    expect(bigIntToNumber(BigInt(42))).toBe(42);
    expect(bigIntToNumber(BigInt(0))).toBe(0);
  });

  it("number はそのまま返す", () => {
    expect(bigIntToNumber(100)).toBe(100);
  });

  it("string を number に変換する", () => {
    expect(bigIntToNumber("123")).toBe(123);
  });
});
