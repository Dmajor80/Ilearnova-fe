import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import DeleteDialog from "../DeleteDialog";

afterEach(cleanup);

const CHECK = {
  can_delete: true,
  reason: null,
  blockers: {},
  related: { students: 3, "school roles": 4, "attendance records": 12 },
  note: "User accounts are kept; they lose their role in this school.",
};

const conflict = (reason, blockers = { payments: 2 }) => {
  const err = new Error(reason);
  err.status = 409;
  err.data = { error: reason, blockers };
  return err;
};

const renderDialog = (props = {}) =>
  render(
    <DeleteDialog
      open
      title="Delete Sunrise College permanently?"
      confirmText="Sunrise College"
      loadCheck={() => Promise.resolve(CHECK)}
      onDelete={vi.fn().mockResolvedValue({})}
      onClose={vi.fn()}
      {...props}
    />
  );

const deleteButton = () => screen.getByRole("button", { name: "Delete permanently" });

describe("DeleteDialog", () => {
  it("shows a skeleton, then what will be removed and the note", async () => {
    let resolve;
    renderDialog({ loadCheck: () => new Promise((r) => { resolve = r; }) });
    expect(screen.getByRole("status", { name: "Checking what will be deleted" })).toBeTruthy();
    resolve(CHECK);
    const list = await screen.findByRole("list", { name: "What will be deleted" });
    expect(within(list).getByText("3 students")).toBeTruthy();
    expect(within(list).getByText("4 school roles")).toBeTruthy();
    expect(within(list).getByText("12 attendance records")).toBeTruthy();
    expect(screen.getByText(/User accounts are kept/)).toBeTruthy();
  });

  it("enables Delete only once the exact name is typed", async () => {
    const onDelete = vi.fn().mockResolvedValue({});
    const onDeleted = vi.fn();
    const onClose = vi.fn();
    renderDialog({ onDelete, onDeleted, onClose });
    const input = await screen.findByLabelText(/Type Sunrise College to confirm/);
    expect(deleteButton().disabled).toBe(true);
    fireEvent.change(input, { target: { value: "sunrise college" } });
    expect(deleteButton().disabled).toBe(true);
    fireEvent.change(input, { target: { value: "Sunrise Colleg" } });
    expect(deleteButton().disabled).toBe(true);
    fireEvent.click(deleteButton());
    expect(onDelete).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: "Sunrise College" } });
    expect(deleteButton().disabled).toBe(false);
    fireEvent.click(deleteButton());
    await waitFor(() => expect(onDeleted).toHaveBeenCalled());
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalled();
  });

  it("is blocked when the check says so, offering Deactivate instead", async () => {
    const onDeactivate = vi.fn().mockResolvedValue({});
    const onClose = vi.fn();
    renderDialog({
      loadCheck: () =>
        Promise.resolve({ ...CHECK, can_delete: false, reason: "This school has financial records (2 payments).", blockers: { payments: 2 } }),
      onDeactivate,
      onClose,
    });
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/financial records/);
    expect(screen.queryByLabelText(/to confirm/)).toBeNull();
    expect(deleteButton().disabled).toBe(true);
    fireEvent.click(within(alert).getByRole("button", { name: "Deactivate instead" }));
    await waitFor(() => expect(onDeactivate).toHaveBeenCalled());
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("shows a 409 refusal inline when the delete itself is refused", async () => {
    const onDeleted = vi.fn();
    renderDialog({
      onDelete: vi.fn().mockRejectedValue(conflict("This school has financial records (2 payments). Deactivate it instead.")),
      onDeactivate: vi.fn(),
      onDeleted,
    });
    fireEvent.change(await screen.findByLabelText(/to confirm/), { target: { value: "Sunrise College" } });
    fireEvent.click(deleteButton());
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toMatch(/financial records/);
    expect(within(alert).getByText("2 payments")).toBeTruthy();
    expect(within(alert).getByRole("button", { name: "Deactivate instead" })).toBeTruthy();
    expect(deleteButton().disabled).toBe(true);
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it("uses singular labels for a count of one", async () => {
    renderDialog({
      loadCheck: () =>
        Promise.resolve({ ...CHECK, related: { "school roles": 1, classes: 1, "timetable entries": 1, admins: 1 } }),
    });
    const list = await screen.findByRole("list", { name: "What will be deleted" });
    expect(within(list).getByText("1 school role")).toBeTruthy();
    expect(within(list).getByText("1 class")).toBeTruthy();
    expect(within(list).getByText("1 timetable entry")).toBeTruthy();
    expect(within(list).getByText("1 admin")).toBeTruthy();
  });

  it("works without a check or typing gate (plans, codes)", async () => {
    const onDelete = vi.fn().mockResolvedValue({});
    render(<DeleteDialog open title="Delete Annual?" message="Schools will no longer see this plan." onDelete={onDelete} onClose={vi.fn()} />);
    expect(screen.getByText("Schools will no longer see this plan.")).toBeTruthy();
    fireEvent.click(deleteButton());
    await waitFor(() => expect(onDelete).toHaveBeenCalled());
  });
});
