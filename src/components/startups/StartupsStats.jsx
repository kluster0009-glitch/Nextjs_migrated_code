import { Card, CardContent } from "@/components/ui/card";
import { Building2, DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function StartupsStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Startups</p>
              <p className="text-2xl font-bold text-neon-cyan">{stats.totalStartups}</p>
            </div>
            <Building2 className="w-8 h-8 text-neon-cyan/50" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Funding</p>
              <p className="text-2xl font-bold text-neon-purple">
                ${(stats.totalFunding / 1000000).toFixed(1)}M
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-neon-purple/50" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Growth</p>
              <p className="text-2xl font-bold text-green-500">
                +{stats.avgGrowth.toFixed(0)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500/50" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">New This Month</p>
              <p className="text-2xl font-bold text-neon-pink">{stats.newThisMonth}</p>
            </div>
            <Calendar className="w-8 h-8 text-neon-pink/50" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
