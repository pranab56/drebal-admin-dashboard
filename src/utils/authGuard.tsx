"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectPath?: string;
}

export default function AuthGuard({
  children,
  requiredRoles = [],
  redirectPath = "/auth/login",
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log("AuthGuard - isAuthenticated:", isAuthenticated);
    console.log("AuthGuard - isLoading:", isLoading);
    console.log("AuthGuard - user:", user);

    // Check if Redux is still loading
    if (isLoading) {
      console.log("AuthGuard - Still loading, waiting...");
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Check localStorage as fallback
      const token = localStorage.getItem("accessToken");
      console.log("AuthGuard - Token from localStorage:", token);

      if (!token) {
        console.log(
          "AuthGuard - No token found, redirecting to:",
          redirectPath
        );
        router.replace(redirectPath);
        setIsChecking(false);
        return;
      } else {
        console.log(
          "AuthGuard - Token found but not authenticated, this might be a rehydration issue"
        );
      }
    }

    // If roles are specified, check user's role
    if (requiredRoles.length > 0 && user?.role) {
      console.log(
        "AuthGuard - Checking role:",
        user.role,
        "Required:",
        requiredRoles
      );
      if (!requiredRoles.includes(user.role)) {
        console.log(
          "AuthGuard - Role not authorized, redirecting to unauthorized"
        );
        router.replace("/unauthorized");
        setIsChecking(false);
        return;
      }
    }

    console.log("AuthGuard - Authentication check passed");
    setIsChecking(false);
  }, [isAuthenticated, user, isLoading, router, requiredRoles, redirectPath]);

  // Show loading while checking authentication
  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Render children only if authenticated and has required roles
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
