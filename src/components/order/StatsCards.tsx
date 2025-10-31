"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Clock, Package, PackageCheck, PackageX } from 'lucide-react';
import { StatCard } from './types';

interface StatsCardsProps {
  stats?: StatCard[];
}

const StatsCards = ({
  stats = [
    { label: 'Total Order', value: '500', icon: Package, color: 'bg-amber-50', iconColor: 'text-amber-500' },
    { label: 'Total Delivered', value: '320', icon: PackageCheck, color: 'bg-emerald-50', iconColor: 'text-emerald-500' },
    { label: 'Pending Order', value: '50', icon: Clock, color: 'bg-blue-50', iconColor: 'text-blue-500' },
    { label: 'Cancel Order', value: '30', icon: PackageX, color: 'bg-red-50', iconColor: 'text-red-500' },
  ]
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
      {stats.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow p-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;