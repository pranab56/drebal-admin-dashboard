import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  type?: 'report' | 'block';
  isLoading?: boolean;
}

export default function ConfirmationDialog({
  isOpen,
  onOpenChange,
  title,
  message,
  onConfirm,
  confirmText = "Yes",
  type = 'report',
  isLoading = false
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`text-center text-xl font-bold ${type === 'block' ? 'text-red-600' : 'text-red-600'
            }`}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              className="px-8 h-10 border-gray-300"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              No
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white px-8 h-10"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}