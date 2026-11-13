import { describe, expect, it, vi } from "vitest";
import { getStudentListAcrossPages } from "./studentApiUtils";

describe("getStudentListAcrossPages", () => {
  it("collects each page until the API's next link is null", async () => {
    const fetchPage = vi.fn(async (page) => page === 1
      ? {
          count: 3,
          next: "https://api.example.test/items/?page=2",
          previous: null,
          results: [{ id: "one" }, { id: "two" }]
        }
      : {
          count: 3,
          next: null,
          previous: "https://api.example.test/items/?page=1",
          results: [{ id: "three" }]
        });

    await expect(getStudentListAcrossPages(fetchPage)).resolves.toEqual([
      { id: "one" },
      { id: "two" },
      { id: "three" }
    ]);
    expect(fetchPage.mock.calls.map(([page]) => page)).toEqual([1, 2]);
  });
});
