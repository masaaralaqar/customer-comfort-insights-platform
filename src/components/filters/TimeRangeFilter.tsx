
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimeRangeFilterProps {
  selectedTimeRange: string;
  onTimeRangeChange: (value: string) => void;
  selectedView: 'weekly' | 'yearly';
  onViewChange: (value: 'weekly' | 'yearly') => void;
  className?: string;
}

const TimeRangeFilter: React.FC<TimeRangeFilterProps> = ({
  selectedTimeRange,
  onTimeRangeChange,
  selectedView,
  onViewChange,
  className,
}) => {
  return (
    <div className={`flex flex-col sm:flex-row items-end justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Select value={selectedTimeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="اختر الفترة الزمنية" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-week">هذا الأسبوع</SelectItem>
            <SelectItem value="last-week">الأسبوع الماضي</SelectItem>
            <SelectItem value="last-month">الشهر الماضي</SelectItem>
            <SelectItem value="last-3-months">آخر 3 أشهر</SelectItem>
            <SelectItem value="this-year">هذه السنة</SelectItem>
            <SelectItem value="last-year">السنة الماضية</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs 
        value={selectedView} 
        onValueChange={(v) => onViewChange(v as 'weekly' | 'yearly')}
        className="w-auto"
      >
        <TabsList className="h-9">
          <TabsTrigger value="weekly" className="px-4">
            أسبوعي
          </TabsTrigger>
          <TabsTrigger value="yearly" className="px-4">
            سنوي
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TimeRangeFilter;
