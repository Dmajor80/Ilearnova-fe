import { afterEach, describe, expect, it, vi } from "vitest";
import { SUBSCRIPTION_BLOCKED_EVENT, http } from "../baseClient";

afterEach(() => vi.unstubAllGlobals());

describe("http client and lapsed subscriptions", () => {
  it("announces a 402 so the banner and dashboards can react", async () => {
    const body = { success: false, code: "SUBSCRIPTION_READ_ONLY", error: "This school's subscription has expired" };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(body), { status: 402, headers: { "content-type": "application/json" } })
      )
    );
    const heard = vi.fn();
    window.addEventListener(SUBSCRIPTION_BLOCKED_EVENT, heard);

    await expect(http.post("/api/results/school/grading-policy/", {}, { auth: false })).rejects.toMatchObject({
      status: 402,
    });
    expect(heard).toHaveBeenCalledTimes(1);
    expect(heard.mock.calls[0][0].detail.code).toBe("SUBSCRIPTION_READ_ONLY");
    window.removeEventListener(SUBSCRIPTION_BLOCKED_EVENT, heard);
  });
});
