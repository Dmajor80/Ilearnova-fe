// Bug found clicking through: rename the default CA/Exam rows to "CA 1" and
// "CA 2", add "Exam", save -> 400 'Component key "exam" is repeated.' The
// renamed rows kept their old hidden keys (ca, exam), so "CA 2" was still
// keyed "exam" and clashed with the new Exam row.
import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ComponentsEditor from "../ComponentsEditor";
import { toEditable, toPayload } from "../resultsUtils";

let latest;
function Harness({ initial }) {
  const [components, setComponents] = useState(toEditable(initial));
  latest = components;
  return <ComponentsEditor components={components} onChange={setComponents} />;
}

afterEach(cleanup);

describe("ComponentsEditor keys", () => {
  it("a renamed component gets a key from its new name, so keys never clash", () => {
    render(
      <Harness
        initial={[
          { key: "ca", label: "CA", max: "40.00" },
          { key: "exam", label: "Exam", max: "60.00" },
        ]}
      />
    );
    fireEvent.change(screen.getByLabelText("Component 1 name"), { target: { value: "CA 1" } });
    fireEvent.change(screen.getByLabelText("Component 1 maximum"), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText("Component 2 name"), { target: { value: "CA 2" } });
    fireEvent.change(screen.getByLabelText("Component 2 maximum"), { target: { value: "50" } });
    fireEvent.click(screen.getByRole("button", { name: "Add component" }));
    fireEvent.change(screen.getByLabelText("Component 3 name"), { target: { value: "Exam" } });
    fireEvent.change(screen.getByLabelText("Component 3 maximum"), { target: { value: "100" } });

    expect(toPayload(latest)).toEqual([
      { label: "CA 1", max: 50 },
      { label: "CA 2", max: 50 },
      { label: "Exam", max: 100 },
    ]);
  });

  it("changing only the maximum keeps the key, so saved scores still line up", () => {
    render(<Harness initial={[{ key: "ca", label: "CA", max: "40.00" }, { key: "exam", label: "Exam", max: "60.00" }]} />);
    fireEvent.change(screen.getByLabelText("Component 2 maximum"), { target: { value: "160" } });
    expect(toPayload(latest)).toEqual([
      { key: "ca", label: "CA", max: 40 },
      { key: "exam", label: "Exam", max: 160 },
    ]);
  });
});
