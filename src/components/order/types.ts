export interface Order {
  id: string;
  customer: string;
  avatar: string;
  items: string;
  amount: string;
  date: string;
  status: 'Delivered' | 'Pending' | 'Canceled';
}

export interface StatCard {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconColor: string;
}