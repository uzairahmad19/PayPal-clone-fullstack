"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Skeleton } from "@/components/ui/skeleton";
import { User as UserIcon, Lock, Save, Edit, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Notification } from "@/types";
import { authApi, userApi, notificationApi } from "@/lib/api-service";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showTxnPasswordModal, setShowTxnPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [txnPasswordForm, setTxnPasswordForm] = useState({
    currentPassword: "",
    newTxnPassword: "",
    confirmTxnPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);
  
  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName,
        lastName: user.lastName,
      });
      fetchNotifications(user.id);
      fetchUnreadCount(user.id);
    }
  }, [user]);


  
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const userData = await authApi.getMe();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load profile." });
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (userId: number) => {
    try {
      const notificationData = await notificationApi.getUserNotifications(userId);
      setNotifications(notificationData);
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

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      await userApi.updateUserName(user.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
      });
      setUser((prevUser) => (prevUser ? { ...prevUser, ...editForm } : null));
      setEditing(false);
      toast({ title: "Success", description: "Name updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords don't match!",
      });
      return;
    }
    if (!user) return;
    try {
      await userApi.changePassword(user.id, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordModal(false);
      toast({ title: "Success", description: "Password changed successfully!" });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        variant: "destructive",
        title: "Password Change Failed",
        description: error.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };

  const handleChangeTxnPassword = async () => {
    if (txnPasswordForm.newTxnPassword !== txnPasswordForm.confirmTxnPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New transaction passwords don't match!",
      });
      return;
    }
    if (txnPasswordForm.newTxnPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "Transaction password must be at least 6 characters.",
      });
      return;
    }
    if (!user) return;

    try {
      await userApi.changeTransactionPassword(user.id, {
        currentPassword: txnPasswordForm.currentPassword,
        newTxnPassword: txnPasswordForm.newTxnPassword,
      });
      setTxnPasswordForm({ currentPassword: "", newTxnPassword: "", confirmTxnPassword: "" });
      setShowTxnPasswordModal(false);
      toast({ title: "Success", description: "Transaction password changed successfully!" });
    } catch (error: any)      {
      console.error("Error changing transaction password:", error);
      toast({
        variant: "destructive",
        title: "Password Change Failed",
        description: error.response?.data?.message || "An unexpected error occurred.",
      });
    }
  };
  
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await userApi.deleteUser(user.id);
      toast({ title: "Account Deleted", description: "Your account has been permanently deleted." });
      handleLogout();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({ variant: "destructive", title: "Deletion Failed", description: error.response?.data?.message || "Could not delete your account." });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    if (!user) return;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await notificationApi.markAllAsRead(user.id);
    } catch (error) {
      if(user) {
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
      if(user){
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
      toast({ title: "Notification Deleted" });
    } catch (error) {
      if(user){
        fetchNotifications(user.id);
        fetchUnreadCount(user.id);
      }
      toast({ variant: "destructive", title: "Error", description: "Could not delete notification." });
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
        onMarkAllNotificationsAsRead={() => {}}
        onMarkAsRead={() => {}}
        onDeleteNotification={() => {}}
      >
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                  </div>
                  <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
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
      <div className="-m-6 lg:-m-8">
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2"><UserIcon className="h-8 w-8" />Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>
          </div>
          <div className="space-y-6">
            <Card className={cn("enhanced-card transition-all duration-300", editing && "border-paypal-primary/50 bg-paypal-primary/5")}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />{editing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={editForm.firstName} onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={editForm.lastName} onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={user.email} disabled />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveProfile} className="flex items-center gap-2"><Save className="h-4 w-4" />Save Changes</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <p className="text-md text-muted-foreground p-2">{user.firstName}</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <p className="text-md text-muted-foreground p-2">{user.lastName}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <p className="text-md text-muted-foreground p-2">{user.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          <Card className="enhanced-card">
            <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Security Settings</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Account Password</h3>
                    <p className="text-sm text-muted-foreground">Change the password you use to log in.</p>
                  </div>
                  <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
                    <DialogTrigger asChild><Button variant="outline">Change Password</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Change Login Password</DialogTitle><DialogDescription>Enter your current password and choose a new one.</DialogDescription></DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input id="currentPassword" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input id="newPassword" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input id="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                        <Button onClick={handleChangePassword} disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}>Change Password</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Separator />
                 <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Transaction Password</h3>
                    <p className="text-sm text-muted-foreground">Set or change the password used to authorize transactions.</p>
                  </div>
                  <Dialog open={showTxnPasswordModal} onOpenChange={setShowTxnPasswordModal}>
                    <DialogTrigger asChild><Button variant="outline">Change Password</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Change Transaction Password</DialogTitle><DialogDescription>This password is used to authorize payments and transfers.</DialogDescription></DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPasswordTxn">Current Account Password</Label>
                          <Input id="currentPasswordTxn" type="password" value={txnPasswordForm.currentPassword} onChange={(e) => setTxnPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newTxnPassword">New Transaction Password</Label>
                          <Input id="newTxnPassword" type="password" value={txnPasswordForm.newTxnPassword} onChange={(e) => setTxnPasswordForm(prev => ({ ...prev, newTxnPassword: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmTxnPassword">Confirm New Password</Label>
                          <Input id="confirmTxnPassword" type="password" value={txnPasswordForm.confirmTxnPassword} onChange={(e) => setTxnPasswordForm(prev => ({ ...prev, confirmTxnPassword: e.target.value }))} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowTxnPasswordModal(false)}>Cancel</Button>
                        <Button onClick={handleChangeTxnPassword} disabled={!txnPasswordForm.currentPassword || !txnPasswordForm.newTxnPassword || !txnPasswordForm.confirmTxnPassword}>Set Password</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-destructive">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
                  </div>
                  <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <DialogTrigger asChild><Button variant="destructive"><Trash2 className="h-4 w-4 mr-2" />Delete Account</Button></DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Are you absolutely sure?</DialogTitle><DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription></DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>Yes, delete my account</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}