import {
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", revenue: 12800 },
  { month: "Feb", revenue: 15400 },
  { month: "Mar", revenue: 13900 },
  { month: "Apr", revenue: 17200 },
  { month: "May", revenue: 16100 },
  { month: "Jun", revenue: 19400 },
];

export default function ManagerRevenue() {
  return (
    <>
      <div className="d-flex align-items-baseline justify-content-between gap-3 mb-3">
        <div>
          <p className="small fw-bold text-secondary mb-1">
            SAMPLE DATA
          </p>
          <h2 id="revenue-title" className="h5 mb-0">
            Monthly revenue
          </h2>
        </div>
        <span className="small text-secondary">Jan – Jun</span>
      </div>
      <div
        className="w-100"
        role="img"
        aria-label="Sample monthly revenue from January to June, rising overall from $12,800 to $19,400"
        style={{ height: 280 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 12, bottom: 0, left: 4 }}
          >
            <CartesianGrid
              stroke="#e9eee8"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#788178", fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#788178", fontSize: 12 }}
              tickFormatter={(value: number) => `$${value / 1000}k`}
              width={55}
            />
            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString("en-US")}`,
                "Revenue",
              ]}
              contentStyle={{
                border: "1px solid #e1e8df",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#788178" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#66866b"
              strokeWidth={3}
              dot={{ fill: "#66866b", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
