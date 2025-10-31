import { InfoCardProps } from './eventType';


export default function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div>
      <div className="flex items-center gap-1 text-sm text-gray-700  mb-1">
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="text-sm text-gray-600 pl-3">{value}</div>
    </div>
  );
}