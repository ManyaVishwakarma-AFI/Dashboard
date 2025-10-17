// import { Switch, Route } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { useState, useEffect, createContext, useContext } from "react";

// // Pages
// import Login from "@/pages/login";
// import Signup from "@/pages/signup";
// import Dashboard from "@/pages/dashboard";
// import Subscription from "@/pages/subscription";
// import About from "@/pages/about";
// import Settings from "@/pages/settings";
// import NotFound from "@/pages/not-found";

// // Context for user authentication
// interface User {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   businessName?: string;
//   location?: string;
//   subscriptionTier: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (user: User) => void;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // Check for stored user session
//     const storedUser = localStorage.getItem('ecomai_user');
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (error) {
//         localStorage.removeItem('ecomai_user');
//       }
//     }
//   }, []);

//   const login = (userData: User) => {
//     setUser(userData);
//     localStorage.setItem('ecomai_user', JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('ecomai_user');
//   };

//   const isAuthenticated = !!user;

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// function Router() {
//   return (
//     <Switch>
//       <Route path="/" component={Dashboard} />
//       <Route path="/dashboard" component={Dashboard} />
//       <Route path="/subscription" component={Subscription} />
//       <Route path="/about" component={About} />
//       <Route path="/settings" component={Settings} />
//       <Route path="/login" component={Login} />
//       <Route path="/signup" component={Signup} />
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <AuthProvider>
//           <Toaster />
//           <Router />
//         </AuthProvider>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;



import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
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

// Analytics Pages
import Sales from "@/pages/sales";
import Revenue from "@/pages/revenue";
import Categories from "@/pages/categories";
import Customers from "@/pages/customers";
import CategoryProducts from "@/pages/category-products";
import ProductDetails from "@/pages/product-details";

// Auth Context
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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("ecomai_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("ecomai_user");
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("ecomai_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecomai_user");
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
      {/* Analytics Pages */}
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/sales" component={Sales} />
      <Route path="/revenue" component={Revenue} />
      <Route path="/categories" component={Categories} />
      <Route path="/category-products/:category" component={CategoryProducts} />
      <Route path="/product/:productName" component={ProductDetails} /> 
      <Route path="/customers" component={Customers} />

      {/* Tools Pages */}
      <Route path="/subscription" component={Subscription} />
      <Route path="/about" component={About} />
      <Route path="/settings" component={Settings} />

      {/* Auth Pages */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />

      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
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
