"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, subDays, startOfDay } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
  id: number;
  senderId: number;
  recipientId: number;
  amount: number;
  status: string;
  timestamp: string;
  description?: string | null;
}

interface RecentActivityProps {
  transactions: Transaction[];
  userId: number;
}

export function RecentActivity({ transactions, userId }: RecentActivityProps) {
  const router = useRouter();

  // --- Calculations for Summary Cards ---
  const last7Days = subDays(new Date(), 7);
  const recentTransactionsForStats = transactions.filter(tx => 
    new Date(tx.timestamp) >= last7Days && tx.status.toLowerCase() === "completed"
  );

  const totalSent = recentTransactionsForStats
    .filter(tx => tx.senderId === userId)
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalReceived = recentTransactionsForStats
    .filter(tx => tx.recipientId === userId)
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const netFlow = totalReceived - totalSent;

  // --- Transaction List Logic ---
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <Card className="enhanced-card col-span-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
          <CardDescription className="text-base">
            An overview of your transactions from the last 7 days.
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push('/transactions')}
          className="hover:scale-105 transition-all duration-300"
        >
          <ArrowUpRight className="h-4 w-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="enhanced-card group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Sent</CardTitle>
                <div className="p-2 rounded-full bg-red-500/10">
                  <TrendingDown className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-red-500 mb-1">-₹{totalSent.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">in the last 7 days</p>
                </CardContent>
            </Card>
            <Card className="enhanced-card group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Received</CardTitle>
                <div className="p-2 rounded-full bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                </CardHeader>
                <CardContent>
                <div className="text-3xl font-bold text-green-500 mb-1">+₹{totalReceived.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">in the last 7 days</p>
                </CardContent>
            </Card>
            <Card className="enhanced-card group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Net Flow</CardTitle>
                
                </CardHeader>
                <CardContent>
                <div className={`text-3xl font-bold mb-1 ${netFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {netFlow >= 0 ? '+' : '-'}₹{Math.abs(netFlow).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Your 7-day balance change</p>
                </CardContent>
            </Card>
        </div>
      </CardContent>
    </Card>
  );
}