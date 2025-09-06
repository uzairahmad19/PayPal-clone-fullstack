"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Wallet, 
  Zap, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface AddMoneyModalProps {
  show: boolean;
  handleClose: () => void;
  handleAddMoney: (amount: number) => void;
}

export function AddMoneyModal({
  show,
  handleClose,
  handleAddMoney,
}: AddMoneyModalProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{amount?: string}>({});
  
  const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

  const validateForm = () => {
    const newErrors: {amount?: string} = {};
    
    const numAmount = Number.parseFloat(amount);
    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (numAmount < 10) {
      newErrors.amount = "Minimum amount is ₹10";
    } else if (numAmount > 100000) {
      newErrors.amount = "Maximum amount is ₹1,00,000";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const numAmount = Number.parseFloat(amount);
      await handleAddMoney(numAmount);
      
      // Reset form
      setAmount("");
      setErrors({});
      handleClose();
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose_ = () => {
    setAmount("");
    setErrors({});
    setIsLoading(false);
    handleClose();
  };

  const formatAmount = (value: string) => {
    const num = Number.parseFloat(value);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Dialog open={show} onOpenChange={handleClose_}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[95vh] sm:max-h-[90vh] p-0 overflow-hidden flex flex-col border-0 shadow-2xl">
        {/* Enhanced Header with gradient background */}
        <div className="relative bg-gradient-to-br from-paypal-primary via-paypal-accent to-paypal-primary/90 p-6 text-white flex-shrink-0 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <div className="relative p-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex-1">
                <DialogTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                  Add Money
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Instant Credit</span>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          {/* Subtle animated line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        <div className="p-4 space-y-3 flex-1">
          {/* Amount Section */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-semibold flex items-center gap-2">
              <span className="h-4 w-4 text-paypal-primary font-bold text-sm flex items-center justify-center">₹</span>
              Amount to Add
            </Label>
            <div className="relative group">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors(prev => ({...prev, amount: undefined}));
                }}
                className={`pl-10 h-10 text-sm font-semibold transition-all duration-200 ${errors.amount ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-paypal-primary focus:shadow-lg focus:shadow-paypal-primary/20'}`}
                placeholder="0.00"
                min="0"
                step="0.01"
                disabled={isLoading}
              />
              <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 font-semibold transition-colors duration-200 ${amount ? 'text-paypal-primary' : 'text-gray-400'}`}>₹</span>
              {amount && !errors.amount && (
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {errors.amount && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.amount}
              </div>
            )}
          </div>

          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-paypal-primary" />
              Quick Amounts
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              {quickAmounts.map((qAmount, index) => (
                <Button
                  key={qAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(qAmount.toString())}
                  className={`h-7 text-xs border-paypal-primary/20 text-paypal-primary hover:bg-paypal-primary/10 hover:border-paypal-primary transition-all duration-200 transform hover:scale-105 active:scale-95 ${amount === qAmount.toString() ? 'bg-paypal-primary/10 border-paypal-primary' : ''}`}
                  disabled={isLoading}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  ₹{qAmount.toLocaleString("en-IN")}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Wallet Info */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-paypal-primary" />
              Payment Method <Badge variant="secondary" className="ml-2 text-xs">Secure</Badge>
            </Label>
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Wallet className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">Bank Transfer</p>
                    <p className="text-xs text-blue-600">Funds will be added instantly to your wallet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              onClick={handleClose_}
              className="flex-1 h-9"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !amount}
              className="flex-1 h-9 bg-gradient-to-r from-paypal-primary to-paypal-accent hover:from-paypal-primary/90 hover:to-paypal-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Adding...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  Add {amount && formatAmount(amount)}
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
