
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { MetricData } from "@/context/MetricsContext";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface MetricCardProps {
  metric: MetricData;
  className?: string;
}

export default function MetricCard({ metric, className }: MetricCardProps) {
  const {
    title,
    value,
    target,
    change,
    isPositive,
    reachedTarget,
    isLowerBetter
  } = metric;

  // Determine the color based on whether the target is reached and the direction of the metric
  let badgeColor = "";
  let badgeBg = "";
  let progressColor = "";
  
  if (reachedTarget) {
    badgeColor = "text-green-400";
    badgeBg = "bg-green-900/20 border-green-500/20";
    progressColor = "bg-green-500";
  } else {
    badgeColor = "text-red-400";
    badgeBg = "bg-red-900/20 border-red-500/20";
    progressColor = "bg-red-500";
  }

  // Adjust if lower values are better
  if (isLowerBetter) {
    if (isPositive) {
      badgeColor = "text-green-400";
      badgeBg = "bg-green-900/20 border-green-500/20";
    } else {
      badgeColor = "text-red-400";
      badgeBg = "bg-red-900/20 border-red-500/20";
    }
  }

  // Calculate the progress percentage based on value and target
  const targetValue = Number(target) || 100;
  const currentValue = Number(value) || 0;
  const progressPercentage = Math.min(Math.max((currentValue / targetValue) * 100, 0), 100);

  return (
    <Card className={cn("overflow-hidden border-none", className)}>
      <div className={cn("h-1", progressColor)}></div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-sm font-medium text-gray-300 line-clamp-1" title={title}>
            {title}
          </h3>
          <div className={cn("flex items-center gap-1 text-xs rounded-full px-2 py-0.5 border", badgeBg)}>
            {isPositive ? (
              <ArrowUpIcon className={cn("h-3 w-3", isLowerBetter ? "text-red-400" : "text-green-400")} />
            ) : (
              <ArrowDownIcon className={cn("h-3 w-3", isLowerBetter ? "text-green-400" : "text-red-400")} />
            )}
            <span className={cn(isLowerBetter ? (isPositive ? "text-red-400" : "text-green-400") : (isPositive ? "text-green-400" : "text-red-400"))}>
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-2xl font-bold text-white">{value}</p>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>0</span>
              <span>الهدف: {target}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full", progressColor)}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
