
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon.",
    });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-secondary/10 px-3 py-1 text-sm text-secondary">
            <MessageCircle className="inline-block h-4 w-4 mr-1" />
            Get In Touch
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Have questions about our EV charging network or services? Reach out to us and we'll get back to you as soon as possible.
          </p>
          <Separator className="my-8" />
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <Card className="bg-background/60 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="Your email" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Subject of your message" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Your message..." 
                    className="min-h-[120px]" 
                    required 
                  />
                </div>
                
                <Button type="submit" className="w-full md:w-auto group">
                  Send Message
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Our Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Email Us</h4>
                    <p className="text-sm text-muted-foreground">
                      <a href="mailto:info@evcharge.example" className="hover:text-primary">
                        info@evcharge.example
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Live Chat</h4>
                    <p className="text-sm text-muted-foreground">
                      Available Monday to Friday, 9am - 5pm EST
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-medium">How do I find charging stations?</h4>
                  <p className="text-sm text-muted-foreground">
                    Use our interactive map to locate stations near you, or search by address, city, or zip code.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-medium">What payment methods do you accept?</h4>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards, Apple Pay, Google Pay, and our own EVCharge membership cards.
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-medium">How do I report an issue with a station?</h4>
                  <p className="text-sm text-muted-foreground">
                    You can report issues through our mobile app or by contacting our support team directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
