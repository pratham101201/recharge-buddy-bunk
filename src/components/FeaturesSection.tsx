
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Zap, Search, Clock, CreditCard, Shield, Globe } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Search className="h-10 w-10 text-primary" />,
      title: "Easy Station Discovery",
      description: "Quickly find charging stations near you with our intuitive search and filtering system."
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Real-Time Availability",
      description: "See up-to-date information on station availability to plan your charging stops."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Seamless Payments",
      description: "Pay for charging sessions directly through our platform with multiple payment options."
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: "Secure Platform",
      description: "Your data is always protected with our enterprise-grade security systems."
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Charge Monitoring",
      description: "Track your charging session progress and receive notifications when complete."
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: "Extensive Network",
      description: "Access thousands of charging stations across the country with one account."
    }
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-secondary/10 px-3 py-1 text-sm text-secondary">
            Features & Benefits
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Our Platform</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Our platform offers a comprehensive set of features designed to make EV charging convenient and hassle-free.
          </p>
          <Separator className="my-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-border/40 bg-background/60 backdrop-blur-sm transition-all hover:shadow-md">
              <CardHeader>
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
