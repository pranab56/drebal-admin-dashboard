"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  ranges?: { label: string; value: string }[];
}

const DateRangeSelector = ({
  dateRange,
  setDateRange,
  ranges = [
    { label: '17 Oct 2024 - 21 Oct 2024', value: '17 Oct 2024 - 21 Oct 2024' },
    { label: '24 Oct 2024 - 28 Oct 2024', value: '24 Oct 2024 - 28 Oct 2024' }
  ]
}: DateRangeSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {dateRange}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {ranges.map((range) => (
          <DropdownMenuItem
            key={range.value}
            onClick={() => setDateRange(range.value)}
          >
            {range.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateRangeSelector;