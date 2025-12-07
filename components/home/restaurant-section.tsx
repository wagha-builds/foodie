"use client";

import Link from "next/link";
import { RestaurantCard } from "../../components/restaurant/restaurant-card";
import { Button } from "../../components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Restaurant } from "../../shared/schema";

interface RestaurantSectionProps {
  title: string;
  subtitle?: string;
  restaurants: Restaurant[];
  isLoading?: boolean;
  viewAllLink?: string;
}

export function RestaurantSection({
  title,
  subtitle,
  restaurants,
  isLoading,
  viewAllLink,
}: RestaurantSectionProps) {
  if (!isLoading && restaurants.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          
          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button variant="ghost" className="hidden md:flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
        
        {viewAllLink && (
          <div className="mt-6 text-center md:hidden">
            <Link href={viewAllLink}>
              <Button variant="outline" className="w-full">
                View All Restaurants
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}