import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SubjectFormModal, { NO_CLASS } from "../SubjectFormModal";

const classes = [
  { id: "c1", name: "JSS1" },
  { id: "c2", name: "JSS2" },
];
const teachers = [{ membership_id: "t-role-1", full_name: "Mr Bello" }];

afterEach(cleanup);

describe("SubjectFormModal", () => {
  it("offers a 'No class' option and saves the subject without a class", () => {
    const onSave = vi.fn();
    render(<SubjectFormModal classes={classes} teachers={teachers} onSave={onSave} onClose={() => {}} />);

    const classSelect = screen.getByLabelText("Class");
    expect(screen.getByRole("option", { name: "No class (students are enrolled individually)" })).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Subject name"), { target: { value: "French" } });
    fireEvent.change(classSelect, { target: { value: NO_CLASS } });
    expect(screen.getByText(/enrol students individually/i)).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Teacher"), { target: { value: "t-role-1" } });
    fireEvent.click(screen.getByRole("button", { name: "Save subject" }));

    expect(onSave).toHaveBeenCalledWith({
      name: "French",
      classname: null,
      teacher_role: "t-role-1",
      description: "",
    });
  });

  it("saves a class subject with its class id", () => {
    const onSave = vi.fn();
    render(<SubjectFormModal classes={classes} teachers={teachers} onSave={onSave} onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText("Subject name"), { target: { value: "Maths" } });
    fireEvent.change(screen.getByLabelText("Class"), { target: { value: "c2" } });
    fireEvent.click(screen.getByRole("button", { name: "Save subject" }));

    expect(onSave).toHaveBeenCalledWith({ name: "Maths", classname: "c2", teacher_role: null, description: "" });
  });

  it("requires a class choice before saving", () => {
    const onSave = vi.fn();
    render(<SubjectFormModal classes={classes} onSave={onSave} onClose={() => {}} />);
    fireEvent.change(screen.getByLabelText("Subject name"), { target: { value: "Maths" } });
    fireEvent.click(screen.getByRole("button", { name: "Save subject" }));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole("alert").textContent).toMatch(/choose a class/i);
  });

  it("opens an existing classless subject with 'No class' selected", () => {
    render(
      <SubjectFormModal
        subject={{ id: "s1", name: "French", classname: null, teacher_role: null, description: "" }}
        classes={classes}
        onSave={() => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByRole("heading", { name: "Edit subject" })).toBeTruthy();
    expect(screen.getByLabelText("Class").value).toBe(NO_CLASS);
    expect(screen.getByLabelText("Subject name").value).toBe("French");
  });

  it("shows the server's error", () => {
    render(<SubjectFormModal classes={classes} error="name: There is already a subject without a class with this name." onSave={() => {}} onClose={() => {}} />);
    expect(screen.getByRole("alert").textContent).toMatch(/already a subject/);
  });
});
