"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
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
import { Loader2, Bike, CheckCircle } from "lucide-react";

export default function DeliveryPartnerPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsOpen(false);
    
    toast({
      title: "Application Received! 🛵",
      description: "You've taken the first step. Check your email for document verification instructions.",
      action: <CheckCircle className="h-5 w-5 text-green-500" />,
      duration: 6000,
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Become a Delivery Partner</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Earn money on your own schedule. Join our fleet of delivery partners today.
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold">Why join us?</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
              <span>Flexible working hours - Be your own boss</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
              <span>Weekly payments directly to your bank</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
              <span>Insurance coverage up to ₹5 Lakhs</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">✓</div>
              <span>Great earning potential with incentives</span>
            </li>
          </ul>
        </div>
        
        <div className="flex items-center justify-center bg-muted/20 rounded-xl p-8">
           <Bike className="h-48 w-48 text-primary/20" />
        </div>
      </div>

      <div className="text-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 text-lg">
              Join Now
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Partner Registration</DialogTitle>
              <DialogDescription>
                Start earning by delivering smiles. Fill out the form below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleJoin} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="As per Driving License" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input id="phone" placeholder="10-digit number" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle Type</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">Motorcycle</SelectItem>
                    <SelectItem value="scooter">Scooter</SelectItem>
                    <SelectItem value="bicycle">Bicycle</SelectItem>
                    <SelectItem value="none">None (I need to rent one)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="Which city do you want to deliver in?" required />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
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
        
        <p className="text-xs text-muted-foreground mt-4">
          By clicking Join Now, you agree to our terms and partner policy.
        </p>
      </div>
    </div>
  );
}