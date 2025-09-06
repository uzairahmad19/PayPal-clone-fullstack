"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types";
import { userApi, requestApi } from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";
import { HandCoins, Search, Send, MessageSquare, Loader2, Users, X } from "lucide-react";

interface MoneyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onRequestCreated: () => void;
}

export function MoneyRequestModal({
  isOpen,
  onClose,
  currentUser,
  onRequestCreated,
}: MoneyRequestModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    message: "",
  });

  const handleSearchUsers = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const users = await userApi.searchUsers(searchQuery);
      setSearchResults(users.filter(user => user.id !== currentUser.id));
    } catch (error) {
      console.error("Error searching users:", error);
      toast({ variant: "destructive", title: "Search Failed", description: "Could not fetch users." });
    } finally {
      setSearching(false);
    }
  };

  const handleCreateRequest = async () => {
    const amountValue = parseFloat(formData.amount);

    if (!selectedUser || !formData.amount || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(amountValue) || amountValue <= 0) {
        toast({
            title: "Invalid Amount",
            description: "Please enter a positive amount for the request.",
            variant: "destructive",
        });
        return;
    }

    setLoading(true);
    try {
      await requestApi.createRequest({
        requesterId: currentUser.id,
        recipientId: selectedUser.id,
        amount: amountValue,
        message: formData.message,
      });

      toast({
        title: "Success",
        description: "Money request sent successfully",
      });

      onRequestCreated();
      resetAndClose();
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Error",
        description: "Failed to send money request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetAndClose = () => {
    setFormData({ amount: "", message: "" });
    setSelectedUser(null);
    setSearchResults([]);
    setQuery("");
    setLoading(false);
    onClose();
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setQuery("");
    setSearchResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] p-0 overflow-hidden border-0 shadow-2xl">
         <div className="relative bg-gradient-to-br from-paypal-primary via-paypal-accent to-paypal-primary/90 p-6 text-white flex-shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative p-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
                <HandCoins className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-3xl font-bold tracking-tight">Request Money</DialogTitle>
                <DialogDescription className="text-blue-200">Send a payment request to another user.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Request From</Label>
            
            {/* Show selected user or search input */}
            {!selectedUser ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recipient"
                  placeholder="Search by name or email..."
                  className="pl-10 focus-visible:ring-paypal-primary/50"
                  value={query}
                  onChange={(e) => handleSearchUsers(e.target.value)}
                  autoComplete="off"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <div className="font-medium text-sm">{selectedUser.firstName} {selectedUser.lastName}</div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearSelection}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {/* Search Results Display */}
            {(searching || (query.length > 1 && !selectedUser)) && (
              <div className="relative border rounded-md max-h-48 overflow-y-auto bg-background animate-in fade-in-0 zoom-in-95">
                {searching && (
                  <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </div>
                )}
                {!searching && searchResults.length === 0 && (
                   <div className="flex flex-col items-center justify-center p-4 text-center text-sm text-muted-foreground">
                    <Users className="h-8 w-8 mb-2" />
                    <p className="font-semibold">No users found</p>
                    <p>Try a different name or email.</p>
                  </div>
                )}
                {!searching && searchResults.length > 0 && (
                  <div>
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 hover:bg-accent cursor-pointer transition-colors duration-150"
                        onClick={() => {
                          setSelectedUser(user);
                          setQuery("");
                          setSearchResults([]);
                        }}
                      >
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Amount and Message (appears after user is selected)*/}
          {selectedUser && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-4 duration-500">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8 font-semibold"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="message"
                    placeholder="What's this request for?"
                    className="pl-10"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-muted/50 p-6 pt-4">
          <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
          <Button 
            onClick={handleCreateRequest} 
            disabled={loading || !selectedUser || !formData.amount || !formData.message} 
            className="bg-paypal-primary hover:bg-paypal-primary/90"
          >
            {loading ? "Sending..." : <><Send className="h-4 w-4 mr-2" />Send Request</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}