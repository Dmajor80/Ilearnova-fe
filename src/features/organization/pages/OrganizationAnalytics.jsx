import React, { useMemo } from "react";
import useOrganizationAnalytics from "@/hooks/organization/useOrganizationAnalytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { RefreshCw, TrendingUp } from "lucide-react";

const chartDefinitions = [
  { key: "student_performance", title: "Student performance", color: "#4f46e5", format: "percent" },
  { key: "attendance", title: "Attendance", color: "#059669", format: "percent" },
  { key: "fee_collection", title: "Fee collection", color: "#2563eb", format: "number" }
];

const formatNumber = (value) => new Intl.NumberFormat().format(value);

function normalizeChart(chart) {
  if (!Array.isArray(chart?.data) || chart.data.length === 0) return [];

  return chart.data.reduce((rows, value, index) => {
    const numericValue = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(numericValue)) return rows;

    rows.push({
      period: chart.labels?.[index] || `Period ${index + 1}`,
      value: numericValue
    });
    return rows;
  }, []);
}

function AnalyticsChart({ definition, chart }) {
  const data = useMemo(() => normalizeChart(chart), [chart]);
  const title = chart?.title || definition.title;

  return (
    <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="mt-1 text-sm text-gray-500">
            {data.length ? `${data.length} data points` : "No data available"}
          </p>
        </div>
        <TrendingUp className="h-5 w-5 shrink-0 text-gray-400" />
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg bg-gray-50 px-4 text-center text-sm text-gray-500">
          There is no {definition.title.toLowerCase()} data to display yet.
        </div>
      ) : (
        <div className="h-64 w-full" role="img" aria-label={`${title} bar chart`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={formatNumber}
                width={56}
              />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                formatter={(value) => [
                  definition.format === "percent" ? `${formatNumber(value)}%` : formatNumber(value),
                  title
                ]}
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "#e5e7eb",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
                }}
              />
              <Bar dataKey="value" fill={definition.color} radius={[5, 5, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

const OrganizationAnalytics = () => {
  const analytics = useOrganizationAnalytics();
  const response = analytics.performance;
  const data = response?.performance_chart ?? response?.data ?? response;
  const charts = data?.charts && typeof data.charts === "object" ? data.charts : {};
  const availableCharts = chartDefinitions.filter(({ key }) => charts[key]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Analytics dashboard</h3>
          <p className="mt-1 text-sm text-gray-600">School performance and attendance trends.</p>
          {data?.period && (
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500">
              Reporting period: {data.period}
            </p>
          )}
        </div>
        <button
          onClick={() => analytics.refreshData(true)}
          disabled={analytics.loading}
          aria-label="Refresh analytics"
          className="rounded-lg border p-3 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${analytics.loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {analytics.error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {analytics.error.message}
        </p>
      )}

      {analytics.loading && !response ? (
        <p className="rounded-xl bg-white py-10 text-center text-gray-500 shadow-sm">Loading analytics…</p>
      ) : availableCharts.length ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {availableCharts.map((definition) => (
            <AnalyticsChart
              key={definition.key}
              definition={definition}
              chart={charts[definition.key]}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center shadow-sm">
          <TrendingUp className="mx-auto h-8 w-8 text-gray-400" />
          <h4 className="mt-3 font-semibold text-gray-900">No analytics to display</h4>
          <p className="mt-1 text-sm text-gray-500">
            The performance endpoint has not returned any chart data.
          </p>
        </div>
      )}

      {analytics.lastUpdated && (
        <p className="text-right text-xs text-gray-500">
          Updated {analytics.lastUpdated.toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default OrganizationAnalytics;
