
import React from 'react';
import { BatteryCharging, Map, CreditCard, Clock } from 'lucide-react';

const features = [
  {
    icon: <Map className="h-10 w-10 text-evblue-500" />,
    title: "Find Stations Easily",
    description: "Locate charging stations near you with our interactive map and real-time availability updates."
  },
  {
    icon: <BatteryCharging className="h-10 w-10 text-evblue-500" />,
    title: "Fast Charging",
    description: "Access high-speed charging stations that get you back on the road quickly."
  },
  {
    icon: <CreditCard className="h-10 w-10 text-evblue-500" />,
    title: "Simple Payments",
    description: "Pay easily with our app - no cards needed. Track all your charging sessions and costs."
  },
  {
    icon: <Clock className="h-10 w-10 text-evblue-500" />,
    title: "24/7 Availability",
    description: "Our stations are available round the clock, ensuring you can charge whenever you need to."
  }
];

const FeaturesSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-[800px] mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Why Choose <span className="gradient-text">EV Recharge</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We're building the future of EV charging infrastructure with cutting-edge technology and user-friendly services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 rounded-full bg-blue-50">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
