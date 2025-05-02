
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

const PricingSection = () => {
  const pricingPlans = [
    {
      name: "Basic",
      price: "$0",
      period: "Free Forever",
      description: "Essential features for occasional EV drivers",
      features: [
        "Find nearby charging stations",
        "View basic station details",
        "Filter by connector type",
        "Access to public stations only"
      ],
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "Per Month",
      description: "Advanced features for regular EV drivers",
      features: [
        "Everything in Basic",
        "Real-time station availability",
        "Reserve charging sessions",
        "Premium network access",
        "Route planning with charging stops",
        "Charging history & analytics"
      ],
      buttonText: "Subscribe Now",
      popular: true
    },
    {
      name: "Business",
      price: "$29.99",
      period: "Per Month",
      description: "For fleet managers and business users",
      features: [
        "Everything in Premium",
        "Multiple vehicle management",
        "Team accounts & permissions",
        "Detailed billing & reports",
        "Priority customer support",
        "API access"
      ],
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
            Pricing Plans
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Choose Your Plan</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Select the right plan for your EV charging needs. All plans include access to our growing network of stations.
          </p>
          <Separator className="my-8" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg relative' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-0 right-0 mx-auto w-fit">
                  <Badge variant="default" className="px-3 py-1 text-xs">Most Popular</Badge>
                </div>
              )}
              <CardHeader className={plan.popular ? "pt-8" : ""}>
                <CardTitle>{plan.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
