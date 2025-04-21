
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface LineChartProps {
  title: string;
  data: any[];
  dataKey: string;
  categories: string[];
  colors?: string[];
  className?: string;
  aspectRatio?: number;
  showLegend?: boolean;
  hideGrid?: boolean;
}

const defaultColors = ['#3b82f6', '#4ade80', '#facc15', '#f87171', '#d946ef', '#0ea5e9'];

const LineChart: React.FC<LineChartProps> = ({
  title,
  data,
  dataKey,
  categories,
  colors = defaultColors,
  className,
  aspectRatio = 2,
  showLegend = true,
  hideGrid = false,
}) => {
  const assignedColors = categories.map((_, index) => colors[index % colors.length]);

  return (
    <Card className={className}>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 10,
              }}
            >
              {!hideGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
              <XAxis 
                dataKey={dataKey} 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "6px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                }}
              />
              {showLegend && <Legend />}
              {categories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={assignedColors[index]}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LineChart;
