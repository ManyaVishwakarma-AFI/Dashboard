import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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

const TARGET_MARKETS = [
  { value: "national", label: "India (National)" },
  { value: "regional", label: "Regional (West India)" },
  { value: "local", label: "Local (Mumbai Metro)" },
];

export default function Settings() {
  const { toast } = useToast();
  
  // Local state only - no backend API calls since your backend doesn't have user endpoints
  const [profileData, setProfileData] = useState({
    firstName: "Demo",
    lastName: "User",
    email: "demo@example.com",
    businessName: "Demo Store",
    location: "mumbai",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    priceAlerts: true,
    trendAlerts: false,
    targetMarket: "national",
    shareUsageData: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving with local storage
    setIsSaving(true);
    
    setTimeout(() => {
      // Save to localStorage for persistence
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been saved locally.",
      });
    }, 500);
  };

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfileData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleLocationChange = (value: string) => {
    setProfileData(prev => ({ ...prev, location: value }));
  };

  const handlePreferenceChange = (field: string) => (checked: boolean) => {
    setPreferences(prev => ({ ...prev, [field]: checked }));
  };

  const handleExportData = async () => {
    try {
      // Export reviews data from your backend
      const response = await fetch('http://localhost:8000/Amazon_Reviews/reviews?limit=1000');
      const data = await response.json();
      
      // Create CSV or JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `amazon-reviews-export-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported",
        description: "Your reviews data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetSettings = () => {
    setProfileData({
      firstName: "Demo",
      lastName: "User",
      email: "demo@example.com",
      businessName: "Demo Store",
      location: "mumbai",
    });
    
    setPreferences({
      emailNotifications: true,
      priceAlerts: true,
      trendAlerts: false,
      targetMarket: "national",
      shareUsageData: true,
    });
    
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userPreferences');
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold" data-testid="text-pageTitle">
              Settings
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage your preferences and configurations
            </p>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Info Banner */}
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Settings are saved locally in your browser. 
                  Your backend focuses on Amazon Reviews data and doesn't include user management.
                </p>
              </CardContent>
            </Card>

            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Profile Settings
                  <Badge variant="secondary">Local Storage</Badge>
                </CardTitle>
                <CardDescription>
                  Update your personal information (saved locally)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange("firstName")}
                        data-testid="input-firstName"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange("lastName")}
                        data-testid="input-lastName"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleInputChange("email")}
                        data-testid="input-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={profileData.businessName}
                        onChange={handleInputChange("businessName")}
                        data-testid="input-businessName"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Primary Location</Label>
                    <Select value={profileData.location} onValueChange={handleLocationChange}>
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

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={isSaving}
                      data-testid="button-save-profile"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleResetSettings}
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Display Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Display Preferences</CardTitle>
                <CardDescription>
                  Configure how you want to view data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Show Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Display notification indicators in the interface
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={handlePreferenceChange("emailNotifications")}
                    data-testid="switch-email-notifications"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Price Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Highlight products with significant rating changes
                    </p>
                  </div>
                  <Switch
                    checked={preferences.priceAlerts}
                    onCheckedChange={handlePreferenceChange("priceAlerts")}
                    data-testid="switch-price-alerts"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Trend Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Highlight trending products in dashboard
                    </p>
                  </div>
                  <Switch
                    checked={preferences.trendAlerts}
                    onCheckedChange={handlePreferenceChange("trendAlerts")}
                    data-testid="switch-trend-alerts"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Target Market */}
            <Card>
              <CardHeader>
                <CardTitle>Target Market Focus</CardTitle>
                <CardDescription>
                  Choose your primary market focus
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Market</Label>
                  <Select 
                    value={preferences.targetMarket} 
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, targetMarket: value }))}
                  >
                    <SelectTrigger data-testid="select-target-market">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_MARKETS.map((market) => (
                        <SelectItem key={market.value} value={market.value}>
                          {market.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Export your Amazon reviews data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="outline"
                    onClick={handleExportData}
                    data-testid="button-export-data"
                  >
                    Export Reviews Data (JSON)
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "API Documentation",
                        description: "Access API docs at http://localhost:8000/docs",
                      });
                      window.open('http://localhost:8000/docs', '_blank');
                    }}
                  >
                    View API Documentation
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Export data directly from your Amazon Reviews database via the API
                </p>
              </CardContent>
            </Card>

            {/* Backend Info */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">Backend Connection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Endpoint:</span>
                  <span className="font-mono">http://localhost:8000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database:</span>
                  <span className="font-mono">Amazon_Reviews</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Endpoints:</span>
                  <span>/Amazon_Reviews/*</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}