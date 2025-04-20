
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BarChart2, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Don't show navigation for auth page
  if (location.pathname === '/auth') {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Bar */}
      {user && (
        <div className="border-b border-border py-2 px-4">
          <div className="container max-w-5xl mx-auto flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container max-w-5xl py-4 container-padding">
        {children}
      </main>
      
      {/* Bottom Navigation Bar */}
      {user && (
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
      )}
    </div>
  );
}
