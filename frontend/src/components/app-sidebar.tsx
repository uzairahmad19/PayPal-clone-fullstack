"use client";
import Link from "next/link";
import {
  Home,
  Repeat2,
  Settings,
  LogOut,
  ChevronDown,
  User2,
  CreditCard,
  Bell,
  HandCoins,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PayPalLogo } from "@/components/paypal-logo";

interface AppSidebarProps {
  userName: string;
  onLogout: () => void;
}

export function AppSidebar({ userName, onLogout }: AppSidebarProps) {
  return (
    <Sidebar
      className="bg-paypal-primary text-paypal-primary-foreground shadow-lg"
      collapsible="none" // Ensure sidebar is always expanded
    >
      <SidebarHeader className="p-4 border-b border-paypal-primary-foreground/20">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          prefetch={false}
        >
          <PayPalLogo className="h-8 w-8 mb-2 text-paypal-accent" />
          <span className="text-2xl font-extrabold text-paypal-primary-foreground">
            PayClone
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase text-paypal-primary-foreground/70 mb-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={true}>
                  <Link
                    href="/dashboard"
                    prefetch={false}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-paypal-accent/20 transition-all duration-300 hover:scale-105"
                  >
                    <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/transactions"
                    prefetch={false}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-paypal-accent/20 transition-all duration-300 hover:scale-105"
                  >
                    <Repeat2 className="h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                    <span className="font-medium">Transactions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/request"
                    prefetch={false}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-paypal-accent/20 transition-all duration-300 hover:scale-105"
                  >
                    <HandCoins className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Request Money</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="my-4 bg-paypal-primary-foreground/20" />
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase text-paypal-primary-foreground/70 mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/profile"
                    prefetch={false}
                    className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-paypal-accent/20 transition-all duration-300 hover:scale-105"
                  >
                    <User2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-paypal-primary-foreground/20">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                onClick={onLogout}
                className="group flex items-center gap-3 px-4 py-3 rounded-xl hover: transition-all duration-300 hover:scale-105"
                >
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}