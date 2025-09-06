"use client"

import type * as React from "react"
import { usePathname } from "next/navigation";
import { User2 } from "lucide-react"
import { NotificationsDropdown } from "@/components/notification-dropdown"

import { Notification } from "@/types"
import { Separator } from "./ui/separator";

interface HeaderProps {
  userName?: string
  showMobileSidebarToggle?: boolean
  notifications?: Notification[]
  onMarkAllNotificationsAsRead?: () => void
  onMarkAsRead?: (id: number) => void
  onDeleteNotification?: (id: number) => void
  className?: string
  fixed?: boolean
  unreadCount: number;
}

export function Header({
  userName,
  showMobileSidebarToggle = false,
  notifications = [],
  onMarkAllNotificationsAsRead,
  onMarkAsRead,
  onDeleteNotification,
  className = "",
  fixed = true,
  unreadCount,
}: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';
  
  const baseClasses = "flex h-16 items-center justify-between gap-4 border-b bg-card px-6 lg:h-[72px] shadow-sm z-30"
  
  const fixedClasses = fixed 
    ? showMobileSidebarToggle 
      ? "fixed top-0 left-0 right-0 md:left-[var(--sidebar-width,250px)]"
      : "fixed top-0 left-0 right-0"
    : ""
  const headerClasses = `${baseClasses} ${fixedClasses} ${className}`.trim()

  return (
    <header className={headerClasses}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold capitalize hidden md:block">{pageTitle}</h1>
      </div>
      
      {/* Right Section: User Actions */}
      <div className="flex items-center gap-4">
        {/* User Name and Avatar */}
        {userName && (
          <div className="hidden md:flex items-center gap-2">
            <User2 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">{userName}</span>
          </div>
        )}
        
        {/* Separator */}
        <Separator orientation="vertical" className="h-6 hidden md:block" />
        
        {/* Notifications Dropdown */}
        {onMarkAllNotificationsAsRead && onMarkAsRead && (
          <NotificationsDropdown
            notifications={notifications}
            unreadCount={unreadCount} // Pass down the prop
            onMarkAllAsRead={onMarkAllNotificationsAsRead}
            onMarkAsRead={onMarkAsRead}
            onDeleteNotification={onDeleteNotification}
          />
        )}
      </div>
    </header>
  )
}