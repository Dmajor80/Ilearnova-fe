import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const SERIES = [
  { key: "users", label: "New users", color: "#2563eb" },
  { key: "organizations", label: "New schools", color: "#d97706" },
];

const shortDay = (iso) => {
  const date = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? String(iso) : date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-gray-900">{shortDay(label)}</p>
      {SERIES.map((s) => {
        const point = payload.find((p) => p.dataKey === s.key);
        return (
          <p key={s.key} className="flex items-center gap-2 text-gray-600">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
            {s.label}
            <span className="ml-auto pl-3 font-semibold tabular-nums text-gray-900">{point?.value ?? 0}</span>
          </p>
        );
      })}
    </div>
  );
}

/** Daily sign-ups for the last 30 days: users and schools on one axis. */
export default function SignupsChart({ data }) {
  const rows = (data || []).map((d) => ({ date: d.date, users: Number(d.users) || 0, organizations: Number(d.organizations) || 0 }));
  const totals = Object.fromEntries(SERIES.map((s) => [s.key, rows.reduce((sum, r) => sum + r[s.key], 0)]));
  const summary = `Sign-ups over the last 30 days: ${totals.users} new users and ${totals.organizations} new schools.`;

  return (
    <div>
      <ul className="mb-3 flex flex-wrap gap-4 text-sm" aria-label="Legend">
        {SERIES.map((s) => (
          <li key={s.key} className="flex items-center gap-2 text-gray-600">
            <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
            {s.label}
            <span className="font-semibold tabular-nums text-gray-900">{totals[s.key]}</span>
          </li>
        ))}
      </ul>
      <div role="img" aria-label={summary} className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
            <CartesianGrid stroke="#eef2f7" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={shortDay}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} width={40} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "3 3" }} />
            {SERIES.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
      <table>
        <caption>Daily sign-ups</caption>
        <thead>
          <tr><th scope="col">Date</th>{SERIES.map((s) => <th key={s.key} scope="col">{s.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.date}><td>{r.date}</td><td>{r.users}</td><td>{r.organizations}</td></tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
