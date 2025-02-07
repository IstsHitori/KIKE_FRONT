import { Overview } from "@/components/dasboard/Overview";
import { RevenueChart } from "@/components/dasboard/RevenueCharts";
import { ActivityList } from "@/components/dasboard/ActivityList";
import { StatusDistribution } from "@/components/dasboard/StatusDistribution";
import { StockAlerts } from "@/components/dasboard/StockAlerts";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export default function DashBoard() {
  return (
    <div className="flex flex-col gap-6 max-h-[1000px] overflow-y-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsContent value="general" className="space-y-6">
          <Overview />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-full lg:col-span-4">
              <RevenueChart />
            </div>
            <div className="col-span-full lg:col-span-3">
              <StatusDistribution />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <StockAlerts />
            <ActivityList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
