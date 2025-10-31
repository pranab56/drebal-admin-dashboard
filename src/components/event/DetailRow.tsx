import { DetailRowProps } from './eventType';


export default function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}