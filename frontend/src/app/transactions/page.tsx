"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Search, Filter, Calendar } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNowStrict } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { User, Transaction, Notification } from "@/types";
import { authApi, transactionApi, notificationApi } from "@/lib/api-service";

export default function TransactionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

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
      fetchTransactions(user.id);
      fetchNotifications(user.id);
      fetchUnreadCount(user.id);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchTerm, filterType, filterStatus, dateRange]);

  const fetchUser = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (err: any) {
      console.error("Failed to fetch user details", err);
      setError("Failed to load user data.");
      router.push("/login");
    }
  };

  const fetchTransactions = async (userId: number) => {
    try {
      const transactionData = await transactionApi.getUserTransactions(userId);
      setTransactions(transactionData);
    } catch (err: any) {
      console.error("Failed to fetch transactions", err);
      setError("Failed to load transactions.");
    }
  };

  const fetchNotifications = async (userId: number) => {
    try {
      const notificationData = await notificationApi.getUserNotifications(userId);
      setNotifications(notificationData);
    } catch (err: any) {
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

  const applyFilters = () => {
    let filtered = [...transactions];
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.amount.toString().includes(searchTerm) ||
          t.id.toString().includes(searchTerm)
      );
    }
    if (filterType !== "all" && user) {
      filtered = filtered.filter((t) => {
        const isDebit = t.senderId === user.id;
        return filterType === "debit" ? isDebit : !isDebit;
      });
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }
    if (dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();
      switch (dateRange) {
        case "today": filterDate.setHours(0, 0, 0, 0); break;
        case "week": filterDate.setDate(now.getDate() - 7); break;
        case "month": filterDate.setMonth(now.getMonth() - 1); break;
        case "3months": filterDate.setMonth(now.getMonth() - 3); break;
      }
      filtered = filtered.filter((t) => new Date(t.timestamp) >= filterDate);
    }
    setFilteredTransactions(filtered);
  };
  
  const processedTransactions = useMemo(() => {
    if (!user) return [];
    return filteredTransactions.map((tx) => {
      const isSender = tx.senderId === user.id;
      const type = isSender ? "DEBIT" : "CREDIT";
      let tooltipContent = "";
      if (tx.status === "failed") {
        tooltipContent = tx.status.replace("FAILED: ", "");
      }
      return { ...tx, type, tooltipContent };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filteredTransactions, user]);
  
  const handleExportCSV = () => {
    const csvContent = [
      ["ID", "Type", "Amount", "Party", "Description", "Status", "Date"],
      ...processedTransactions.map((tx) => [
        tx.id, tx.type, tx.amount,
        tx.type === "DEBIT" ? `User ${tx.recipientId}` : `User ${tx.senderId}`,
        tx.description || "—", tx.status,
        new Date(tx.timestamp).toLocaleDateString(),
      ]),
    ].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "Export Successful", description: "Transaction history exported." });
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

  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);
  const paginatedTransactions = processedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading || !user) {
    return (
      <DashboardLayout
        userName="Loading..."
        onLogout={handleLogout}
        notifications={[]}
        unreadCount={0}
        onMarkAllNotificationsAsRead={() => {}}
        onMarkAsRead={() => {}}
        onDeleteNotification={() => {}}
      >
        <div className="space-y-6">
          <div className="space-y-2"><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64" /></div>
          <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-5 gap-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div></CardContent></Card>
          <div className="space-y-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        </div>
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">View and manage all your transactions ({processedTransactions.length} total)</p>
          </div>
          <Button onClick={handleExportCSV} className="flex items-center gap-2" disabled={processedTransactions.length === 0}><Download className="h-4 w-4" />Export CSV</Button>
        </div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />Filters & Search</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div>
              <Select value={filterType} onValueChange={setFilterType}><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="credit">Credit</SelectItem><SelectItem value="debit">Debit</SelectItem></SelectContent></Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="failed">Failed</SelectItem></SelectContent></Select>
              <Select value={dateRange} onValueChange={setDateRange}><SelectTrigger><SelectValue placeholder="Date Range" /></SelectTrigger><SelectContent><SelectItem value="all">All Time</SelectItem><SelectItem value="today">Today</SelectItem><SelectItem value="week">Last 7 Days</SelectItem><SelectItem value="month">Last 30 Days</SelectItem><SelectItem value="3months">Last 3 Months</SelectItem></SelectContent></Select>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" />{processedTransactions.length} results</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>All Transactions</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Party</TableHead><TableHead className="hidden sm:table-cell">Description</TableHead><TableHead className="hidden md:table-cell">Status</TableHead><TableHead className="text-right">Time</TableHead></TableRow></TableHeader>
                <TableBody>
                  {paginatedTransactions.length > 0 ? paginatedTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{tx.id}</TableCell>
                      <TableCell><Badge variant={tx.type === "DEBIT" ? "destructive" : "default"} className={tx.type === "DEBIT" ? "bg-destructive/10 text-destructive" : "bg-paypal-accent/10 text-paypal-accent"}>{tx.type}</Badge></TableCell>
                      <TableCell className={`font-semibold ${tx.type === "DEBIT" ? "text-destructive" : "text-paypal-accent"}`}>{tx.type === "DEBIT" ? "-" : "+"}₹{tx.amount.toFixed(2)}</TableCell>
                      <TableCell>{tx.type === "DEBIT" ? `User ${tx.recipientId}` : `User ${tx.senderId}`}</TableCell>
                      <TableCell className="hidden sm:table-cell"><span className={tx.description ? "text-foreground" : "text-muted-foreground italic"}>{tx.description || "—"}</span></TableCell>
                      <TableCell className="hidden md:table-cell">
                        {tx.status.toLowerCase().includes("fail") ? (
                          <TooltipProvider><Tooltip><TooltipTrigger asChild><Badge variant="destructive" className="cursor-help bg-destructive/10 text-destructive">Failed</Badge></TooltipTrigger><TooltipContent><p>{tx.tooltipContent || "Transaction failed"}</p></TooltipContent></Tooltip></TooltipProvider>
                        ) : tx.status === "pending" ? (
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-600">Pending</Badge>
                        ) : (<Badge variant="default" className="bg-green-500/10 text-green-600">Completed</Badge>)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{formatDistanceToNowStrict(new Date(tx.timestamp), { addSuffix: true })}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">{transactions.length === 0 ? "No transactions found." : "No transactions match filters."}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">Showing {Math.min((currentPage - 1) * itemsPerPage + 1, processedTransactions.length)} to {Math.min(currentPage * itemsPerPage, processedTransactions.length)} of {processedTransactions.length} results</div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Previous</Button>
                  <span className="flex items-center px-3 text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}