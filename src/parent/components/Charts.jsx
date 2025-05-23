import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Label,
} from "recharts";

const barData = [
  { label: "Math", value: 90 },
  { label: "Eng", value: 70 },
  { label: "Bio", value: 90 },
  { label: "Civic", value: 70 },
  { label: "Chem", value: 50 },
  { label: "Phy", value: 95 },
  { label: "Geo", value: 80 },
];

const barColors = barData.map((d) =>
  d.value >= 80 ? "#4ade80" : d.value >= 60 ? "#fde047" : "#f87171"
);

export const PieGraph = () => {
  return (
    <div>
      <ResponsiveContainer width={96} height={96}>
        <PieChart>
          <Pie
            data={[
              { name: "Completed", value: 9 },
              { name: "Remaining", value: 2 },
            ]}
            cx="50%"
            cy="50%"
            innerRadius={32}
            outerRadius={48}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
          >
            <Cell fill="#1e40af" />
            <Cell fill="#e5e7eb" />
            <Label
              value="9/11"
              position="center"
              fontSize="20"
              fill="#1e40af"
              fontWeight="bold"
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}


export const BarGraph = () => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData}>
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value">
            {barData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={barColors[idx]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}