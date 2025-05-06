
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';




const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        toast({
          title: "Message Sent",
          description: "Thank you for your message. We'll get back to you soon!",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await response.json();
        console.error("Validation error:", errorData);
        toast({
          title: "Submission failed",
          description: "Please check your input and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Network error",
        description: "Could not reach the server. Try again later.",
        variant: "destructive",
      });
    }
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 scroll-mt-16">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-[500px]">
              Have questions about our services or need support? Our team is here to help you with your EV charging needs.
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Mail className="h-6 w-6 text-evblue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Email Us</h3>
                  <p className="mt-1 text-gray-500">support@evrecharge.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Phone className="h-6 w-6 text-evblue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Call Us</h3>
                  <p className="mt-1 text-gray-500">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MapPin className="h-6 w-6 text-evblue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Visit Us</h3>
                  <p className="mt-1 text-gray-500">
                    123 EV Street, Green City<br />
                    CA 94105, United States
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input 
                  id="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message..." 
                  className="h-32" 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-evblue-500 to-evgreen-500 hover:from-evblue-600 hover:to-evgreen-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
}
export default ContactSection;
