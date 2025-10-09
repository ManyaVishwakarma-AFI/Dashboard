
// // ============================================
// // FILE: src/App.tsx (UPDATED ROUTING)
// // ============================================
// import { useEffect } from "react";
// import { Route, Switch, useLocation } from "wouter";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { queryClient } from "@/lib/queryClient";
// import { Toaster } from "@/components/ui/toaster";

// // Pages
// import Login from "@/pages/login";
// import Signup from "@/pages/signup";
// import Dashboard from "@/pages/dashboard";
// import Subscription from "@/pages/subscription";
// import About from "@/pages/about";
// import Settings from "@/pages/settings";
// import NotFound from "@/pages/not-found";



// function App() {
//   const [location, setLocation] = useLocation();

//   // Auth check - redirect to login if not authenticated
//   useEffect(() => {
//     const user = localStorage.getItem('user');
//     const publicRoutes = ['/login', '/signup', '/about'];
    
//     // If not logged in and trying to access protected route
//     if (!user && !publicRoutes.includes(location)) {
//       setLocation('/login');
//     }
    
//     // If logged in and on login/signup page, redirect to dashboard
//     if (user && (location === '/login' || location === '/signup')) {
//       const userData = JSON.parse(user);
//       if (userData.loggedIn) {
//         setLocation('/dashboard');
//       }
//     }
//   }, [location, setLocation]);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <Switch>
//         {/* Public Routes */}
//         <Route path="/login" component={Login} />
//         <Route path="/signup" component={Signup} />
//         <Route path="/about" component={About} />
        
//         {/* Protected Routes */}
//         <Route path="/" component={Dashboard} />
//         <Route path="/dashboard" component={Dashboard} />
//         <Route path="/settings" component={Settings} />
        
//         {/* 404 */}
//         <Route component={NotFound} />
//       </Switch>
//       <Toaster />
//     </QueryClientProvider>
//   );
// }

// export default App;



import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect, createContext, useContext } from "react";
 
// Pages
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Subscription from "@/pages/subscription";
import About from "@/pages/about";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
 
// Context for user authentication
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  location?: string;
  subscriptionTier: string;
}
 
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}
 
const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
 
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
 
  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ecomai_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('ecomai_user');
      }
    }
  }, []);
 
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('ecomai_user', JSON.stringify(userData));
  };
 
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecomai_user');
  };
 
  const isAuthenticated = !!user;
 
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
 
function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/about" component={About} />
      <Route path="/settings" component={Settings} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}
 
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
 
export default App;
 
 
 
 
 
