// Every API response used to be printed to the browser console
// (baseClient logged "url:" and "response:" for each request).
import { afterEach, describe, expect, it, vi } from "vitest";
import { http } from "../baseClient";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("baseClient", () => {
  it("doesn't log server responses to the console", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true, data: { secret: "student marks" } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      )
    );
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const debug = vi.spyOn(console, "debug").mockImplementation(() => {});
    await http.get("/api/anything/", { auth: false });
    expect(log).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
    expect(debug).not.toHaveBeenCalled();
  });
});
