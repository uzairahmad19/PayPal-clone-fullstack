"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { HandCoins, Send, Check, X, Clock, Plus, User as UserIcon } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDistanceToNowStrict } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { MoneyRequest, User, Notification } from "@/types";
import { requestApi, authApi, notificationApi, userApi } from "@/lib/api-service";
import { MoneyRequestModal } from "@/components/money-request-modal";
import { ApproveRequestModal } from "@/components/approve-request-modal";
import { cn } from "@/lib/utils";

export default function RequestMoneyPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [incomingRequests, setIncomingRequests] = useState<MoneyRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<MoneyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MoneyRequest | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = await authApi.getMe();
        setUser(currentUser);
        await Promise.all([
          fetchAllUsers(),
          fetchIncomingRequests(),
          fetchOutgoingRequests(),
          fetchNotifications(currentUser.id),
          fetchUnreadCount(currentUser.id)
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to load data." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router, toast]);

  const refreshData = () => {
    if (user) {
      fetchIncomingRequests();
      fetchOutgoingRequests();
      fetchNotifications(user.id);
      fetchUnreadCount(user.id);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await userApi.searchUsers("");
      setUsers(response);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };
  
  const getUserNameById = (id: number) => {
    const user = users.find(u => u.id === id);
    return user ? `${user.firstName} ${user.lastName}` : `User ${id}`;
  };

  const fetchIncomingRequests = async () => {
    try {
      const response = await requestApi.getIncomingRequests();
      setIncomingRequests(response);
    } catch (error) {
      console.error("Error fetching incoming requests:", error);
    }
  };

  const fetchOutgoingRequests = async () => {
    try {
      const response = await requestApi.getOutgoingRequests();
      setOutgoingRequests(response);
    } catch (error) {
      console.error("Error fetching outgoing requests:", error);
    }
  };

  const fetchNotifications = async (userId: number) => {
    try {
      const data = await notificationApi.getUserNotifications(userId);
      setNotifications(data);
    } catch (err) {
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

  const handleApprove = (request: MoneyRequest) => {
    setSelectedRequest(request);
    setShowApproveModal(true);
  };

  const handleReject = async (requestId: number) => {
    if (!user) return;
    try {
      await requestApi.rejectRequest(requestId);
      toast({ title: "Request Rejected" });
      refreshData();
    } catch (error: any) {
      console.error(`Error rejecting request:`, error);
      const errorMessage = error.response?.data?.message || "Failed to reject request.";
      toast({ variant: "destructive", title: "Error", description: errorMessage });
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    if (!user) return;
    try {
      await requestApi.cancelRequest(requestId);
      toast({ title: "Success", description: "Request cancelled." });
      refreshData();
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to cancel request." });
    }
  };
  
  const getStatusBadge = (status: string) => {
    const styleMap: { [key: string]: string } = {
      approved: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    const iconMap: { [key: string]: React.ReactNode } = {
        approved: <Check className="h-3 w-3" />,
        pending: <Clock className="h-3 w-3" />,
        rejected: <X className="h-3 w-3" />,
    }
    return <Badge className={cn(styleMap[status], "capitalize") || "bg-gray-100"}>{iconMap[status]} {status}</Badge>;
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
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

  const pendingIncomingCount = useMemo(() => incomingRequests.filter(r => r.status === "pending").length, [incomingRequests]);

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
          <div className="flex justify-between items-center"><div className="space-y-2"><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64" /></div><Skeleton className="h-10 w-32" /></div>
          <Card><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
          <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
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
        <MoneyRequestModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            currentUser={user}
            onRequestCreated={refreshData}
        />
        {selectedRequest && (
        <ApproveRequestModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          request={selectedRequest}
          onRequestApproved={refreshData}
        />
      )}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div><h1 className="text-3xl font-bold flex items-center gap-2"><HandCoins className="h-8 w-8" />Money Requests</h1><p className="text-muted-foreground">Create and manage your money requests</p></div>
          <Button className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}><Plus className="h-4 w-4" />New Request</Button>
        </div>

        <Tabs defaultValue="incoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="incoming" className="flex items-center gap-2">Incoming{pendingIncomingCount > 0 && <Badge variant="destructive">{pendingIncomingCount}</Badge>}</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          </TabsList>
          <TabsContent value="incoming" className="space-y-4">
            {incomingRequests.length === 0 ? <Card><CardContent className="py-12 text-center"><HandCoins className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="font-semibold">No incoming requests</h3><p className="text-sm text-muted-foreground">When someone sends you a request, it will appear here.</p></CardContent></Card> : incomingRequests.map((req) => (
              <Card key={req.id} className={cn("enhanced-card transition-all hover:shadow-lg hover:-translate-y-1", req.status === 'pending' && "bg-blue-50/50 border-l-4 border-l-paypal-accent")}>
                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-muted rounded-full"><UserIcon className="h-5 w-5 text-muted-foreground" /></div>
                    <div className="flex-1">
                        <p className="font-semibold text-base">From: {getUserNameById(req.requesterId)}</p>
                        <p className="text-sm text-muted-foreground italic">"{req.message}"</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNowStrict(new Date(req.timestamp), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-full sm:w-auto self-stretch sm:self-center">
                    <p className="text-3xl font-bold text-paypal-primary">₹{req.amount.toFixed(2)}</p>
                    <div className="flex items-center justify-end gap-2 mt-auto">
                      {getStatusBadge(req.status)}
                      {req.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-300 hover:text-red-700" onClick={() => handleReject(req.id)}><X className="h-4 w-4 mr-1" />Reject</Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(req)}><Check className="h-4 w-4 mr-1" />Approve</Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="outgoing" className="space-y-4">
            {outgoingRequests.length === 0 ? <Card><CardContent className="py-12 text-center"><Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="font-semibold">No outgoing requests</h3><p className="text-sm text-muted-foreground">Click "New Request" to send your first one.</p></CardContent></Card> : outgoingRequests.map((req) => (
              <Card key={req.id} className="enhanced-card transition-all hover:shadow-lg hover:-translate-y-1">
                 <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                   <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-muted rounded-full"><UserIcon className="h-5 w-5 text-muted-foreground" /></div>
                    <div className="flex-1">
                      <p className="font-semibold text-base">To: {getUserNameById(req.recipientId)}</p>
                      <p className="text-sm text-muted-foreground italic">"{req.message}"</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNowStrict(new Date(req.timestamp), { addSuffix: true })}</p>
                    </div>
                  </div>
                   <div className="flex flex-col items-end gap-2 w-full sm:w-auto self-stretch sm:self-center">
                    <p className="text-3xl font-bold">₹{req.amount.toFixed(2)}</p>
                    <div className="flex items-center justify-end gap-2 mt-auto">
                      {getStatusBadge(req.status)}
                      {req.status === "pending" && <Button size="sm" variant="outline" onClick={() => handleCancelRequest(req.id)}>Cancel</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}