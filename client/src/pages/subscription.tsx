import { useState } from "react";
import { useAuth  } from "@/App";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Zap } from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  limitations: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Basic dashboard access",
      "100 product tracking",
      "Basic AI insights",
      "Weekly reports",
      "Community support"
    ],
    limitations: [
      "Advanced analytics",
      "Real-time data",
      "Premium AI features",
      "Priority support"
    ]
  },
  {
    id: "basic",
    name: "Basic",
    price: 20,
    description: "Ideal for growing businesses",
    icon: <Crown className="h-6 w-6" />,
    isPopular: true,
    features: [
      "All Free features",
      "1,000 product tracking",
      "Advanced AI insights",
      "Daily reports",
      "Basic competitor analysis",
      "Email support"
    ],
    limitations: [
      "Real-time alerts",
      "Custom integrations",
      "Priority support",
      "Advanced analytics"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 100,
    description: "For serious e-commerce professionals",
    icon: <Crown className="h-6 w-6 text-yellow-500" />,
    features: [
      "All Basic features",
      "Unlimited product tracking",
      "Advanced AI chatbot",
      "Real-time data & alerts",
      "Full competitor analysis",
      "Custom reports & API access",
      "Priority support",
      "Advanced analytics",
      "Custom integrations"
    ],
    limitations: []
  }
];

export default function Subscription() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(user?.subscriptionTier || "free");

  const handleUpgrade = (planId: string) => {
    // In a real app, this would integrate with a payment processor
    console.log(`Upgrading to ${planId} plan`);
    setSelectedPlan(planId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold" data-testid="text-pageTitle">
              Subscription Plans
            </h2>
            <p className="text-sm text-muted-foreground">
              Scale your e-commerce analytics with AI-powered insights
            </p>
          </div>
        </header>

        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-muted-foreground text-lg">
                Unlock the full potential of AI-powered e-commerce analytics
              </p>
            </div>

            {/* Subscription Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`relative transition-all duration-300 hover:shadow-lg ${
                    plan.isPopular ? 'ring-2 ring-primary' : ''
                  } ${selectedPlan === plan.id ? 'bg-accent/50' : ''}`}
                  data-testid={`card-plan-${plan.id}`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        {plan.icon}
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold mb-1">
                      ₹{plan.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /month
                      </span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-center opacity-60">
                          <X className="h-4 w-4 text-red-400 mr-3 flex-shrink-0" />
                          <span className="text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      {selectedPlan === plan.id ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          disabled
                          data-testid={`button-current-${plan.id}`}
                        >
                          Current Plan
                        </Button>
                      ) : plan.id === "free" ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleUpgrade(plan.id)}
                          data-testid={`button-downgrade-${plan.id}`}
                        >
                          Downgrade to Free
                        </Button>
                      ) : (
                        <Button 
                          className={`w-full ${
                            plan.id === "premium" 
                              ? "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90" 
                              : ""
                          }`}
                          onClick={() => handleUpgrade(plan.id)}
                          data-testid={`button-upgrade-${plan.id}`}
                        >
                          {plan.id === "basic" ? "Upgrade to Basic" : "Upgrade to Premium"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enterprise Section */}
            <Card className="bg-muted/50">
              <CardContent className="text-center p-8">
                <h3 className="text-xl font-semibold mb-2">Need a Custom Solution?</h3>
                <p className="text-muted-foreground mb-6">
                  Contact us for enterprise-grade analytics with dedicated support, custom integrations, and tailored features for your business.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" data-testid="button-contact-sales">
                    Contact Sales
                  </Button>
                  <Button variant="outline" data-testid="button-request-demo">
                    Request Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-6 text-center">Frequently Asked Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Can I change my plan anytime?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
                    <p className="text-sm text-muted-foreground">
                      We accept all major credit cards, UPI, and bank transfers for Indian customers.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Is my data secure?</h4>
                    <p className="text-sm text-muted-foreground">
                      Absolutely. We use enterprise-grade security with encrypted storage and never share your data with third parties.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, we offer a 14-day money-back guarantee for all paid plans if you're not satisfied.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
