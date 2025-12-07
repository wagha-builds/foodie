"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { Loader2, CheckCircle, Store, ChefHat, MapPin } from "lucide-react";

export default function PartnerPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsOpen(false);
    
    toast({
      title: "Application Submitted Successfully! 🏪",
      description: "We've received your restaurant details. Our onboarding team will verify your documents and contact you within 24-48 hours.",
      action: <CheckCircle className="h-5 w-5 text-green-500" />,
      duration: 6000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Partner with Foodie</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Grow your business with us. Reach new customers and increase your sales by listing your restaurant on Foodie.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
          <Store className="h-10 w-10 text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">More Revenue</h3>
          <p className="text-sm text-muted-foreground">Get more orders and add a new revenue stream to your business.</p>
        </div>
        <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
          <ChefHat className="h-10 w-10 text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">New Customers</h3>
          <p className="text-sm text-muted-foreground">Boost your visibility and reach new customers in your city.</p>
        </div>
        <div className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow">
          <MapPin className="h-10 w-10 text-orange-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Hyperlocal</h3>
          <p className="text-sm text-muted-foreground">We help you market your food to the right audience in your vicinity.</p>
        </div>
      </div>
      
      <div className="bg-muted/30 p-8 rounded-xl border text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to start your journey?</h3>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8">
              Register your Restaurant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Restaurant Registration</DialogTitle>
              <DialogDescription>
                Fill in the details below to list your restaurant on Foodie.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input id="ownerName" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 98765 43210" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input id="email" type="email" placeholder="restaurant@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restName">Restaurant Name</Label>
                <Input id="restName" placeholder="e.g. Spice Garden" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea id="address" placeholder="Shop No, Street, Area, Landmark..." required />
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}