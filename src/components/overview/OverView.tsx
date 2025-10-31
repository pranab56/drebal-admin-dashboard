"use client";

import {
  CreditCard,
  DollarSign,
  Layers,
  User
} from "lucide-react";
import IncomeRatioChart from './IncomeRatioChart';
import RecentUsersTable from './RecentUsersTable';
import StatsCard from './StatsCard';
import TicketsSellingChart from './TicketsSellingChart';

// Main Dashboard Component
export default function MainlandDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={User}
          title="Total User"
          value="1200"
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          icon={CreditCard}
          title="Total Sold Tickets"
          value="2.5K"
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          icon={Layers}
          title="Categories"
          value="12"
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          icon={DollarSign}
          title="Total Revenue"
          value="$12000.50"
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-full">
          <IncomeRatioChart />
        </div>
        <div className='h-full'>
          <TicketsSellingChart />
        </div>
      </div>

      {/* Recent Users Table */}
      <RecentUsersTable />
    </div>
  );
}