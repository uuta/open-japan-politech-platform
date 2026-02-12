import { describe, expect, it } from "vitest";

import { buildPaginatedResponse } from "../pagination";

describe("buildPaginatedResponse", () => {
  it("正しいページネーション構造を返す", () => {
    const data = [{ id: 1 }, { id: 2 }];
    const params = { page: 1, limit: 10, skip: 0 };
    const result = buildPaginatedResponse(data, 50, params);

    expect(result).toEqual({
      data: [{ id: 1 }, { id: 2 }],
      pagination: {
        page: 1,
        limit: 10,
        total: 50,
        totalPages: 5,
      },
    });
  });

  it("totalPages の計算が正しい（切り上げ）", () => {
    const data = [{ id: 1 }];
    const params = { page: 1, limit: 10, skip: 0 };
    const result = buildPaginatedResponse(data, 15, params);

    expect(result.pagination.totalPages).toBe(2);
  });

  it("空データの場合", () => {
    const params = { page: 1, limit: 20, skip: 0 };
    const result = buildPaginatedResponse([], 0, params);

    expect(result.data).toEqual([]);
    expect(result.pagination.total).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
  });
});
