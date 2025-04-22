
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
  let color = "";
  let bgColor = "";
  
  if (reachedTarget) {
    color = "text-success";
    bgColor = "bg-success-light";
  } else {
    color = "text-danger";
    bgColor = "bg-error-light";
  }

  // Adjust if lower values are better
  if (isLowerBetter) {
    isPositive ? color = "text-success" : color = "text-danger";
    isPositive ? bgColor = "bg-success-light" : bgColor = "bg-error-light";
  }

  return (
    <Card className={cn("overflow-hidden border border-border/50", className)}>
      <div className={cn("h-1", reachedTarget ? "bg-success" : "bg-danger")}></div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-muted-foreground line-clamp-1" title={title}>
            {title}
          </h3>
          <div className={cn("flex items-center gap-1 text-xs rounded-full px-2 py-0.5", bgColor)}>
            {isPositive ? (
              <ArrowUpIcon className={cn("h-3 w-3", isLowerBetter ? "text-danger" : "text-success")} />
            ) : (
              <ArrowDownIcon className={cn("h-3 w-3", isLowerBetter ? "text-success" : "text-danger")} />
            )}
            <span className={cn(isLowerBetter ? (isPositive ? "text-danger" : "text-success") : (isPositive ? "text-success" : "text-danger"))}>
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">
            الهدف: {target}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
