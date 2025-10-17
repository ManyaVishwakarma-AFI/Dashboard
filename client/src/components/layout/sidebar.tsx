// import { useState } from "react";
// import { Link, useLocation } from "wouter";
// import { useAuth } from "@/App";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { 
//   ChartLine, 
//   Home, 
//   Crown, 
//   Info, 
//   Settings, 
//   LogOut,
//   Menu,
//   X
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const NAVIGATION_ITEMS = [
//   { href: "/dashboard", label: "Dashboard", icon: Home },
//   { href: "/subscription", label: "Subscription", icon: Crown },
//   { href: "/about", label: "About", icon: Info },
//   { href: "/settings", label: "Settings", icon: Settings },
// ];

// export default function Sidebar() {
//   const [location] = useLocation();
//   const user = { firstName: "Demo", lastName: "User", subscriptionTier: "free" }; // Mock user for demo
//   const logout = () => {}; // No-op for demo
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const getUserInitials = () => {
//     if (!user) return "U";
//     return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
//   };

//   const getSubscriptionColor = (tier: string) => {
//     switch (tier) {
//       case "premium": return "bg-gradient-to-r from-yellow-400 to-orange-500";
//       case "basic": return "bg-primary";
//       default: return "bg-muted";
//     }
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {!isCollapsed && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setIsCollapsed(true)}
//         />
//       )}

//       <div 
//         className={cn(
//           "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transform transition-transform duration-300",
//           isCollapsed ? "w-16" : "w-64",
//           "lg:translate-x-0",
//           isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
//         )}
//         data-testid="sidebar"
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-border">
//           <div className="flex items-center justify-between">
//             <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
//               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
//                 <ChartLine className="text-primary-foreground h-5 w-5" />
//               </div>
//               {!isCollapsed && (
//                 <div>
//                   <h1 className="font-bold text-xl">EcomAI</h1>
//                   <p className="text-sm text-muted-foreground">Analytics</p>
//                 </div>
//               )}
//             </div>
            
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="lg:hidden"
//               data-testid="button-toggle-sidebar"
//             >
//               {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
//             </Button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 space-y-2 flex-1">
//           {NAVIGATION_ITEMS.map((item) => {
//             const Icon = item.icon;
//             const isActive = location === item.href || 
//               (item.href === "/dashboard" && location === "/");
            
//             return (
//               <Link key={item.href} href={item.href}>
//                 <Button
//                   variant={isActive ? "default" : "ghost"}
//                   className={cn(
//                     "w-full justify-start",
//                     isCollapsed && "justify-center px-2"
//                   )}
//                   data-testid={`nav-item-${item.label.toLowerCase()}`}
//                 >
//                   <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
//                   {!isCollapsed && <span>{item.label}</span>}
//                 </Button>
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Profile Section */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <div className={cn(
//             "flex items-center p-3 bg-muted rounded-lg",
//             isCollapsed && "justify-center"
//           )}>
//             <Avatar className="h-10 w-10">
//               <AvatarFallback className="bg-primary text-primary-foreground">
//                 {getUserInitials()}
//               </AvatarFallback>
//             </Avatar>
            
//             {!isCollapsed && (
//               <div className="flex-1 ml-3 min-w-0">
//                 <p className="font-medium text-sm truncate">
//                   {user?.firstName} {user?.lastName}
//                 </p>
//                 <div className="flex items-center space-x-2">
//                   <Badge 
//                     variant="secondary"
//                     className={cn(
//                       "text-xs",
//                       getSubscriptionColor(user?.subscriptionTier || "free")
//                     )}
//                   >
//                     {user?.subscriptionTier || "Free"} Plan
//                   </Badge>
//                 </div>
//               </div>
//             )}
            
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={logout}
//               className={cn(
//                 "text-muted-foreground hover:text-foreground",
//                 isCollapsed && "p-2"
//               )}
//               data-testid="button-logout"
//             >
//               <LogOut className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// ============================================
// FILE: src/components/layout/sidebar.tsx (UPDATED)
// ============================================
// import { useState, useEffect } from "react";
// import { Link, useLocation } from "wouter";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import {
//   ChartLine,
//   Home,
//   Info,
//   Settings,
//   LogOut,
//   Menu,
//   X
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useToast } from "@/hooks/use-toast";
 
// const NAVIGATION_ITEMS = [
//   { href: "/dashboard", label: "Dashboard", icon: Home },
//   { href: "/about", label: "About", icon: Info },
//   { href: "/settings", label: "Settings", icon: Settings },
// ];
 
// export default function Sidebar() {
//   const [location, setLocation] = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const { toast } = useToast();
 
//   useEffect(() => {
//     // Load user from localStorage
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, [location]); // Reload on location change
 
//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     localStorage.removeItem('userProfile');
//     localStorage.removeItem('userPreferences');
//     localStorage.removeItem('rememberMe');
   
//     toast({
//       title: "Logged out",
//       description: "You have been successfully logged out.",
//     });
   
//     setLocation('/login');
//   };
 
//   const getUserInitials = () => {
//     if (!user?.name) return "U";
//     const names = user.name.split(' ');
//     if (names.length >= 2) {
//       return `${names[0][0]}${names[1][0]}`.toUpperCase();
//     }
//     return user.name[0].toUpperCase();
//   };
 
//   return (
//     <>
//       {/* Mobile overlay */}
//       {!isCollapsed && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setIsCollapsed(true)}
//         />
//       )}
 
//       <div
//         className={cn(
//           "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transform transition-transform duration-300",
//           isCollapsed ? "w-16" : "w-64",
//           "lg:translate-x-0",
//           isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
//         )}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-border">
//           <div className="flex items-center justify-between">
//             <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
//               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
//                 <ChartLine className="text-primary-foreground h-5 w-5" />
//               </div>
//               {!isCollapsed && (
//                 <div>
//                   <h1 className="font-bold text-lg">Reviews</h1>
//                   <p className="text-xs text-muted-foreground">Analytics</p>
//                 </div>
//               )}
//             </div>
           
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="lg:hidden"
//             >
//               {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
//             </Button>
//           </div>
//         </div>
 
//         {/* Navigation */}
//         <nav className="p-4 space-y-2 flex-1">
//           {NAVIGATION_ITEMS.map((item) => {
//             const Icon = item.icon;
//             const isActive = location === item.href ||
//               (item.href === "/dashboard" && location === "/");
           
//             return (
//               <Link key={item.href} href={item.href}>
//                 <Button
//                   variant={isActive ? "default" : "ghost"}
//                   className={cn(
//                     "w-full justify-start",
//                     isCollapsed && "justify-center px-2"
//                   )}
//                 >
//                   <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
//                   {!isCollapsed && <span>{item.label}</span>}
//                 </Button>
//               </Link>
//             );
//           })}
//         </nav>
 
//         {/* User Profile Section */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <div className={cn(
//             "flex items-center p-3 bg-muted rounded-lg",
//             isCollapsed && "justify-center"
//           )}>
//             <Avatar className="h-10 w-10">
//               <AvatarFallback className="bg-primary text-primary-foreground">
//                 {getUserInitials()}
//               </AvatarFallback>
//             </Avatar>
           
//             {!isCollapsed && (
//               <div className="flex-1 ml-3 min-w-0">
//                 <p className="font-medium text-sm truncate">
//                   {user?.name || "User"}
//                 </p>
//                 {user?.businessName && (
//                   <p className="text-xs text-muted-foreground truncate">
//                     {user.businessName}
//                   </p>
//                 )}
//                 <Badge variant="secondary" className="text-xs mt-1">
//                   Free Plan
//                 </Badge>
//               </div>
//             )}
           
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleLogout}
//               className={cn(
//                 "text-muted-foreground hover:text-foreground",
//                 isCollapsed && "p-2"
//               )}
//               title="Logout"
//             >
//               <LogOut className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
 
 // ============================================
// FILE: src/components/layout/sidebar.tsx
// ============================================

// import { useState, useEffect } from "react";
// import { Link, useLocation } from "wouter";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import {
//   ChartLine,
//   Home,
//   Crown,
//   Info,
//   Settings,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useToast } from "@/hooks/use-toast";

// const NAVIGATION_ITEMS = [
//   { href: "/dashboard", label: "Dashboard", icon: Home },
//   { href: "/subscription", label: "Subscription", icon: Crown },
//   { href: "/about", label: "About", icon: Info },
//   { href: "/settings", label: "Settings", icon: Settings },
// ];

// export default function Sidebar() {
//   const [location, setLocation] = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const { toast } = useToast();

//   // ✅ Load user from localStorage on mount or route change
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, [location]);

//   // ✅ Logout handler
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("userProfile");
//     localStorage.removeItem("userPreferences");
//     localStorage.removeItem("rememberMe");
//     localStorage.removeItem("access_token");

//     toast({
//       title: "Logged out",
//       description: "You have been successfully logged out.",
//     });

//     setLocation("/login");
//   };

//   // ✅ Helper to get user initials
//   const getUserInitials = () => {
//     if (!user) return "U";
//     const first = user.firstName || user.name?.split(" ")[0] || "";
//     const last = user.lastName || user.name?.split(" ")[1] || "";
//     return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "U";
//   };

//   // ✅ Dynamic color for subscription tier
//   const getSubscriptionColor = (tier: string) => {
//     switch (tier?.toLowerCase()) {
//       case "premium":
//         return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
//       case "basic":
//         return "bg-primary text-white";
//       default:
//         return "bg-muted text-foreground";
//     }
//   };

//   return (
//     <>
//       {/* Overlay for mobile */}
//       {!isCollapsed && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setIsCollapsed(true)}
//         />
//       )}

//       <div
//         className={cn(
//           "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transform transition-transform duration-300",
//           isCollapsed ? "w-16" : "w-64",
//           "lg:translate-x-0",
//           isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
//         )}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-border">
//           <div className="flex items-center justify-between">
//             <div
//               className={cn(
//                 "flex items-center space-x-3",
//                 isCollapsed && "justify-center"
//               )}
//             >
//               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
//                 <ChartLine className="text-primary-foreground h-5 w-5" />
//               </div>
//               {!isCollapsed && (
//                 <div>
//                   <h1 className="font-bold text-xl">EcomAI</h1>
//                   <p className="text-sm text-muted-foreground">Analytics</p>
//                 </div>
//               )}
//             </div>

//             {/* Toggle Sidebar (mobile only) */}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="lg:hidden"
//             >
//               {isCollapsed ? (
//                 <Menu className="h-4 w-4" />
//               ) : (
//                 <X className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 space-y-2 flex-1">
//           {NAVIGATION_ITEMS.map((item) => {
//             const Icon = item.icon;
//             const isActive =
//               location === item.href ||
//               (item.href === "/dashboard" && location === "/");

//             return (
//               <Link key={item.href} href={item.href}>
//                 <Button
//                   variant={isActive ? "default" : "ghost"}
//                   className={cn(
//                     "w-full justify-start",
//                     isCollapsed && "justify-center px-2"
//                   )}
//                 >
//                   <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
//                   {!isCollapsed && <span>{item.label}</span>}
//                 </Button>
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Profile Section */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <div
//             className={cn(
//               "flex items-center p-3 bg-muted rounded-lg",
//               isCollapsed && "justify-center"
//             )}
//           >
//             <Avatar className="h-10 w-10">
//               <AvatarFallback className="bg-primary text-primary-foreground">
//                 {getUserInitials()}
//               </AvatarFallback>
//             </Avatar>

//             {!isCollapsed && (
//               <div className="flex-1 ml-3 min-w-0">
//                 <p className="font-medium text-sm truncate">
//                   {user
//                     ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
//                       user.name ||
//                       "User"
//                     : "User"}
//                 </p>
//                 <Badge
//                   variant="secondary"
//                   className={cn(
//                     "text-xs mt-1",
//                     getSubscriptionColor(user?.subscriptionTier || "Free")
//                   )}
//                 >
//                   {user?.subscriptionTier
//                     ? `${user.subscriptionTier} Plan`
//                     : "Free Plan"}
//                 </Badge>
//               </div>
//             )}

//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={handleLogout}
//               className={cn(
//                 "text-muted-foreground hover:text-foreground",
//                 isCollapsed && "p-2"
//               )}
//               title="Logout"
//             >
//               <LogOut className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ChartLine,
  Home,
  Crown,
  Info,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  TrendingUp,
  Package,
  Users,
  PieChart,
  MapPin,
  DollarSign,
  Star,
  Filter,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const SECTIONS = [
  {
    label: "Navigation",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/subscription", label: "Subscription", icon: Crown },
      { href: "/about", label: "About", icon: Info },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    label: "Analytics",
    items: [
      { href: "/sales", label: "Sales Analytics", icon: TrendingUp },
      { href: "/revenue", label: "Revenue", icon: DollarSign },
      { href: "/categories", label: "Categories", icon: PieChart },
      { href: "/customers", label: "Customers", icon: Users },
    ],
  },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [location]);

  const handleLogout = () => {
    ["user", "userProfile", "userPreferences", "rememberMe", "access_token"].forEach(k =>
      localStorage.removeItem(k)
    );
    toast({ title: "Logged out", description: "You have been successfully logged out." });
    setLocation("/login");
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const first = user.firstName || user.name?.split(" ")[0] || "";
    const last = user.lastName || user.name?.split(" ")[1] || "";
    return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "U";
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case "premium": return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "basic": return "bg-primary text-white";
      default: return "bg-muted text-foreground";
    }
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/" || location === "/dashboard";
    return location === href;
  };

  return (
    <>
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsCollapsed(true)} />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transform transition-transform duration-300 flex flex-col",
          isCollapsed ? "w-16 -translate-x-full lg:translate-x-0" : "w-64 translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className={cn("flex items-center space-x-3", isCollapsed && "justify-center")}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ChartLine className="text-primary-foreground h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-xl">EcomAI</h1>
                <p className="text-sm text-muted-foreground">Analytics Dashboard</p>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="lg:hidden">
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {SECTIONS.map(section => (
            <div key={section.label}>
              {!isCollapsed && <p className="text-sidebar-foreground/60 font-semibold mb-2">{section.label}</p>}
              <div className="space-y-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className={cn("w-full justify-start", isCollapsed && "justify-center px-2")}
                      >
                        <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Profile */}
        <div className="p-4 border-t border-border">
          <div className={cn("flex items-center p-3 bg-muted rounded-lg", isCollapsed && "justify-center")}>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">{getUserInitials()}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 ml-3 min-w-0">
                <p className="font-medium text-sm truncate">
                  {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "User" : "User"}
                </p>
                <Badge variant="secondary" className={cn("text-xs mt-1", getSubscriptionColor(user?.subscriptionTier || "Free"))}>
                  {user?.subscriptionTier ? `${user.subscriptionTier} Plan` : "Free Plan"}
                </Badge>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout} className={cn("text-muted-foreground hover:text-foreground", isCollapsed && "p-2")} title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
