
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  trend?: number;
  icon?: React.ReactNode;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  trend,
  icon,
  className,
}) => {
  return (
    <Card className={`${className} overflow-hidden`}>
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-500 dark:text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend !== undefined) && (
          <div className="mt-2 flex items-center text-xs">
            {trend !== undefined && (
              <span
                className={`mr-1 flex items-center ${
                  trend > 0
                    ? 'text-green-500'
                    : trend < 0
                    ? 'text-red-500'
                    : 'text-gray-500'
                }`}
              >
                {trend > 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : trend < 0 ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : null}
                {Math.abs(trend)}%
              </span>
            )}
            {description && (
              <span className="text-gray-500 dark:text-gray-400">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
