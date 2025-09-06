"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Eye, EyeOff, User as UserIcon, Mail, Shield } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AddMoneyModal } from "@/components/add-money-modal";
import { SendMoneyModal } from "@/components/send-money-modal";
import { SetTxnPasswordModal } from "@/components/set-txn-password-modal";
import { RecentActivity } from "@/components/recent-activity";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { QuickActions } from "@/components/quick-actions";
import { useToast } from "@/hooks/use-toast";
import { User, Transaction, Notification } from "@/types";
import { authApi, transactionApi, walletApi, notificationApi } from "@/lib/api-service";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [showSetTxnPasswordModal, setShowSetTxnPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [balanceVisible, setBalanceVisible] = useState(false);

  const fetchUser = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
      // Check if transaction password is set
      const transactionPasswordSet = localStorage.getItem("transactionPasswordSet");
      if (transactionPasswordSet === 'false') {
        setShowSetTxnPasswordModal(true);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch user details", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchBalance(user.id);
      fetchTransactions(user.id);
      fetchNotifications(user.id);
      fetchUnreadCount(user.id);
      setLoading(false);
    }
  }, [user]);

  const fetchBalance = async (userId: number) => {
    try {
      const walletData = await walletApi.getUserWallet(userId);
      if (walletData) {
        setBalance(walletData.balance);
      } else {
        const newWallet = await walletApi.createWallet({ userId });
        setBalance(newWallet.balance);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch or create wallet", err);
    }
  };

  const fetchTransactions = async (userId: number) => {
    try {
      const transactionData = await transactionApi.getUserTransactions(userId);
      setTransactions(transactionData);
    } catch (err: unknown) {
      console.error("Failed to fetch transactions", err);
    }
  };

  const fetchNotifications = async (userId: number) => {
    try {
      const notificationData = await notificationApi.getUserNotifications(userId);
      setNotifications(notificationData);
    } catch (err: unknown) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const fetchUnreadCount = async (userId: number) => {
    try {
      const data = await notificationApi.getUnreadCount(userId);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const handleAddMoney = async (amount: number) => {
    if (amount && user) {
      try {
        await walletApi.addMoney(user.id, amount);
        fetchBalance(user.id);
        fetchTransactions(user.id);
        fetchNotifications(user.id);
        fetchUnreadCount(user.id);
        toast({ title: "Money Added Successfully!", description: `₹${amount.toFixed(2)} has been added to your wallet.`, variant: "success" });
      } catch (err: unknown) {
        console.error("Failed to add money", err);
        toast({ title: "Failed to Add Money", description: "There was an error adding money. Please try again.", variant: "destructive" });
      }
    }
  };

  const handleSendMoney = async (recipientEmail: string, amount: number, description: string, transactionPassword?: string) => {
    if (recipientEmail && amount && user && transactionPassword) {
      try {
        await transactionApi.createTransaction({ senderId: user.id, recipientEmail, amount, description, transactionPassword });
        fetchBalance(user.id);
        fetchTransactions(user.id);
        fetchNotifications(user.id);
        fetchUnreadCount(user.id);
        toast({ title: "Money Sent Successfully!", description: `₹${amount.toFixed(2)} has been sent to ${recipientEmail}.`, variant: "success" });
      } catch (err: any) {
        if (err.response?.data?.message === "Transaction password not set") {
          setShowSendMoneyModal(false);
          setShowSetTxnPasswordModal(true);
        } else {
          console.error("Failed to send money", err);
          const errorMessage = err.response?.data?.message || "Check your balance and try again.";
          toast({ title: "Failed to Send Money", description: errorMessage, variant: "destructive" });
        }
      }
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    if (!user) return;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await notificationApi.markAllAsRead(user.id);
    } catch (error) {
      if (user) {
        fetchNotifications(user.id);
        fetchUnreadCount(user.id);
      }
    }
  };

  const handleMarkNotificationAsRead = async (id: number) => {
    if (!user) return;
    const isUnread = notifications.find(n => n.id === id)?.read === false;
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    if (isUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await notificationApi.markAsRead(id);
    } catch (error) {
      if (user) {
        fetchNotifications(user.id);
        fetchUnreadCount(user.id);
      }
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (!user) return;
    const isUnread = notifications.find(n => n.id === id)?.read === false;
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (isUnread) setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await notificationApi.deleteNotification(id);
    } catch (error) {
      if (user) {
        fetchNotifications(user.id);
        fetchUnreadCount(user.id);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <DashboardLayout
        userName="Loading..."
        onLogout={handleLogout}
        notifications={[]}
        unreadCount={0}
        onMarkAllNotificationsAsRead={() => { }}
        onMarkAsRead={() => { }}
        onDeleteNotification={() => { }}
      >
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={`${user.firstName} ${user.lastName}`}
      onLogout={handleLogout}
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
      onMarkAsRead={handleMarkNotificationAsRead}
      onDeleteNotification={handleDeleteNotification}
    >
      <div className="space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your money today.
          </p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-in">
          <Card id="wallet" className="enhanced-card col-span-full md:col-span-2 lg:col-span-3 relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <div>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Current Balance
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-blue-600 font-medium">Available Balance</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-2 h-8 w-8 rounded-full hover:bg-paypal-primary/10"
                >
                  {balanceVisible ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
                <div className="p-3 rounded-full bg-paypal-primary/10">
                  <Wallet className="h-6 w-6 text-paypal-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative pt-2">
              <div className="text-5xl md:text-6xl font-extrabold text-paypal-primary mb-2">
                {balanceVisible ? (
                  balance.toLocaleString("en-IN", { style: "currency", currency: "INR" })
                ) : (
                  "₹ ******"
                )}
              </div>
              <p className="text-muted-foreground mb-6">
                Your available funds • Last updated just now
              </p>

              {/* Account Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border">
                  <div className="p-2 rounded-full bg-paypal-primary/10">
                    <UserIcon className="h-4 w-4 text-pa-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Account Holder</p>
                    <p className="text-sm text-muted-foreground">{user.firstName} {user.lastName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border">
                    <div className="p-2 rounded-full bg-blue-500/10">
                      <Mail className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">Email</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border">
                    <div className="p-2 rounded-full bg-green-500/10">
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">Account ID</p>
                      <p className="text-xs text-muted-foreground">#{user.id.toString().padStart(6, '0')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <QuickActions onAddMoney={() => setShowAddMoneyModal(true)} onSendMoney={() => setShowSendMoneyModal(true)} />
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <RecentActivity transactions={transactions} userId={user.id} />
        </div>
      </div>

      <AddMoneyModal show={showAddMoneyModal} handleClose={() => setShowAddMoneyModal(false)} handleAddMoney={handleAddMoney} />
      <SendMoneyModal show={showSendMoneyModal} handleClose={() => setShowSendMoneyModal(false)} handleSendMoney={handleSendMoney} />
      <SetTxnPasswordModal user={user} show={showSetTxnPasswordModal} handleClose={() => setShowSetTxnPasswordModal(false)} />
    </DashboardLayout>
  );
}