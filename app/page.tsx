"use client";

import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "../components/home/hero-section";
import { CuisineGrid } from "../components/home/cuisine-grid";
import { RestaurantSection } from "../components/home/restaurant-section";
import { FilterChips } from "../components/restaurant/filter-chips";
import { RestaurantCard, RestaurantCardSkeleton } from "../components/restaurant/restaurant-card";
import { useFilters, useLocation } from "../lib/store";
import type { Restaurant } from "../shared/schema"; // Updated import path
import { Separator } from "../components/ui/separator";
import { Search } from "lucide-react";

export default function HomePage() {
  const { filters } = useFilters();
  const { location } = useLocation();

  // Fetch all restaurants
  const { data: restaurants = [], isLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  // Filter restaurants based on current filters
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Veg only filter
    if (filters.isVegOnly && !restaurant.isVeg) return false;

    // Minimum rating filter
    if (filters.minRating > 0 && Number(restaurant.rating) < filters.minRating) return false;

    // Price range filter
    if (
      restaurant.priceRange &&
      (restaurant.priceRange < filters.priceRange[0] ||
        restaurant.priceRange > filters.priceRange[1])
    ) {
      return false;
    }

    // Has offers filter
    if (filters.hasOffers && !restaurant.hasOffers) return false;

    // Max delivery time filter
    if (
      filters.maxDeliveryTime !== null &&
      restaurant.deliveryTime &&
      restaurant.deliveryTime > filters.maxDeliveryTime
    ) {
      return false;
    }

    // Cuisines filter
    if (filters.cuisines.length > 0) {
      const restaurantCuisines = restaurant.cuisines || [];
      const hasMatchingCuisine = filters.cuisines.some((c) =>
        restaurantCuisines.some((rc) => rc.toLowerCase().includes(c.toLowerCase()))
      );
      if (!hasMatchingCuisine) return false;
    }

    return true;
  });

  // Sort restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (filters.sortBy) {
      case "rating":
        return Number(b.rating) - Number(a.rating);
      case "deliveryTime":
        return (a.deliveryTime || 0) - (b.deliveryTime || 0);
      case "costLowToHigh":
        return (a.priceRange || 2) - (b.priceRange || 2);
      case "costHighToLow":
        return (b.priceRange || 2) - (a.priceRange || 2);
      default:
        return 0; // relevance - keep original order
    }
  });

  // Featured restaurants (top rated)
  const featuredRestaurants = restaurants
    .filter((r) => r.isOpen && Number(r.rating) >= 4)
    .sort((a, b) => Number(b.rating) - Number(a.rating))
    .slice(0, 8);

  // Restaurants with offers
  const restaurantsWithOffers = restaurants
    .filter((r) => r.hasOffers && r.isOpen)
    .slice(0, 8);

  return (
    <div className="min-h-screen pb-20 md:pb-0" data-testid="home-page">
      {/* Hero Section */}
      <HeroSection />

      {/* Cuisine Grid */}
      <CuisineGrid />

      <Separator className="my-4" />

      {/* Featured Restaurants */}
      {featuredRestaurants.length > 0 && (
        <RestaurantSection
          title="Top Rated Near You"
          subtitle="Highest rated restaurants in your area"
          restaurants={featuredRestaurants}
          isLoading={isLoading}
          viewAllLink="/search?sort=rating"
        />
      )}

      {/* Restaurants with Offers */}
      {restaurantsWithOffers.length > 0 && (
        <RestaurantSection
          title="Best Offers"
          subtitle="Great deals you shouldn't miss"
          restaurants={restaurantsWithOffers}
          isLoading={isLoading}
          viewAllLink="/search?offers=true"
        />
      )}

      <Separator className="my-4" />

      {/* All Restaurants with Filters */}
      <section className="py-8" data-testid="all-restaurants-section">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              {sortedRestaurants.length} restaurants delivering to you
            </h2>
            <p className="text-muted-foreground mt-1">
              {location.area}, {location.city}
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <FilterChips />

        <div className="container mx-auto px-4 mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          ) : sortedRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}