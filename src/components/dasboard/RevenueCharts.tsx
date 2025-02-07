import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateMonthlyRevenue, formatMoney } from "@/helpers";
import { useVeterinarieStore } from "@/stores/useVeterinarieStore";

export function RevenueChart() {
  //
  const orders = useVeterinarieStore((state) => state.orders);
  //
  const data = calculateMonthlyRevenue(orders);
  const totalRevenue = data.reduce((sum, month) => sum + month.total, 0);
  const averageRevenue = totalRevenue / data.length;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Ingresos Mensuales</CardTitle>
            <CardDescription>
              Análisis de ingresos en los últimos 6 meses
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium">
              Total: {formatMoney(totalRevenue)}
            </p>
            <p className="text-xs text-muted-foreground">
              Promedio: {formatMoney(averageRevenue)}/mes
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Total",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                className="stroke-primary"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
