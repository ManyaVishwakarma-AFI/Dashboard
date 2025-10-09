// import { useState } from "react";
// import { Link, useLocation } from "wouter";
// import { useMutation } from "@tanstack/react-query";
// import { useAuth } from "@/App";
// import { useToast } from "@/hooks/use-toast";
// import { apiRequest } from "@/lib/queryClient";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ChartLine, Github, Mail } from "lucide-react";

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// export default function Login() {
//   const [, setLocation] = useLocation();
//   const login = () => setLocation("/dashboard"); // Mock for demo - go directly to dashboard
//   const { toast } = useToast();
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: "",
//     password: ""
//   });

//   const loginMutation = useMutation({
//     mutationFn: async (data: LoginFormData) => {
//       // Mock login for demo - always success
//       return { user: { id: "demo-user", email: data.email } };
//     },
//     onSuccess: (data) => {
//       login(); // No need to pass user data for mock
//       toast({
//         title: "Welcome back!",
//         description: "Successfully logged in to EcomAI.",
//       });
//       setLocation("/dashboard");
//     },
//     onError: (error) => {
//       toast({
//         title: "Login failed",
//         description: error.message || "Invalid credentials",
//         variant: "destructive",
//       });
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       });
//       return;
//     }
//     loginMutation.mutate(formData);
//   };

//   const handleInputChange = (field: keyof LoginFormData) => (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setFormData(prev => ({ ...prev, [field]: e.target.value }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         {/* Logo and Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
//             <ChartLine className="text-primary-foreground h-8 w-8" />
//           </div>
//           <h1 className="text-3xl font-bold text-foreground mb-2">EcomAI</h1>
//           <p className="text-muted-foreground">AI-Powered E-commerce Analytics</p>
//         </div>

//         <Card className="border shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="text-2xl">Welcome Back</CardTitle>
//             <CardDescription>
//               Sign in to access your analytics dashboard
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent className="space-y-6">
//             {/* OAuth Buttons */}
//             <div className="space-y-3">
//               <Button 
//                 variant="outline" 
//                 className="w-full" 
//                 data-testid="button-google-oauth"
//                 disabled
//               >
//                 <Mail className="mr-2 h-4 w-4 text-red-500" />
//                 Continue with Google
//               </Button>
//               <Button 
//                 variant="outline" 
//                 className="w-full"
//                 data-testid="button-github-oauth"
//                 disabled
//               >
//                 <Github className="mr-2 h-4 w-4" />
//                 Continue with GitHub
//               </Button>
//             </div>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <Separator className="w-full" />
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="bg-card px-4 text-muted-foreground">
//                   or continue with email
//                 </span>
//               </div>
//             </div>

//             {/* Login Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="your@email.com"
//                   value={formData.email}
//                   onChange={handleInputChange("email")}
//                   data-testid="input-email"
//                   required
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={handleInputChange("password")}
//                   data-testid="input-password"
//                   required
//                 />
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="remember" data-testid="checkbox-remember" />
//                   <Label htmlFor="remember">Remember me</Label>
//                 </div>
//                 <Button variant="link" className="p-0 h-auto text-primary">
//                   Forgot password?
//                 </Button>
//               </div>

//               <Button 
//                 type="submit" 
//                 className="w-full" 
//                 disabled={loginMutation.isPending}
//                 data-testid="button-login"
//               >
//                 {loginMutation.isPending ? "Signing in..." : "Sign In"}
//               </Button>
//             </form>

//             <p className="text-center text-sm text-muted-foreground">
//               Don't have an account?{" "}
//               <Link href="/signup">
//                 <Button variant="link" className="p-0 h-auto text-primary font-medium">
//                   Sign up
//                 </Button>
//               </Link>
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// ============================================
// FILE: src/pages/login.tsx (UPDATED TO MATCH SIGNUP)
// ============================================
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartLine } from "lucide-react";
 
export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
 
    setIsLoading(true);
 
    // Simulate login
    setTimeout(() => {
      // Check if user exists in localStorage (from signup)
      const existingProfile = localStorage.getItem('userProfile');
     
      let user;
      if (existingProfile) {
        const profile = JSON.parse(existingProfile);
        user = {
          name: `${profile.firstName} ${profile.lastName}`,
          email: formData.email,
          businessName: profile.businessName,
          location: profile.location,
          businessInterests: profile.businessInterests || [],
          loggedIn: true
        };
      } else {
        // New user logging in
        user = {
          email: formData.email,
          name: formData.email.split('@')[0],
          loggedIn: true
        };
      }
     
      localStorage.setItem('user', JSON.stringify(user));
     
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
 
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to Amazon Reviews Analytics.",
      });
     
      setIsLoading(false);
      setLocation("/dashboard");
    }, 800);
  };
 
  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };
 
  const handleDemoLogin = () => {
    const user = {
      email: "demo@example.com",
      name: "Demo User",
      businessName: "Demo Business",
      location: "mumbai",
      businessInterests: ["electronics", "fashion", "home"],
      loggedIn: true
    };
    localStorage.setItem('user', JSON.stringify(user));
   
    toast({
      title: "Demo Login",
      description: "Logged in as demo user",
    });
   
    setLocation("/dashboard");
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <ChartLine className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Amazon Reviews Analytics</h1>
          <p className="text-muted-foreground">Real-time insights from your review data</p>
        </div>
 
        <Card className="border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your analytics dashboard
            </CardDescription>
          </CardHeader>
         
          <CardContent className="space-y-6">
            {/* Demo Login Button */}
            <Button
              variant="outline"
              className="w-full border-2 border-primary/50 hover:bg-primary/10"
              onClick={handleDemoLogin}
            >
              <ChartLine className="mr-2 h-4 w-4" />
              Continue as Demo User
            </Button>
 
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>
 
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  required
                />
              </div>
             
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  required
                />
              </div>
 
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember" className="cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="p-0 h-auto text-primary text-sm">
                  Forgot password?
                </Button>
              </div>
 
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
 
            {/* Signup Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup">
                  <Button variant="link" className="p-0 h-auto text-primary font-medium">
                    Create account
                  </Button>
                </Link>
              </p>
            </div>
 
            {/* Info Note */}
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                This is a demo. Any credentials work for testing, or use the demo button above.
              </p>
            </div>
          </CardContent>
        </Card>
 
        {/* Footer Links */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Powered by Amazon Reviews Database</p>
          <p className="mt-2">
            <Link href="/about">
              <Button variant="link" className="p-0 h-auto text-xs">About</Button>
            </Link>
            {" • "}
            <Button
              variant="link"
              className="p-0 h-auto text-xs"
              onClick={() => window.open('http://localhost:8000/docs', '_blank')}
            >
              API Docs
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
 