import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";
import {
  DollarSign,
  ShieldCheck,
  Repeat2,
  Headphones,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground">
      {/* Fixed Header */}
      <LandingHeader fixed={true} />
      <main className="flex-1 w-full pt-14">
        {" "}
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-paypal-primary to-paypal-accent">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="relative container px-4 md:px-6 text-center text-paypal-primary-foreground">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-4 animate-float">
                💳 Microservices-Based Payment System
              </div>
              
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                PayClone
                <br />
                <span className="text-paypal-accent">Payment System</span>
              </h1>
              
              <p className="mx-auto max-w-[700px] text-xl md:text-2xl text-white/90 leading-relaxed">
                A simple and secure digital payment platform for sending and receiving money. 
                <span className="font-semibold text-grey"> Easy to use, built with modern technology.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <Button
                  asChild
                  className="bg-paypal-accent hover:bg-paypal-accent/90 text-paypal-accent-foreground px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/register">Try It Now</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-8 mt-12 text-white/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Demo Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm">Secure Transactions</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Easy Transfers</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section
          id="features"
          className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-paypal-primary/10 text-paypal-primary text-sm font-medium">
                ⚡ Key Features
              </div>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-6xl text-paypal-primary">
                Simple & Effective
              </h2>
              <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                A clean and user-friendly payment system with essential features for 
                sending, receiving, and managing digital transactions.
              </p>
            </div>
            
            <div className="mx-auto grid max-w-6xl gap-8 py-12 lg:grid-cols-3">
              <div className="group enhanced-card flex flex-col items-center space-y-4 text-center p-8 rounded-2xl bg-card animate-slide-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-paypal-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <DollarSign className="relative h-12 w-12 text-paypal-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-paypal-primary">
                  Send Money
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Send money to friends and family quickly and easily. 
                  Just enter their email and amount - it's that simple.
                </p>
                <div className="flex items-center gap-2 text-sm text-paypal-accent font-medium">
                  
                </div>
              </div>
              
              <div className="group enhanced-card flex flex-col items-center space-y-4 text-center p-8 rounded-2xl bg-card animate-slide-in" style={{animationDelay: '0.1s'}}>
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <ShieldCheck className="relative h-12 w-12 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-paypal-primary">
                  Secure & Safe
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your account and transactions are protected with secure authentication 
                  and encrypted data storage.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-500 font-medium">
                  
                </div>
              </div>
              
              <div className="group enhanced-card flex flex-col items-center space-y-4 text-center p-8 rounded-2xl bg-card animate-slide-in" style={{animationDelay: '0.2s'}}>
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Repeat2 className="relative h-12 w-12 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-paypal-primary">
                  Track Transactions
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  View your transaction history, check your balance, and 
                  manage your account with an intuitive dashboard.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-500 font-medium">
                </div>
              </div>
            </div>
            
            {/* Project Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 p-8 rounded-2xl bg-card/50 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-paypal-primary">100%</div>
                <div className="text-sm text-muted-foreground">Functional</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-paypal-primary">5+</div>
                <div className="text-sm text-muted-foreground">Core Features</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-paypal-primary">Modern</div>
                <div className="text-sm text-muted-foreground">Tech Stack</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-paypal-primary">Responsive</div>
                <div className="text-sm text-muted-foreground">Design</div>
              </div>
            </div>
          </div>
        </section>
        </main>
      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-paypal-accent" />
                <span className="text-2xl font-bold">PayClone</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                A student-built digital payment system demonstrating modern web development practices. 
                Simple, secure, and user-friendly money transfers.
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Features</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#features" className="text-gray-300 hover:text-white transition-colors text-sm">Send Money</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Receive Money</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Transaction History</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Money Requests</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Account Management</Link>
              </nav>
            </div>
            
            {/* Frontend */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Frontend</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Next.js</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">TypeScript</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Tailwind CSS</Link>
              </nav>
            </div>
            
            {/* Backend */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Backend</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Java</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Spring Boot</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Spring Security</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Apache Kafka</Link>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">MySQL</Link>
              </nav>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2025 PayClone - Personal Project</p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <span className="text-gray-400 text-sm">Built as a learning project</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
