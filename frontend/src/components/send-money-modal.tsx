"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  User,
  MessageSquare,
  Zap,
  CheckCircle2,
  AlertCircle,
  Mail,
  ShieldCheck
} from "lucide-react";

interface SendMoneyModalProps {
  show: boolean;
  handleClose: () => void;
  handleSendMoney: (recipientEmail: string, amount: number, description: string, transactionPassword?: string) => void;
}

export function SendMoneyModal({
  show,
  handleClose,
  handleSendMoney,
}: SendMoneyModalProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionPassword, setTransactionPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; amount?: string; transactionPassword?: string }>({});

  const quickAmounts = [100, 500, 1000, 2500, 5000, 10000];

  const validateForm = () => {
    const newErrors: { email?: string; amount?: string; transactionPassword?: string } = {};

    if (!recipientEmail) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(recipientEmail)) {
      newErrors.email = "Please enter a valid email";
    }

    const numAmount = Number.parseFloat(amount);
    if (!amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (numAmount < 1) {
      newErrors.amount = "Minimum amount is ₹1";
    } else if (numAmount > 100000) {
      newErrors.amount = "Maximum amount is ₹1,00,000";
    }
    
    if (!transactionPassword) {
      newErrors.transactionPassword = "Transaction password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const numAmount = Number.parseFloat(amount);
      await handleSendMoney(recipientEmail, numAmount, description, transactionPassword);

      setRecipientEmail("");
      setAmount("");
      setDescription("");
      setTransactionPassword("");
      setErrors({});
      handleClose();
    } catch (error) {
      console.error("Error sending money:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose_ = () => {
    setRecipientEmail("");
    setAmount("");
    setDescription("");
    setTransactionPassword("");
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
        <div className="relative bg-gradient-to-br from-paypal-primary via-paypal-accent to-paypal-primary/90 p-6 text-white flex-shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <div className="relative p-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                  <Send className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex-1">
                <DialogTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                  Send Money
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-200 uppercase tracking-wider">Secure & Instant</span>
                </div>
              </div>
            </div>

          </DialogHeader>
          
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        <div className="p-4 space-y-3 flex-1">
          {/* Recipient Section */}
          <div className="space-y-2">
            <Label htmlFor="recipientEmail" className="text-sm font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4 text-paypal-primary" />
              Recipient Email
            </Label>
            <div className="relative group">
              <Input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                }}
                className={`pl-10 h-10 text-sm transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-paypal-primary focus:shadow-lg focus:shadow-paypal-primary/20'}`}
                placeholder="Enter recipient's email"
                disabled={isLoading}
              />
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${recipientEmail ? 'text-paypal-primary' : 'text-gray-400'}`} />
              {recipientEmail && !errors.email && (
                <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            {errors.email && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Amount Section */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-semibold flex items-center gap-2">
              <span className="h-4 w-4 text-paypal-primary font-bold text-sm flex items-center justify-center">₹</span>
              Amount
            </Label>
            <div className="relative group">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
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

          {/* Transaction Password Section */}
          <div className="space-y-2">
            <Label htmlFor="transactionPassword" className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-paypal-primary" />
              Transaction Password
            </Label>
            <Input
              id="transactionPassword"
              type="password"
              value={transactionPassword}
              onChange={(e) => {
                setTransactionPassword(e.target.value);
                if (errors.transactionPassword) setErrors(prev => ({ ...prev, transactionPassword: undefined }));
              }}
              className={`h-10 text-sm transition-all duration-200 ${errors.transactionPassword ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-paypal-primary focus:shadow-lg focus:shadow-paypal-primary/20'}`}
              placeholder="Enter your transaction password"
              disabled={isLoading}
            />
            {errors.transactionPassword && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.transactionPassword}
              </div>
            )}
          </div>

          <Separator />

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

          {/* Description Section */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-paypal-primary" />
              Add a Note <Badge variant="secondary" className="ml-2 text-xs">Optional</Badge>
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10 text-sm border-gray-200 focus:border-paypal-primary"
              placeholder="What's this for? (e.g., Lunch, Rent, Gift)"
              maxLength={100}
              disabled={isLoading}
            />
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
              disabled={isLoading || !recipientEmail || !amount}
              className="flex-1 h-9 bg-gradient-to-r from-paypal-primary to-paypal-accent hover:from-paypal-primary/90 hover:to-paypal-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Send {amount && formatAmount(amount)}
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}