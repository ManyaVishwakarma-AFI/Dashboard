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
 
  // UPDATE THIS TO YOUR SERVER IP
  const API_BASE_URL = "http://localhost:8000";
 
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
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    if (!agreedToTerms) {
      toast({ title: "Terms required", description: "Please agree to the Terms.", variant: "destructive" });
      return;
    }
 
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({ title: "Missing fields", description: "Fill all required fields.", variant: "destructive" });
      return;
    }
 
    if (!formData.location) {
      toast({ title: "Location required", description: "Select your location.", variant: "destructive" });
      return;
    }
 
    if (formData.businessInterests.length === 0) {
      toast({ title: "Select interests", description: "Select at least one.", variant: "destructive" });
      return;
    }
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Invalid Email", description: "Enter valid email.", variant: "destructive" });
      return;
    }
 
    if (formData.password.length < 6) {
      toast({ title: "Password too short", description: "Min 6 characters.", variant: "destructive" });
      return;
    }
 
    setIsLoading(true);
 
    try {
      console.log("📤 Sending to:", `${API_BASE_URL}/users/signup`);
     
      const response = await fetch(`${API_BASE_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          business_name: formData.businessName || null,
          location: formData.location,
          business_interests: formData.businessInterests
        }),
      });
 
      console.log("📥 Status:", response.status);
 
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error:", errorData);
        throw new Error(errorData.detail || "Signup failed");
      }
 
      const userData = await response.json();
      console.log("✅ Success:", userData);
 
      toast({
        title: "Account created!",
        description: `Welcome, ${userData.first_name}!`,
      });
 
      localStorage.setItem("user", JSON.stringify({
        id: userData.id,
        name: `${userData.first_name} ${userData.last_name}`,
        email: userData.email,
        businessName: userData.business_name,
        location: userData.location,
        businessInterests: userData.business_interests,
        loggedIn: true,
        createdAt: userData.created_at
      }));
     
      setTimeout(() => setLocation("/dashboard"), 500);
 
    } catch (err: any) {
      console.error("❌ Error:", err);
      toast({ title: "Signup failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <ChartLine className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Amazon Reviews Analytics</h1>
          <p className="text-muted-foreground">Start your analytics journey</p>
        </div>
 
        <Card className="border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join and get personalized insights</CardDescription>
          </CardHeader>
 
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="John" value={formData.firstName} onChange={handleInputChange("firstName")} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleInputChange("lastName")} required />
                </div>
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange("email")} required />
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange("password")} required minLength={6} />
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name (Optional)</Label>
                <Input id="businessName" placeholder="Your Business" value={formData.businessName} onChange={handleInputChange("businessName")} />
              </div>
 
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={handleLocationChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
 
              <div className="space-y-3">
                <Label className="text-base">Business Interests *</Label>
                <p className="text-sm text-muted-foreground">Select at least one</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-4 border rounded-lg bg-muted/30">
                  {BUSINESS_INTERESTS.map((interest) => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox id={interest.id} checked={formData.businessInterests.includes(interest.id)} onCheckedChange={() => handleInterestToggle(interest.id)} />
                      <Label htmlFor={interest.id} className="text-sm font-normal cursor-pointer">{interest.label}</Label>
                    </div>
                  ))}
                </div>
                {formData.businessInterests.length > 0 && (
                  <p className="text-sm text-primary font-medium">
                    ✓ {formData.businessInterests.length} selected
                  </p>
                )}
              </div>
 
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked === true)} />
                <Label htmlFor="terms" className="text-sm cursor-pointer">
                  I agree to <span className="text-primary underline">Terms</span> and <span className="text-primary underline">Privacy</span>
                </Label>
              </div>
 
              <Button type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </form>
 
            <p className="text-center text-sm text-muted-foreground mt-6">
              Have an account? <Link href="/login"><Button variant="link" className="p-0 h-auto text-primary">Sign in</Button></Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}