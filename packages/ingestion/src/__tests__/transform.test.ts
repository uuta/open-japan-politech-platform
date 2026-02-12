import { describe, expect, it } from "vitest";

import { mapBillStatus, mapSessionType } from "../kokkai/transform";

describe("mapBillStatus", () => {
  it('"成立" を ENACTED に変換する', () => {
    expect(mapBillStatus("成立")).toBe("ENACTED");
  });

  it('"衆議院で可決" を PASSED_LOWER に変換する', () => {
    expect(mapBillStatus("衆議院で可決")).toBe("PASSED_LOWER");
  });

  it('"参議院で可決" を PASSED_UPPER に変換する', () => {
    expect(mapBillStatus("参議院で可決")).toBe("PASSED_UPPER");
  });

  it('"審議中" を COMMITTEE に変換する', () => {
    expect(mapBillStatus("審議中")).toBe("COMMITTEE");
  });

  it('"委員会" を COMMITTEE に変換する', () => {
    expect(mapBillStatus("委員会")).toBe("COMMITTEE");
  });

  it('"否決" を REJECTED に変換する', () => {
    expect(mapBillStatus("否決")).toBe("REJECTED");
  });

  it('"撤回" を WITHDRAWN に変換する', () => {
    expect(mapBillStatus("撤回")).toBe("WITHDRAWN");
  });

  it("不明な文字列は SUBMITTED を返す", () => {
    expect(mapBillStatus("不明なステータス")).toBe("SUBMITTED");
    expect(mapBillStatus("")).toBe("SUBMITTED");
  });
});

describe("mapSessionType", () => {
  it('"通常" を ORDINARY に変換する', () => {
    expect(mapSessionType("通常")).toBe("ORDINARY");
  });

  it('"臨時" を EXTRAORDINARY に変換する', () => {
    expect(mapSessionType("臨時")).toBe("EXTRAORDINARY");
  });

  it('"特別" を SPECIAL に変換する', () => {
    expect(mapSessionType("特別")).toBe("SPECIAL");
  });

  it("不明な文字列は ORDINARY を返す", () => {
    expect(mapSessionType("不明")).toBe("ORDINARY");
    expect(mapSessionType("")).toBe("ORDINARY");
  });
});
