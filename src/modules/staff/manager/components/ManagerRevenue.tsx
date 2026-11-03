import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api, type ApiResponse } from "@/lib/api";
import { Loading } from "@/components/Loading";
import styles from "./ManagerRevenue.module.css";

type RevenueTrend = {
  date: string;
  nonCancelledBookingValue: string;
};

type RevenuePoint = {
  month: string;
  revenue: number;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function getLastSixMonths(trends: RevenueTrend[]): RevenuePoint[] {
  const totals = new Map<string, number>();
  for (const trend of trends) {
    const month = trend.date.slice(0, 7);
    totals.set(
      month,
      (totals.get(month) ?? 0) + Number(trend.nonCancelledBookingValue),
    );
  }

  const today = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      revenue: totals.get(key) ?? 0,
    };
  });
}

export default function ManagerRevenue() {
  const [data, setData] = useState<RevenuePoint[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    api
      .get<ApiResponse<RevenueTrend[]>>("/stats/trends/created", {
        signal: controller.signal,
      })
      .then(({ data: response }) => {
        if (!response.success || !Array.isArray(response.data)) {
          throw new Error("Revenue data response was invalid");
        }
        setData(getLastSixMonths(response.data));
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Revenue data could not be loaded.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const period = data.length
    ? `${data[0].month} – ${data[data.length - 1].month}`
    : "";
  const total = data.reduce((sum, point) => sum + point.revenue, 0);

  return (
    <section className={styles.revenue} aria-labelledby="revenue-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Performance</p>
          <h2 id="revenue-title">Monthly revenue</h2>
        </div>
        {!isLoading && !error && (
          <p className={styles.period}>
            {period}
            <strong>{currency.format(total)}</strong>
          </p>
        )}
      </header>

      {isLoading ? (
        <Loading className={styles.loading} label="Loading revenue" />
      ) : error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : (
        <div
          className={styles.chart}
          role="img"
          aria-label={`Monthly revenue for the last six months, ${data.map(({ month, revenue }) => `${month}: ${currency.format(revenue)}`).join(", ")}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
              <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
                width={48}
              />
              <Tooltip
                formatter={(value) => [currency.format(Number(value)), "Revenue"]}
                contentStyle={{
                  border: "1px solid var(--line)",
                  borderRadius: "0.5rem",
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--ink)",
                }}
                labelStyle={{ color: "var(--ink-muted)" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--accent)"
                strokeWidth={2.5}
                dot={{ fill: "var(--accent)", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
