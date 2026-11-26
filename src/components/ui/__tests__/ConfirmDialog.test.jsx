import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import ConfirmDialog from "../ConfirmDialog";

afterEach(cleanup);

describe("ConfirmDialog", () => {
  it("is an alertdialog that focuses Cancel first for destructive actions", () => {
    render(<ConfirmDialog open title="Delete it?" message="Sure?" confirmLabel="Delete" variant="danger" onConfirm={vi.fn()} onClose={vi.fn()} />);
    const dialog = screen.getByRole("alertdialog", { name: "Delete it?" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(document.activeElement.textContent).toBe("Cancel");
    expect(screen.getByRole("button", { name: "Delete" }).className).toMatch(/bg-red-600/);
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<ConfirmDialog open title="Go?" onConfirm={vi.fn()} onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("traps Tab focus inside the dialog", () => {
    render(<ConfirmDialog open title="Go?" confirmLabel="Go" onConfirm={vi.fn()} onClose={vi.fn()} />);
    const go = screen.getByRole("button", { name: "Go" });
    const cancel = screen.getByRole("button", { name: "Cancel" });
    go.focus();
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Tab" });
    expect(document.activeElement).toBe(cancel);
    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(go);
  });

  it("shows a loading state while confirming, then closes", async () => {
    let resolve;
    const onConfirm = vi.fn(() => new Promise((r) => { resolve = r; }));
    const onClose = vi.fn();
    render(<ConfirmDialog open title="Go?" confirmLabel="Go" onConfirm={onConfirm} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Go" }).getAttribute("aria-busy")).toBe("true"));
    expect(screen.getByRole("button", { name: "Cancel" }).disabled).toBe(true);
    resolve();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("keeps the dialog open and shows the error when the action fails", async () => {
    const onClose = vi.fn();
    render(<ConfirmDialog open title="Go?" confirmLabel="Go" onConfirm={() => Promise.reject(new Error("Nope"))} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByText("Nope")).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();
  });
});
