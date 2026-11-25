import { describe, expect, it } from "vitest";
import { bannerFor, naira, pickStatus, planLength } from "../subscriptionUtils";

const row = (state, extra = {}) => ({
  organization_id: "org-1",
  organization_name: "Sunrise College",
  is_admin: true,
  state,
  expires_at: "2027-03-31T00:00:00Z",
  grace_ends_at: "2027-04-03T00:00:00Z",
  locks_at: "2027-04-10T00:00:00Z",
  days_left: 5,
  ...extra,
});

describe("pickStatus", () => {
  it("prefers the selected school, else the most restricted", () => {
    const rows = [row("active", { organization_id: "a" }), row("locked", { organization_id: "b" })];
    expect(pickStatus(rows).organization_id).toBe("b");
    expect(pickStatus(rows, "a").organization_id).toBe("a");
    expect(pickStatus([])).toBeNull();
  });
});

describe("bannerFor", () => {
  it("reminds admins only while the subscription is ending", () => {
    expect(bannerFor(row("expiring")).text).toMatch(/ends in 5 days/);
    expect(bannerFor(row("expiring", { days_left: 1 })).text).toMatch(/ends tomorrow/);
    expect(bannerFor(row("expiring", { is_admin: false }))).toBeNull();
    expect(bannerFor(row("active"))).toBeNull();
    expect(bannerFor(row("unmanaged"))).toBeNull();
  });

  it("tells teachers and students the school is read-only", () => {
    for (const state of ["read_only", "locked"]) {
      const banner = bannerFor(row(state, { is_admin: false }));
      expect(banner.text).toMatch(/read-only for now/);
      expect(banner.canRenew).toBe(false);
    }
  });

  it("asks admins to renew once it has lapsed", () => {
    expect(bannerFor(row("grace"))).toMatchObject({ tone: "warning", canRenew: true });
    expect(bannerFor(row("locked"))).toMatchObject({ tone: "danger", canRenew: true });
  });
});

describe("formatting", () => {
  it("formats naira and plan lengths", () => {
    expect(naira("120000.00")).toBe("₦120,000");
    expect(planLength(365)).toBe("1 year");
    expect(planLength(120)).toBe("4 months");
    expect(planLength(null)).toBe("No end date");
  });
});
