"use client";

import { LucideIcon, Users } from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface StatsCardsProps {
  stats?: StatCard[];
}

const StatsCards = ({
  stats = [
    { label: 'Total', value: '100', icon: Users, color: 'bg-purple-100' },
    { label: 'Active', value: '900', icon: Users, color: 'bg-purple-100' },
    { label: 'Pending', value: '30', icon: Users, color: 'bg-purple-100' },
    { label: 'Suspended', value: '20', icon: Users, color: 'bg-purple-100' },
  ]
}: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;