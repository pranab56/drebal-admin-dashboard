"use client";

import {
  CreditCard,
  DollarSign,
  Layers,
  User
} from "lucide-react";
import { useState } from "react";
import { useGetAllOverviewQuery } from '../../features/overview/overview';
import IncomeRatioChart from './IncomeRatioChart';
import RecentUsersTable from './RecentUsersTable';
import StatsCard from './StatsCard';
import TicketsSellingChart from './TicketsSellingChart';

// Main Dashboard Component
export default function MainlandDashboard() {
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { data, isLoading, isError, refetch } = useGetAllOverviewQuery({
    year: selectedYear,
    month: selectedMonth || undefined
  });

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Error loading dashboard data</div>
      </div>
    );
  }

  const overview = data?.data?.overview;
  const incomeRatio = data?.data?.incomeRatio;
  const ticketsSelling = data?.data?.ticketsSelling;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={User}
          title="Total User"
          value={overview?.totalUser?.toString() || "0"}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          icon={CreditCard}
          title="Total Sold Tickets"
          value={overview?.totalSoldTickets?.toString() || "0"}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          icon={Layers}
          title="Categories"
          value={overview?.categories?.toString() || "0"}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${overview?.totalRevenue?.toLocaleString() || "0"}`}
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <IncomeRatioChart
            incomeRatioData={incomeRatio}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>
        <div className='h-full'>
          <TicketsSellingChart
            ticketsData={ticketsSelling}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>

      {/* Recent Users Table */}
      <RecentUsersTable />
    </div>
  );
}