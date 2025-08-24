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
   CartesianGrid,
   Legend
} from "recharts";

const data = [
  { subject: 'Maths', score: 85 },
  { subject: 'Eng', score: 90 },
  { subject: 'Bio', score: 65 },
  { subject: 'Phy', score: 70 },
  { subject: 'Chem', score: 88 },
  { subject: 'Civic', score: 68 },
  { subject: 'Yor', score: 45 },
  { subject: 'Agric', score: 48 },
  { subject: 'Art', score: 95 },
  { subject: 'Geo', score: 78 },
];

const getBarColor = (score) => {
  if (score < 50) return '#ef4444';
  if (score < 80) return '#facc15';
  return '#22c55e';
};

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
    <>
      <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value} / 100`} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
<h4 className="text-center capitalize font-medium">subject</h4>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#facc15] rounded-full"></span>
            <span>Between 60% - 80%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#22c55e] rounded-full"></span>
            <span>Above 80%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#ef4444] rounded-full"></span>
            <span>Below 50%</span>
          </div>
        </div>
    </>
  )
}