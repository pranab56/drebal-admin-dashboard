import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { logoutFromOtherTab } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export const useCrossTabLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Listen for logout events from other tabs
      if (e.key === "logoutEvent") {
        console.log("Cross-tab logout detected");
        dispatch(logoutFromOtherTab());
        router.push("/auth/login");
      }

      // Also listen for removal of auth tokens
      if (e.key === "accessToken" && e.oldValue && !e.newValue) {
        console.log("Access token removed in another tab");
        dispatch(logoutFromOtherTab());
        router.push("/auth/login");
      }
    };

    // Listen for storage events (cross-tab communication)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, router]);
};
