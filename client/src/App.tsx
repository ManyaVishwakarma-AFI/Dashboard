
// ============================================
// FILE: src/App.tsx (UPDATED ROUTING)
// ============================================
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import About from "@/pages/about";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function App() {
  const [location, setLocation] = useLocation();

  // Auth check - redirect to login if not authenticated
  useEffect(() => {
    const user = localStorage.getItem('user');
    const publicRoutes = ['/login', '/signup', '/about'];
    
    // If not logged in and trying to access protected route
    if (!user && !publicRoutes.includes(location)) {
      setLocation('/login');
    }
    
    // If logged in and on login/signup page, redirect to dashboard
    if (user && (location === '/login' || location === '/signup')) {
      const userData = JSON.parse(user);
      if (userData.loggedIn) {
        setLocation('/dashboard');
      }
    }
  }, [location, setLocation]);

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        {/* Public Routes */}
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/about" component={About} />
        
        {/* Protected Routes */}
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/settings" component={Settings} />
        
        {/* 404 */}
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;