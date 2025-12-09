"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  FolderOpen,
  Grid3x3,
  LogOut,
  Settings,
  User
} from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type SidebarItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

const sidebars: SidebarItem[] = [
  { name: "Dashboard", path: "/", icon: Grid3x3 },
  { name: "User", path: "/users", icon: User },
  { name: "All Event", path: "/all-event", icon: Calendar },
  { name: "Categories&SubCategories", path: "/Categories&SubCategories", icon: FolderOpen },
  // { name: "Re - Sell Tickets", path: "/re-sell-tickets", icon: Ticket },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "Support", path: "/support", icon: Settings },
  { name: "Notifications", path: "/notifications", icon: Settings },
  { name: "Account Delete History", path: "/history", icon: Settings },
];

export default function MainlandSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-none">
      <SidebarContent className="bg-[#e8e8e8] flex flex-col h-screen">
        {/* Logo Section */}
        <div className="flex items-center justify-center py-6 px-4">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <Image src={'/icons/logo.png'} width={1000} height={1000} className='w-full h-full' alt='Admin logo' />
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1">
          <SidebarGroupContent className="px-0">
            <SidebarMenu className="space-y-1">
              {sidebars.map((item) => (
                <SidebarMenuItem key={item.name} className="px-3">
                  <SidebarMenuButton
                    asChild
                    className={`h-11 px-3 rounded-md transition-all duration-200 ${isActive(item.path)
                      ? "bg-[#00a651] text-white hover:bg-[#00a651] hover:text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                      }`}
                  >
                    <Link href={item.path} className="flex items-center gap-3 w-full">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="px-3 pb-6">
          <SidebarMenuButton
            asChild
            className="h-11 px-3 rounded-md bg-[#00a651] text-white hover:bg-[#008f45] hover:text-white transition-all duration-200 shadow-sm"
          >
            <Link href="/auth/login" className="flex items-center gap-3 w-full">
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </Link>
          </SidebarMenuButton>
        </div>

        {/* Copyright Footer */}
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-600 text-center">
            Copyright@Mainland
          </p>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}