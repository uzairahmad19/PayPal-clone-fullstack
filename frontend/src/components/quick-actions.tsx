"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Send, HandCoins, QrCode, Smartphone } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  onAddMoney: () => void;
  onSendMoney: () => void;
}

export function QuickActions({ onAddMoney, onSendMoney }: QuickActionsProps) {
  return (
    <Card className="enhanced-card relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-90"></div>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <CardHeader className="relative">
        <CardTitle className="text-white flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
            <Smartphone className="h-5 w-5" />
          </div>
          Quick Actions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            onClick={onAddMoney}
            className="group glass text-white border-white/30 h-auto p-4 flex-col gap-2 hover:scale-105 transition-all duration-300"
            variant="outline"
          >
            <PlusCircle className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-medium">Add Money</span>
          </Button>
          
          <Button
            onClick={onSendMoney}
            className="group glass text-white border-white/30 h-auto p-4 flex-col gap-2 hover:scale-105 transition-all duration-300"
            variant="outline"
          >
            <Send className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            <span className="text-sm font-medium">Send Money</span>
          </Button>
          
          <Link href="/request" className="contents">
            <Button
              className="group glass text-white border-white/30 h-auto p-4 flex-col gap-2 hover:scale-105 transition-all duration-300"
              variant="outline"
            >
              <HandCoins className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium">Request</span>
            </Button>
          </Link>
          
          <Button
            className="glass text-white/60 border-white/20 h-auto p-4 flex-col gap-2 cursor-not-allowed"
            variant="outline"
            disabled
          >
            <QrCode className="h-6 w-6" />
            <span className="text-sm font-medium">QR Pay</span>
            <span className="text-xs opacity-75">Soon</span>
          </Button>
        </div>
        

      </CardContent>
    </Card>
  );
}
