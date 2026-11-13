import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http } from "@/api/baseClient";
import DirectMessages from "../DirectMessages";

vi.mock("@/api/baseClient", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

const contact = {
  id: "teacher-1",
  name: "Ms. Teacher",
  roles: ["teacher"]
};
const studentContact = {
  id: "student-2",
  name: "Another student",
  roles: ["student"]
};

beforeEach(() => {
  vi.clearAllMocks();
  http.get.mockImplementation((path) => {
    if (path === "/api/messages/contacts/") {
      return Promise.resolve({ success: true, data: [contact, studentContact] });
    }
    if (path === "/api/messages/conversations/") {
      return Promise.resolve({ success: true, data: [] });
    }
    if (String(path).includes("/api/messages/conversations/teacher-1/")) {
      return Promise.resolve({ success: true, data: { messages: [] } });
    }
    return Promise.reject(new Error(`Unexpected request: ${path}`));
  });
  http.post.mockResolvedValue({
    success: true,
    data: { id: "message-1", body: "Please call me." }
  });
});

afterEach(cleanup);

describe("DirectMessages", () => {
  it("uses the contact allowlist and sends through the documented message endpoint", async () => {
    render(<DirectMessages />);

    fireEvent.click(screen.getByRole("button", { name: "New message" }));
    const recipient = await screen.findByRole("button", { name: /Ms\. Teacher teacher/i });
    fireEvent.click(recipient);

    fireEvent.change(await screen.findByLabelText("Message"), {
      target: { value: "Please call me." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(http.post).toHaveBeenCalledWith(
        "/api/messages/",
        { recipient_id: "teacher-1", body: "Please call me." },
        { auth: true }
      );
    });
    expect(http.get).toHaveBeenCalledWith("/api/messages/contacts/", {
      auth: true,
      params: { search: "" }
    });
  });

  it("limits parent and student recipients to teachers and school administrators", async () => {
    render(<DirectMessages restrictRecipients />);

    fireEvent.click(screen.getByRole("button", { name: "New message" }));
    expect(await screen.findByRole("button", { name: /Ms\. Teacher teacher/i })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /Another student/i })).toBeNull();
  });
});
