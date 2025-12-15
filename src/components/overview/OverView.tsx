"use client";

import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import {
  CreditCard,
  DollarSign,
  Layers,
  User
} from "lucide-react";
import { useEffect, useState } from "react"; // Added useEffect
import toast from 'react-hot-toast';
import { useFeeCreateAndUpdateMutation, useGetFeeQuery } from '../../features/fee/feeApi';
import { useGetAllOverviewQuery } from '../../features/overview/overview';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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

  const { data, isLoading, isError } = useGetAllOverviewQuery({
    year: selectedYear,
    month: selectedMonth || undefined
  });

  const [feeCreateAndUpdate, { isLoading: feeIsLoading }] = useFeeCreateAndUpdateMutation();
  const { data: feeData, isLoading: feeIsLoadingData, refetch: refetchFee } = useGetFeeQuery({});

  // Initialize with null, then update with API data
  const [feeValue, setFeeValue] = useState<string | null>(null);
  const [isLocalUpdate, setIsLocalUpdate] = useState(false);

  console.log(isLocalUpdate);

  // Update feeValue when feeData changes (on initial load or refetch)
  useEffect(() => {
    if (feeData?.data?.mainlandFee !== undefined) {
      setFeeValue(feeData.data.mainlandFee.toString());
      setIsLocalUpdate(false); // Reset local update flag
    }
  }, [feeData]);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleFee = async () => {
    if (!feeValue) return;

    try {
      const response = await feeCreateAndUpdate({ mainLandFee: parseInt(feeValue) }).unwrap();
      console.log(response);
      toast.success(response.message || 'Fee updated successfully.');

      // Refetch the fee data to ensure we have the latest from server
      refetchFee();
      setIsLocalUpdate(true); // Mark as locally updated
    } catch (error) {
      const err = error as FetchBaseQueryError & {
        data?: { message?: string };
      };
      toast.error(err?.data?.message || 'Failed to update fee. Please try again.');
    }
  }

  const handleFeeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFeeValue(value);
  }

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

  // Determine what to show in the input
  const getDisplayValue = () => {
    if (feeIsLoadingData) return 'Loading...';
    if (feeValue !== null) return feeValue;
    return ''; // Or a default placeholder
  };

  return (
    <div className="space-y-6">


      <div className='flex items-center justify-between'>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <div className="max-w-4xl">
          <h1 className="text-base text-gray-900 mb-1">
            Mainland Fee
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                value={getDisplayValue()}
                onChange={handleFeeInputChange}
                className="h-10 text-4xl font-normal pr-16 border-2 border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0"
                disabled={feeIsLoadingData}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-base text-gray-900 pointer-events-none">
                %
              </span>
            </div>

            <Button
              onClick={handleFee}
              disabled={feeIsLoading || feeIsLoadingData || !feeValue}
              className="h-10 px-8 text-base font-semibold bg-green-700 hover:bg-green-800 text-white rounded-lg"
            >
              {feeIsLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </div>

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