import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import StudentIdCard from "../StudentIdCard";

afterEach(cleanup);

const sunrise = { id: "org-1", name: "Sunrise College" };

describe("StudentIdCard", () => {
  it("shows the student's admission number and class for their school", () => {
    const user = {
      first_name: "Ada",
      last_name: "Obi",
      organizations: [
        { organization: sunrise, roles: [{ code: "student", is_verified: true, student_id: "SUN/2026/014", class_name: "JSS2A" }] },
      ],
    };
    render(<StudentIdCard user={user} />);
    const card = screen.getByRole("article", { name: "Sunrise College student ID card" });
    expect(card.textContent).toContain("Ada Obi");
    expect(card.textContent).toContain("SUN/2026/014");
    expect(card.textContent).toContain("JSS2A");
    expect(card.textContent).toContain("Verified");
  });

  it("shows nothing for teachers and parents", () => {
    const user = { first_name: "Musa", organizations: [{ organization: sunrise, roles: [{ code: "teacher" }] }] };
    const { container } = render(<StudentIdCard user={user} />);
    expect(container.textContent).toBe("");
  });
});
