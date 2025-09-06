"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoneyRequest } from "@/types";
import { requestApi } from "@/lib/api-service";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ApproveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: MoneyRequest;
  onRequestApproved: () => void;
}

export function ApproveRequestModal({
  isOpen,
  onClose,
  request,
  onRequestApproved,
}: ApproveRequestModalProps) {
  const { toast } = useToast();
  const [transactionPassword, setTransactionPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTransactionPassword("");
      setError("");
      setIsLoading(false);
      onClose();
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError("");
    try {
      await requestApi.approveRequest(request.id, transactionPassword);
      toast({ title: "Success", description: "Request approved and transaction completed.", variant: "success" });
      onRequestApproved();
      handleOpenChange(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Money Request</DialogTitle>
          <DialogDescription>
            Enter your transaction password to approve this request for{" "}
            <b>₹{request.amount.toFixed(2)}</b>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="transaction-password">
              Transaction Password
            </Label>
            <Input
              id="transaction-password"
              type="password"
              value={transactionPassword}
              onChange={(e) => {
                setTransactionPassword(e.target.value);
                if (error) setError("");
              }}
              disabled={isLoading}
              className={error ? "border-destructive" : ""}
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || !transactionPassword}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Approving..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}