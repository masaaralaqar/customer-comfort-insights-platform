
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface BarChartProps {
  title: string;
  data: any[];
  dataKey: string;
  categories?: string[];
  colors?: string[];
  className?: string;
  aspectRatio?: number;
  showLegend?: boolean;
}

const defaultColors = ['#3b82f6', '#4ade80', '#facc15', '#f87171', '#d946ef', '#0ea5e9'];

const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  dataKey,
  categories = ['value'],
  colors = defaultColors,
  className,
  aspectRatio = 2,
  showLegend = true,
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
            <RechartsBarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                <Bar
                  key={category}
                  dataKey={category}
                  fill={assignedColors[index]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;
