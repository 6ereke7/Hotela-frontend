import { CartesianGrid, LineChart, ResponsiveContainer } from "recharts";
const data = [
  { month: "Jan", sales: 400 },
  { month: "Feb", sales: 300 },
  { month: "Mar", sales: 500 },
  { month: "Apr", sales: 280 },
  { month: "May", sales: 590 },
  { month: "Jun", sales: 430 },
];
export default function ManagerRevenue() {
  return (
    <div style={{ width: "100%", height: "300px" }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="1 1">
            <XAxis dataKey="month" />
          </CartesianGrid>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
