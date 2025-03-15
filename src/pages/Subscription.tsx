
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscriptionPlans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: "$9.99",
      period: "monthly",
      description: "Essential loan calculation tools for individuals",
      features: [
        "Basic loan calculator",
        "Payment schedule",
        "Up to 3 saved calculations",
        "Email support"
      ],
      highlighted: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const
    },
    {
      name: "Premium",
      price: "$24.99",
      period: "monthly",
      description: "Advanced tools for serious financial planning",
      features: [
        "Advanced loan comparison",
        "Amortization schedules",
        "Unlimited saved calculations",
        "Detailed financial reports",
        "Priority support"
      ],
      highlighted: true,
      buttonText: "Subscribe Now",
      buttonVariant: "default" as const
    },
    {
      name: "Enterprise",
      price: "$79.99",
      period: "monthly",
      description: "Complete solution for financial professionals",
      features: [
        "All Premium features",
        "White-label reports",
        "API access",
        "Custom financial models",
        "Dedicated account manager",
        "24/7 phone support"
      ],
      highlighted: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const
    }
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-3">Choose Your Subscription Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your financial needs. Upgrade or downgrade anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`border-2 h-full flex flex-col ${
              plan.highlighted 
                ? "border-primary shadow-lg relative overflow-hidden" 
                : "border-border"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-xs font-medium py-1 px-3 rounded-bl-lg">
                  MOST POPULAR
                </div>
              </div>
            )}
            <CardHeader className={plan.highlighted ? "bg-primary/5" : ""}>
              <CardTitle>{plan.name}</CardTitle>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">/{plan.period}</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={plan.buttonVariant} 
                className="w-full"
                onClick={() => {
                  // In a real app, this would handle the subscription process
                  if (plan.name === "Enterprise") {
                    // For enterprise, we might direct to a contact form
                    navigate("/contact");
                  } else {
                    // For other plans, direct to payment page
                    alert(`You selected the ${plan.name} plan. In a real app, this would take you to payment.`);
                  }
                }}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6 text-left">
          <div>
            <h3 className="font-medium text-lg mb-2">Can I change my plan later?</h3>
            <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">How do I cancel my subscription?</h3>
            <p className="text-muted-foreground">You can cancel your subscription from your account settings at any time. Your subscription will remain active until the end of your current billing period.</p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">Do you offer refunds?</h3>
            <p className="text-muted-foreground">We offer a 14-day money-back guarantee on all plans. If you're not satisfied, contact our support team within 14 days of purchase.</p>
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
