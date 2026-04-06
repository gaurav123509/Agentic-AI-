import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const pieColors = ["#ef6c57", "#f6b93b", "#0f766e"];

const tooltipStyle = {
  borderRadius: "18px",
  border: "1px solid rgba(22, 35, 54, 0.08)",
  backgroundColor: "rgba(255,255,255,0.96)",
  boxShadow: "0 18px 34px rgba(22, 35, 54, 0.08)",
};

const PriorityChart = ({ chartData }) => {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="card-surface p-5">
        <h3 className="font-heading text-xl font-bold text-ink">Priority mix</h3>
        <p className="mt-2 text-sm text-ink/65">A clean snapshot of incoming urgency levels.</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={chartData}
                dataKey="count"
                innerRadius={56}
                outerRadius={94}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell fill={pieColors[index % pieColors.length]} key={entry.name} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-surface p-5">
        <h3 className="font-heading text-xl font-bold text-ink">Volume by priority</h3>
        <p className="mt-2 text-sm text-ink/65">Useful for quickly spotting workflow pressure.</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="rgba(22, 35, 54, 0.08)" vertical={false} />
              <XAxis axisLine={false} dataKey="name" tickLine={false} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#162336" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PriorityChart;
