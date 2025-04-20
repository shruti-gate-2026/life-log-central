
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Calendar } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 container max-w-5xl py-4 container-padding">
        {children}
      </main>
      
      {/* Bottom Navigation Bar */}
      <div className="sticky bottom-0 w-full bg-background border-t border-border py-2 px-4">
        <nav className="flex justify-around max-w-md mx-auto">
          <Link 
            to="/" 
            className={`flex flex-col items-center p-2 ${location.pathname === '/' 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link 
            to="/daily" 
            className={`flex flex-col items-center p-2 ${location.pathname === '/daily' 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Calendar size={24} />
            <span className="text-xs mt-1">Daily</span>
          </Link>
          <Link 
            to="/dashboard" 
            className={`flex flex-col items-center p-2 ${location.pathname === '/dashboard' 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'}`}
          >
            <BarChart2 size={24} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
