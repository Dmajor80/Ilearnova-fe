import { useState } from "react";
import { Download, FileCheck2, Upload, X } from "lucide-react";
import { http } from "@/api/baseClient";
import { apiErrorDetails, saveBlob } from "@/lib/apiHelpers";

const dash = (value) => value || "—";

// What differs between importing students and teachers: endpoint, wording,
// the columns the sheet takes and the extra preview columns.
const KINDS = {
  student: {
    base: "/api/admin/school/students",
    listKey: "students",
    columns: (
      <>
        Columns: <code>first_name</code>, <code>last_name</code>, <code>email</code> (required), and optionally{" "}
        <code>student_id</code> (admission no.), <code>class</code>, <code>phone_number</code>,{" "}
        <code>date_of_birth</code>, <code>address</code>.
      </>
    ),
    extra: [{ label: "Class", cell: (p) => dash(p.class) }],
  },
  teacher: {
    base: "/api/admin/school/teachers",
    listKey: "teachers",
    columns: (
      <>
        Columns: <code>first_name</code>, <code>last_name</code>, <code>email</code> (required), and optionally{" "}
        <code>phone_number</code>, <code>subjects</code> (e.g. <code>Mathematics@JSS1A; Physics@SS2B</code> — subjects
        that already exist), <code>class_teacher_of</code> (a class they lead), <code>qualification</code>,{" "}
        <code>specialization</code>.
      </>
    ),
    extra: [
      { label: "Subjects", cell: (p) => dash((p.subjects || []).join(", ")) },
      { label: "Class", cell: (p) => dash(p.class) },
    ],
  },
};

const upload = async (base, file, { dryRun, sendEmail }) => {
  const form = new FormData();
  form.append("file", file);
  form.append("dry_run", dryRun ? "true" : "false");
  form.append("send_email", sendEmail ? "true" : "false");
  const payload = await http.post(`${base}/import/`, form, { auth: true });
  return payload?.data ?? payload;
};

/**
 * Add many students or teachers (``kind``) from a spreadsheet. Step 1 checks
 * the file (nothing is created) and lists who would be added or what is
 * wrong, by sheet line; step 2 imports. All rows are added or none are.
 * ``base`` points it at other endpoints with the same shape (a permitted
 * teacher's ``/api/teacher/students``); ``note`` adds a line under the
 * columns (e.g. which classes rows may name).
 */
export default function ImportPeopleModal({ kind = "student", base, note, onClose, onImported }) {
  const config = { ...KINDS[kind], ...(base ? { base } : {}) };
  const plural = `${kind}s`;
  const Kind = kind[0].toUpperCase() + kind.slice(1);
  const titleId = `import-${plural}-title`;
  const [file, setFile] = useState(null);
  const [sendEmail, setSendEmail] = useState(true);
  const [preview, setPreview] = useState(null);
  const [problems, setProblems] = useState(null); // { messages, lines: [] }
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const rows = preview?.[config.listKey] || [];

  const pick = (event) => {
    setFile(event.target.files?.[0] || null);
    setPreview(null);
    setProblems(null);
    setDone(null);
  };

  const fail = (err) => {
    const { messages, rows } = apiErrorDetails(err);
    setProblems({
      messages: Object.keys(rows).length ? messages.filter((m) => m !== "Validation failed") : messages,
      // Data row 1 is line 2 of the sheet (line 1 holds the headers).
      lines: Object.entries(rows).map(([n, list]) => ({ line: Number(n) + 1, list })),
    });
  };

  const run = async (dryRun) => {
    setBusy(true);
    setProblems(null);
    try {
      const result = await upload(config.base, file, { dryRun, sendEmail });
      if (dryRun) setPreview(result);
      else {
        setDone(result);
        onImported?.(result);
      }
    } catch (err) {
      setPreview(null);
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const template = async (format) => {
    try {
      const blob = await http.get(`${config.base}/import-template/`, {
        auth: true,
        params: { file_format: format },
        responseType: "blob",
      });
      saveBlob(blob, `${plural}-template.${format}`);
    } catch (err) {
      fail(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby={titleId} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h3 id={titleId} className="text-lg font-semibold text-gray-900">Import {plural}</h3>
            <p className="mt-1 text-sm text-gray-600">{config.columns}</p>
            {note && <p className="mt-1 text-sm font-medium text-gray-700">{note}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </header>

        {done ? (
          <div className="mt-6 space-y-4">
            <p role="status" className="rounded-lg bg-green-50 p-4 text-green-800">
              Added {done.created} {kind}(s). They are verified and can sign in
              {sendEmail ? ` — each new ${kind} has been emailed how to set a password.` : "."}
            </p>
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">Done</button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="self-center text-gray-600">Download template:</span>
              <button type="button" onClick={() => template("xlsx")} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-50">
                <Download className="h-4 w-4" /> Excel (.xlsx)
              </button>
              <button type="button" onClick={() => template("csv")} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-50">
                <Download className="h-4 w-4" /> CSV (.csv)
              </button>
            </div>

            <label className="block rounded-lg border-2 border-dashed p-4 text-center text-sm text-gray-600 hover:bg-gray-50">
              <Upload className="mx-auto mb-1 h-5 w-5" />
              {file ? <span className="font-medium text-gray-900">{file.name}</span> : "Choose a .csv or .xlsx file"}
              <input type="file" accept=".csv,.xlsx" onChange={pick} className="sr-only" aria-label={`${Kind} sheet`} />
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="h-4 w-4" />
              Email new {plural} how to set their password
            </label>

            {problems && (
              <div role="alert" className="space-y-1 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                <p className="font-semibold">Nothing was added. Fix the sheet and check it again.</p>
                {problems.messages.map((m, i) => <p key={i}>{m}</p>)}
                {problems.lines.length > 0 && (
                  <ul className="list-disc pl-5">
                    {problems.lines.map(({ line, list }) => (
                      <li key={line}>Line {line}: {list.join("; ")}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {preview && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  Ready to add {rows.length} {kind}(s):
                </p>
                <div className="max-h-60 overflow-y-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="sticky top-0 bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left">Line</th>
                        <th scope="col" className="px-3 py-2 text-left">Name</th>
                        <th scope="col" className="px-3 py-2 text-left">Email</th>
                        {config.extra.map((c) => (
                          <th key={c.label} scope="col" className="px-3 py-2 text-left">{c.label}</th>
                        ))}
                        <th scope="col" className="px-3 py-2 text-left">Account</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rows.map((s) => (
                        <tr key={s.row}>
                          <td className="px-3 py-1.5 text-gray-500">{s.row + 1}</td>
                          <td className="px-3 py-1.5">{s.name}</td>
                          <td className="px-3 py-1.5 text-gray-600">{s.email}</td>
                          {config.extra.map((c) => (
                            <td key={c.label} className="px-3 py-1.5">{c.cell(s)}</td>
                          ))}
                          <td className="px-3 py-1.5">{s.account === "existing" ? "Already on iLearnova" : "New"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 hover:bg-gray-50">Cancel</button>
              {preview ? (
                <button type="button" disabled={busy} onClick={() => run(false)} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50">
                  <Upload className="h-4 w-4" /> Add {rows.length} {kind}(s)
                </button>
              ) : (
                <button type="button" disabled={busy || !file} onClick={() => run(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                  <FileCheck2 className="h-4 w-4" /> {busy ? "Checking…" : "Check file"}
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
