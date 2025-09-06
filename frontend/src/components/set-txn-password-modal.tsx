"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/lib/api-service";
import { User } from "@/types";

interface SetTxnPasswordModalProps {
  show: boolean;
  handleClose: () => void;
  user: User | null;
}

export function SetTxnPasswordModal({
  show,
  handleClose,
  user,
}: SetTxnPasswordModalProps) {
  const { toast } = useToast();
  const [newTxnPassword, setNewTxnPassword] = useState("");
  const [confirmTxnPassword, setConfirmTxnPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (newTxnPassword !== confirmTxnPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords don't match!",
      });
      return;
    }
    if (newTxnPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Transaction password must be at least 6 characters long.",
      });
      return;
    }
    if (!user) return;

    setIsLoading(true);
    try {
      await userApi.setTransactionPassword(user.id, newTxnPassword);
      toast({
        title: "Success",
        description: "Transaction password set successfully! You can now try sending money again.",
      });
      handleClose();
    } catch (error) {
      console.error("Error setting transaction password:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set transaction password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Transaction Password</DialogTitle>
          <DialogDescription>
            You need to set a transaction password before you can send money.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newTxnPassword">New Transaction Password</Label>
            <Input
              id="newTxnPassword"
              type="password"
              value={newTxnPassword}
              onChange={(e) => setNewTxnPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmTxnPassword">Confirm New Password</Label>
            <Input
              id="confirmTxnPassword"
              type="password"
              value={confirmTxnPassword}
              onChange={(e) => setConfirmTxnPassword(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !newTxnPassword || !confirmTxnPassword}>
            {isLoading ? "Saving..." : "Set Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}