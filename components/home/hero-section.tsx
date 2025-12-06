"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Correct router for Next.js
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "@/lib/store"; // IMPT: This hook provides the 'location' object
import { Search, MapPin, ChevronRight, Clock, Star, Truck } from "lucide-react";

const heroImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80";

const trustStats = [
  { icon: Star, value: "4.8", label: "Avg Rating" },
  { icon: Clock, value: "25 mins", label: "Avg Delivery" },
  { icon: Truck, value: "10,000+", label: "Restaurants" },
];

const popularCuisines = [
  "Pizza",
  "Burgers",
  "Biryani",
  "Chinese",
  "North Indian",
  "South Indian",
  "Desserts",
  "Italian",
];

export function HeroSection() {
  const router = useRouter();
  
  // FIX: This const declaration is required to define 'location'
  const { location, requestLocation, isLoading } = useLocation(); 
  
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCuisineClick = (cuisine: string) => {
    router.push(`/search?cuisine=${encodeURIComponent(cuisine)}`);
  };

  return (
    <section className="relative min-h-[70vh] flex items-center" data-testid="hero-section">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Delicious food spread"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Location */}
          <button
            onClick={requestLocation}
            disabled={isLoading}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            data-testid="hero-location-button"
          >
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              {/* Uses the location variable defined above */}
              {location?.area || "Select Location"}, {location?.city || ""}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Hungry? We've got you covered
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
            Order food from your favorite restaurants and get it delivered to your doorstep in minutes.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for restaurants or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 text-base bg-background/95 backdrop-blur border-0 shadow-lg"
                data-testid="hero-search-input"
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8" data-testid="hero-search-button">
              Search
            </Button>
          </form>

          {/* Popular Cuisines */}
          <div className="mb-8">
            <p className="text-white/60 text-sm mb-3">Popular:</p>
            <div className="flex flex-wrap gap-2">
              {popularCuisines.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 cursor-pointer px-4 py-1.5"
                  onClick={() => handleCuisineClick(cuisine)}
                  data-testid={`cuisine-badge-${cuisine.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          {/* Trust Stats */}
          <div className="flex flex-wrap gap-6 md:gap-10">
            {trustStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary to-orange-500 py-3 z-10">
        <div className="container mx-auto px-4">
          <p className="text-center text-white font-medium">
            Get 50% OFF on your first order! Use code:{" "}
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded">FIRST50</span>
          </p>
        </div>
      </div>
    </section>
  );
}