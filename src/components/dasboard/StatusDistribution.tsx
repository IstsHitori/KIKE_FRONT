import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";

export function StatusDistribution() {
  const {
    percentajeOrdersPaid,
    percentajeOrdersPartial,
    percentajeOrdersPending,
  } = useDashboard();
  const data = [
    {
      name: "Pagadas",
      value: parseFloat(percentajeOrdersPaid.toFixed(2)),
      color: "#22c55e",
    },
    {
      name: "Parciales",
      value: parseFloat(percentajeOrdersPartial.toFixed(2)),
      color: "#f59e0b",
    },
    {
      name: "Pendientes",
      value: parseFloat(percentajeOrdersPending.toFixed(2)),
      color: "#ef4444",
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Órdenes</CardTitle>
        <CardDescription>Distribución de órdenes por estado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Porcentaje"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className=" grid grid-cols-3 gap-10">
            {data.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
