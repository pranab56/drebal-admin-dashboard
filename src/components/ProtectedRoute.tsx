"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("drebalAdmin");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]); // Added router to dependency array

  return <>{children}</>;
}