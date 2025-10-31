export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  order: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface StatCard {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconColor: string;
}