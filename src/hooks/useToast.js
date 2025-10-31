import { toast } from "sonner";

const useToast = () => {
  return {
    success: (message, options = {}) => {
      toast.success(message, {
        duration: 3000,
        position: "top-right",
        description: options.description,
      });
    },
    error: (message, options = {}) => {
      toast.error(message, {
        duration: 3000,
        position: "top-right",
        description: options.description,
      });
    },
  };
};

export default useToast;
