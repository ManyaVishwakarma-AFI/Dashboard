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
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ChartLine } from "lucide-react";

// interface SignupFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   businessName: string;
//   location: string;
// }

// const LOCATIONS = [
//   { value: "mumbai", label: "Mumbai, India" },
//   { value: "delhi", label: "Delhi, India" },
//   { value: "bangalore", label: "Bangalore, India" },
//   { value: "chennai", label: "Chennai, India" },
//   { value: "kolkata", label: "Kolkata, India" },
//   { value: "pune", label: "Pune, India" },
//   { value: "hyderabad", label: "Hyderabad, India" },
//   { value: "other", label: "Other" },
// ];

// export default function Signup() {
//   const [, setLocation] = useLocation();
//   const { login } = useAuth();
//   const { toast } = useToast();
//   const [formData, setFormData] = useState<SignupFormData>({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     businessName: "",
//     location: ""
//   });
//   const [agreedToTerms, setAgreedToTerms] = useState(false);

//   const signupMutation = useMutation({
//     mutationFn: async (data: SignupFormData) => {
//       const response = await apiRequest("POST", "/api/auth/signup", data);
//       return response.json();
//     },
//     onSuccess: (data) => {
//       login(data.user);
//       toast({
//         title: "Account created!",
//         description: "Welcome to EcomAI. Let's get started!",
//       });
//       setLocation("/dashboard");
//     },
//     onError: (error) => {
//       toast({
//         title: "Signup failed",
//         description: error.message || "Failed to create account",
//         variant: "destructive",
//       });
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!agreedToTerms) {
//       toast({
//         title: "Terms required",
//         description: "Please agree to the Terms of Service and Privacy Policy.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
//       toast({
//         title: "Missing fields",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     signupMutation.mutate(formData);
//   };

//   const handleInputChange = (field: keyof SignupFormData) => (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setFormData(prev => ({ ...prev, [field]: e.target.value }));
//   };

//   const handleLocationChange = (value: string) => {
//     setFormData(prev => ({ ...prev, location: value }));
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
//           <p className="text-muted-foreground">Start your analytics journey</p>
//         </div>

//         <Card className="border shadow-lg">
//           <CardHeader className="text-center">
//             <CardTitle className="text-2xl">Create Account</CardTitle>
//             <CardDescription>
//               Join thousands of sellers using AI-powered analytics
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="firstName">First Name</Label>
//                   <Input
//                     id="firstName"
//                     placeholder="John"
//                     value={formData.firstName}
//                     onChange={handleInputChange("firstName")}
//                     data-testid="input-firstName"
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="lastName">Last Name</Label>
//                   <Input
//                     id="lastName"
//                     placeholder="Doe"
//                     value={formData.lastName}
//                     onChange={handleInputChange("lastName")}
//                     data-testid="input-lastName"
//                     required
//                   />
//                 </div>
//               </div>

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

//               <div className="space-y-2">
//                 <Label htmlFor="businessName">Business Name (Optional)</Label>
//                 <Input
//                   id="businessName"
//                   placeholder="Your Business"
//                   value={formData.businessName}
//                   onChange={handleInputChange("businessName")}
//                   data-testid="input-businessName"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="location">Location</Label>
//                 <Select value={formData.location} onValueChange={handleLocationChange}>
//                   <SelectTrigger data-testid="select-location">
//                     <SelectValue placeholder="Select your location" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {LOCATIONS.map((location) => (
//                       <SelectItem key={location.value} value={location.value}>
//                         {location.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex items-start space-x-2">
//                 <Checkbox
//                   id="terms"
//                   checked={agreedToTerms}
//                   onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
//                   data-testid="checkbox-terms"
//                 />
//                 <Label htmlFor="terms" className="text-sm leading-5">
//                   I agree to the{" "}
//                   <Button variant="link" className="p-0 h-auto text-primary">
//                     Terms of Service
//                   </Button>{" "}
//                   and{" "}
//                   <Button variant="link" className="p-0 h-auto text-primary">
//                     Privacy Policy
//                   </Button>
//                 </Label>
//               </div>

//               <Button 
//                 type="submit" 
//                 className="w-full" 
//                 disabled={signupMutation.isPending}
//                 data-testid="button-signup"
//               >
//                 {signupMutation.isPending ? "Creating Account..." : "Create Account"}
//               </Button>
//             </form>

//             <p className="text-center text-sm text-muted-foreground mt-6">
//               Already have an account?{" "}
//               <Link href="/login">
//                 <Button variant="link" className="p-0 h-auto text-primary font-medium">
//                   Sign in
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
// FILE: src/pages/signup.tsx (UPDATED VERSION)
// ============================================
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChartLine } from "lucide-react";
 
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  businessName: string;
  location: string;
  businessInterests: string[];
}
 
const LOCATIONS = [
  { value: "mumbai", label: "Mumbai, India" },
  { value: "delhi", label: "Delhi, India" },
  { value: "bangalore", label: "Bangalore, India" },
  { value: "chennai", label: "Chennai, India" },
  { value: "kolkata", label: "Kolkata, India" },
  { value: "pune", label: "Pune, India" },
  { value: "hyderabad", label: "Hyderabad, India" },
  { value: "other", label: "Other" },
];
 
const BUSINESS_INTERESTS = [
  { id: "electronics", label: "Electronics & Technology" },
  { id: "fashion", label: "Fashion & Apparel" },
  { id: "home", label: "Home & Kitchen" },
  { id: "beauty", label: "Beauty & Personal Care" },
  { id: "sports", label: "Sports & Fitness" },
  { id: "books", label: "Books & Media" },
  { id: "automotive", label: "Automotive" },
  { id: "health", label: "Health & Wellness" },
  { id: "toys", label: "Toys & Games" },
  { id: "grocery", label: "Grocery & Food" },
  { id: "office", label: "Office Supplies" },
  { id: "pet", label: "Pet Supplies" },
];
 
export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    businessName: "",
    location: "",
    businessInterests: []
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    // Validation
    if (!agreedToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }
 
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
 
    if (formData.businessInterests.length === 0) {
      toast({
        title: "Select Interest Area",
        description: "Please select at least one business interest area.",
        variant: "destructive",
      });
      return;
    }
 
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
 
    setIsLoading(true);
 
    // Simulate account creation
    setTimeout(() => {
      // Create user object
      const user = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        businessName: formData.businessName,
        location: formData.location,
        businessInterests: formData.businessInterests,
        loggedIn: true,
        createdAt: new Date().toISOString()
      };
     
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userProfile', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        businessName: formData.businessName,
        location: formData.location,
        businessInterests: formData.businessInterests
      }));
 
      toast({
        title: "Account created!",
        description: "Welcome to Amazon Reviews Analytics.",
      });
     
      setIsLoading(false);
      setLocation("/dashboard");
    }, 800);
  };
 
  const handleInputChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };
 
  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }));
  };
 
  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => {
      const interests = prev.businessInterests.includes(interestId)
        ? prev.businessInterests.filter(id => id !== interestId)
        : [...prev.businessInterests, interestId];
      return { ...prev, businessInterests: interests };
    });
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <ChartLine className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Amazon Reviews Analytics</h1>
          <p className="text-muted-foreground">Start your analytics journey</p>
        </div>
 
        <Card className="border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join and get personalized insights for your business
            </CardDescription>
          </CardHeader>
         
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange("firstName")}
                    data-testid="input-firstName"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange("lastName")}
                    data-testid="input-lastName"
                    required
                  />
                </div>
              </div>
 
              {/* Email & Password */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  data-testid="input-email"
                  required
                />
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  data-testid="input-password"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 6 characters (for demo, any password works)
                </p>
              </div>
 
              {/* Business Info */}
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name (Optional)</Label>
                <Input
                  id="businessName"
                  placeholder="Your Business"
                  value={formData.businessName}
                  onChange={handleInputChange("businessName")}
                  data-testid="input-businessName"
                />
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={handleLocationChange}>
                  <SelectTrigger data-testid="select-location">
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
 
              {/* Business Interests - NEW */}
              <div className="space-y-3">
                <Label className="text-base">Business Interest Areas *</Label>
                <p className="text-sm text-muted-foreground">
                  Select categories you want to analyze (choose at least one)
                </p>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border rounded-lg bg-muted/30">
                  {BUSINESS_INTERESTS.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest.id}
                        checked={formData.businessInterests.includes(interest.id)}
                        onCheckedChange={() => handleInterestToggle(interest.id)}
                      />
                      <Label
                        htmlFor={interest.id}
                        className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {interest.label}
                      </Label>
                    </div>
                  ))}
                </div>
 
                {formData.businessInterests.length > 0 && (
                  <p className="text-sm text-primary font-medium">
                    ✓ {formData.businessInterests.length} area{formData.businessInterests.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
 
              {/* Terms Checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  data-testid="checkbox-terms"
                />
                <Label htmlFor="terms" className="text-sm leading-5 cursor-pointer">
                  I agree to the{" "}
                  <span className="text-primary underline">Terms of Service</span>
                  {" "}and{" "}
                  <span className="text-primary underline">Privacy Policy</span>
                </Label>
              </div>
 
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
                data-testid="button-signup"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
 
            {/* Login Link */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link href="/login">
                <Button variant="link" className="p-0 h-auto text-primary font-medium">
                  Sign in
                </Button>
              </Link>
            </p>
 
            {/* Info Note */}
            <div className="text-center pt-4 border-t mt-6">
              <p className="text-xs text-muted-foreground">
                Your preferences will help customize your analytics dashboard with relevant insights.
              </p>
            </div>
          </CardContent>
        </Card>
 
        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Get personalized insights based on your business interests</p>
        </div>
      </div>
    </div>
  );
}
 