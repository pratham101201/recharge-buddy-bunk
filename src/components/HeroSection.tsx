
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, BatteryCharging } from 'lucide-react';

const HeroSection = () => {
  console.log('HeroSection rendering...');
  
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-white via-blue-50 to-green-50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Power Your Journey with <span className="gradient-text">EV Recharge</span>
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find and use the best charging stations for your electric vehicle with our network of high-speed chargers.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button className="bg-gradient-to-r from-evblue-500 to-evgreen-500 hover:from-evblue-600 hover:to-evgreen-600 text-white">
                Find a Station
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <BatteryCharging className="h-4 w-4 text-evgreen-500" />
                <span>500+ Stations</span>
              </div>
              <div className="flex items-center gap-1">
                <BatteryCharging className="h-4 w-4 text-evblue-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-1">
                <BatteryCharging className="h-4 w-4 text-evgreen-500" />
                <span>Easy Payment</span>
              </div>
            </div>
          </div>
          <div className="mx-auto lg:mx-0 relative">
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gradient-to-tr from-evblue-100 to-evgreen-100 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="charging-pulse absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-evblue-400"></div>
                <div className="charging-pulse absolute top-2/3 right-1/3 w-20 h-20 rounded-full bg-evgreen-400 delay-300"></div>
                <div className="charging-pulse absolute bottom-1/4 left-1/2 w-12 h-12 rounded-full bg-evblue-300 delay-700"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-white/90 rounded-full shadow-lg flex items-center justify-center animate-float">
                  <BatteryCharging className="h-20 w-20 text-evblue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
