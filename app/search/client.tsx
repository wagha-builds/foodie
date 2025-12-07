"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { RestaurantCard } from "../../components/restaurant/restaurant-card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Search, ArrowLeft, X } from "lucide-react";
import type { Restaurant } from "../../shared/schema";
import { useState, useEffect } from "react";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get("q") || "";
  const initialCuisine = searchParams.get("cuisine") || "";
  
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Sync state with URL params
  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  const { data: restaurants = [], isLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/restaurants");
      return res.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    router.push(`/search?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.push("/search");
  };

  // Filter Logic
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = searchTerm
      ? restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisines.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;

    const matchesCuisine = initialCuisine
      ? restaurant.cuisines.some(c => c.toLowerCase() === initialCuisine.toLowerCase())
      : true;

    return matchesSearch && matchesCuisine;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sticky Search Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b px-4 py-4">
        <div className="container mx-auto max-w-5xl">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for restaurants and food..."
                className="pl-10 pr-10"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {initialCuisine && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Showing results for:</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                {initialCuisine}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => router.push("/search")} 
                />
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No matches found</h3>
            <p className="text-muted-foreground mt-2">
              Try searching for a different restaurant or cuisine.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}