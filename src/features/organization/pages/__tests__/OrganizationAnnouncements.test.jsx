import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/api/baseClient", () => ({
  SUBSCRIPTION_BLOCKED_EVENT: "ilearnova:subscription-blocked",
  http: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), del: vi.fn() },
}));

import { http } from "@/api/baseClient";
import { TOAST_EVENT } from "@/lib/toast";
import OrganizationAnnouncements from "../OrganizationAnnouncements";

const ROW = {
  id: 7,
  title: "Mid-term break",
  message: "School closes on Friday.",
  created_at: "2026-11-20T10:00:00Z",
  author_name: "Ada Obi",
};

let toasts;
const onToast = (e) => toasts.push(e.detail.message);
beforeEach(() => {
  toasts = [];
  window.addEventListener(TOAST_EVENT, onToast);
});
afterEach(() => {
  window.removeEventListener(TOAST_EVENT, onToast);
  cleanup();
  vi.clearAllMocks();
});

const URL = "/api/admin/school/announcements/";

describe("OrganizationAnnouncements", () => {
  it("lists announcements after a skeleton", async () => {
    let resolve;
    http.get.mockReturnValue(new Promise((r) => (resolve = r)));
    render(<OrganizationAnnouncements />);
    expect(screen.getByRole("status", { name: "Loading announcements" })).toBeTruthy();
    resolve({ success: true, data: [ROW] });
    expect(await screen.findByText("Mid-term break")).toBeTruthy();
    expect(screen.getByText("School closes on Friday.")).toBeTruthy();
    expect(screen.getByText(/Ada Obi/)).toBeTruthy();
    expect(http.get).toHaveBeenCalledWith(URL, { auth: true });
  });

  it("explains the empty state", async () => {
    http.get.mockResolvedValue([]);
    render(<OrganizationAnnouncements />);
    expect(await screen.findByText("No announcements yet")).toBeTruthy();
  });

  it("posts a new announcement from a modal and shows it", async () => {
    http.get.mockResolvedValue([]);
    http.post.mockResolvedValue({ ...ROW, id: 8, title: "Sports day" });
    render(<OrganizationAnnouncements />);
    await screen.findByText("No announcements yet");
    fireEvent.click(screen.getByRole("button", { name: "New announcement" }));
    const dialog = screen.getByRole("dialog", { name: "New announcement" });
    const post = within(dialog).getByRole("button", { name: "Post announcement" });
    expect(post.disabled).toBe(true);
    fireEvent.change(within(dialog).getByLabelText(/^Title/), { target: { value: "Sports day" } });
    fireEvent.change(within(dialog).getByLabelText(/^Message/), { target: { value: "Wear house colours." } });
    fireEvent.click(post);
    await waitFor(() =>
      expect(http.post).toHaveBeenCalledWith(URL, { title: "Sports day", message: "Wear house colours." }, { auth: true })
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(await screen.findByText("Sports day")).toBeTruthy();
    expect(toasts).toContain("Announcement posted.");
  });

  it("keeps the modal open with the server's error", async () => {
    http.get.mockResolvedValue([]);
    const error = new Error("Bad Request");
    error.data = { error: "Title is too long." };
    http.post.mockRejectedValue(error);
    render(<OrganizationAnnouncements />);
    await screen.findByText("No announcements yet");
    fireEvent.click(screen.getByRole("button", { name: "New announcement" }));
    const dialog = screen.getByRole("dialog", { name: "New announcement" });
    fireEvent.change(within(dialog).getByLabelText(/^Title/), { target: { value: "x" } });
    fireEvent.change(within(dialog).getByLabelText(/^Message/), { target: { value: "y" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Post announcement" }));
    expect(await within(dialog).findByText("Title is too long.")).toBeTruthy();
  });

  it("deletes through the actions menu after confirming", async () => {
    http.get.mockResolvedValue([ROW]);
    http.del.mockResolvedValue(null);
    render(<OrganizationAnnouncements />);
    fireEvent.click(await screen.findByRole("button", { name: "Actions for Mid-term break" }));
    fireEvent.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: "Delete" }));
    expect(http.del).not.toHaveBeenCalled();
    fireEvent.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(http.del).toHaveBeenCalledWith(`${URL}7/`, { auth: true }));
    await waitFor(() => expect(screen.queryByText("Mid-term break")).toBeNull());
    expect(toasts).toContain("Announcement deleted.");
  });
});
