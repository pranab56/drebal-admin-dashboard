"use client";

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRangeSelectorProps {
  dateRange: string;
  setDateRange: (range: string) => void;
}

const DateRangeSelector = ({ dateRange, setDateRange }: DateRangeSelectorProps) => {
  const dateRanges = [
    { label: '17 Oct 2024 - 21 Oct 2024', value: '17 Oct 2024 - 21 Oct 2024' },
    { label: '1 Oct 2024 - 31 Oct 2024', value: '1 Oct 2024 - 31 Oct 2024' },
    { label: '1 Sep 2024 - 30 Sep 2024', value: '1 Sep 2024 - 30 Sep 2024' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white">
          <Calendar className="w-4 h-4 mr-2 text-red-500" />
          {dateRange}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dateRanges.map((range) => (
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