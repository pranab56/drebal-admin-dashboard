
import { X } from 'lucide-react';
import DetailRow from './DetailRow';
import { TicketModalProps } from './eventType';

export default function TicketModal({ onClose }: TicketModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Re Sold Tickets details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Previous Details */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-4">Previous User details</h3>
              <div className="space-y-3">
                <DetailRow label="User Name" value="Nohiur islam" />
                <DetailRow label="Email" value="Nohir" />
                <DetailRow label="Event Categories" value="Muhir" />
                <DetailRow label="User Account Id" value="242453" />
                <DetailRow label="Order Number" value="#44463846980" />
                <DetailRow label="Time" value="8:30AM" />
              </div>
            </div>

            {/* Updated Details */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-4">Updetead User details</h3>
              <div className="space-y-3">
                <DetailRow label="User Name" value="Hyinci islam" />
                <DetailRow label="Email" value="Nohir" />
                <DetailRow label="Event Categories" value="Muhir" />
                <DetailRow label="User Account Id" value="2952581" />
                <DetailRow label="Ticket Number" value="#9545D8445" />
                <DetailRow label="Time" value="9:30AM" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}