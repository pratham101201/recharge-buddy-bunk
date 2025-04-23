
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: "Basic",
    price: "Free",
    description: "Essential charging services for occasional users",
    features: [
      "Find charging stations",
      "Basic station information",
      "Standard charging speeds",
      "Pay-as-you-go pricing"
    ],
    highlighted: false
  },
  {
    name: "Premium",
    price: "$9.99/mo",
    description: "Enhanced features for regular EV drivers",
    features: [
      "All Basic features",
      "Real-time availability",
      "Reserved charging sessions",
      "Priority customer support",
      "Discounted charging rates (10% off)"
    ],
    highlighted: true
  },
  {
    name: "Business",
    price: "$49.99/mo",
    description: "Fleet management and business solutions",
    features: [
      "All Premium features",
      "Multiple vehicle management",
      "Advanced reporting & analytics",
      "Dedicated account manager",
      "Custom billing solutions",
      "API access for integration"
    ],
    highlighted: false
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Choose the plan that works best for your electric vehicle charging needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                flex flex-col p-8 rounded-xl border 
                ${plan.highlighted 
                  ? 'border-evblue-200 bg-gradient-to-b from-blue-50 to-green-50 shadow-md relative overflow-hidden' 
                  : 'border-gray-200 bg-white'
                }
              `}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-evblue-500 to-evgreen-500 text-white text-xs font-semibold px-3 py-1 transform rotate-45 translate-x-5 translate-y-3">
                    Popular
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.price !== "Free" && (
                    <span className="ml-1 text-gray-500">per month</span>
                  )}
                </div>
                <p className="mt-2 text-gray-500">{plan.description}</p>
              </div>
              
              <div className="mt-8 space-y-4 flex-grow">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className={`h-5 w-5 ${plan.highlighted ? 'text-evgreen-500' : 'text-evblue-500'}`} />
                    </div>
                    <p className="ml-3 text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button 
                  className={`w-full ${
                    plan.highlighted 
                      ? 'bg-gradient-to-r from-evblue-500 to-evgreen-500 hover:from-evblue-600 hover:to-evgreen-600 text-white' 
                      : ''
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
