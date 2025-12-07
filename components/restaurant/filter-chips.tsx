import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../../components/ui/sheet";
import { Checkbox } from "../../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";
import { Separator } from "../../components/ui/separator";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useFilters, defaultFilters, type FilterState } from "../../lib/store";
import {
  SlidersHorizontal,
  X,
  Star,
  Clock,
  Percent,
  Leaf,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../lib/utils";

const cuisinesList = [
  "North Indian",
  "South Indian",
  "Chinese",
  "Italian",
  "Continental",
  "Mexican",
  "Thai",
  "Japanese",
  "Korean",
  "Mediterranean",
  "American",
  "Fast Food",
  "Street Food",
  "Desserts",
  "Beverages",
  "Biryani",
  "Pizza",
  "Burgers",
  "Healthy",
  "Cafe",
];

const quickFilters = [
  { id: "veg", label: "Pure Veg", icon: Leaf },
  { id: "rating", label: "Ratings 4.0+", icon: Star },
  { id: "offers", label: "Offers", icon: Percent },
  { id: "fast", label: "Fast Delivery", icon: Clock },
];

export function FilterChips() {
  const { filters, setFilters, resetFilters, activeFilterCount } = useFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const toggleQuickFilter = (id: string) => {
    switch (id) {
      case "veg":
        setFilters({ isVegOnly: !filters.isVegOnly });
        break;
      case "rating":
        setFilters({ minRating: filters.minRating >= 4 ? 0 : 4 });
        break;
      case "offers":
        setFilters({ hasOffers: !filters.hasOffers });
        break;
      case "fast":
        setFilters({ maxDeliveryTime: filters.maxDeliveryTime === 30 ? null : 30 });
        break;
    }
  };

  const isQuickFilterActive = (id: string) => {
    switch (id) {
      case "veg":
        return filters.isVegOnly;
      case "rating":
        return filters.minRating >= 4;
      case "offers":
        return filters.hasOffers;
      case "fast":
        return filters.maxDeliveryTime === 30;
      default:
        return false;
    }
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setIsOpen(false);
  };

  const openFilterSheet = () => {
    setTempFilters(filters);
    setIsOpen(true);
  };

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {/* All Filters Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={openFilterSheet}
                className={cn(
                  "flex-shrink-0",
                  activeFilterCount > 0 && "border-primary text-primary"
                )}
                data-testid="button-all-filters"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between gap-2">
                  <span>Filters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTempFilters(defaultFilters)}
                    data-testid="button-clear-filters"
                  >
                    Clear All
                  </Button>
                </SheetTitle>
              </SheetHeader>

              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-6 py-4">
                  {/* Sort By */}
                  <div>
                    <h4 className="font-semibold mb-3">Sort By</h4>
                    <RadioGroup
                      value={tempFilters.sortBy}
                      onValueChange={(value) =>
                        setTempFilters((prev) => ({
                          ...prev,
                          sortBy: value as FilterState["sortBy"],
                        }))
                      }
                    >
                      {[
                        { value: "relevance", label: "Relevance" },
                        { value: "rating", label: "Rating" },
                        { value: "deliveryTime", label: "Delivery Time" },
                        { value: "costLowToHigh", label: "Cost: Low to High" },
                        { value: "costHighToLow", label: "Cost: High to Low" },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 py-2"
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                          />
                          <Label htmlFor={option.value}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Cuisines */}
                  <div>
                    <h4 className="font-semibold mb-3">Cuisines</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {cuisinesList.map((cuisine) => (
                        <div
                          key={cuisine}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={cuisine}
                            checked={tempFilters.cuisines.includes(cuisine)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setTempFilters((prev) => ({
                                  ...prev,
                                  cuisines: [...prev.cuisines, cuisine],
                                }));
                              } else {
                                setTempFilters((prev) => ({
                                  ...prev,
                                  cuisines: prev.cuisines.filter(
                                    (c) => c !== cuisine
                                  ),
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={cuisine} className="text-sm">
                            {cuisine}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Rating */}
                  <div>
                    <h4 className="font-semibold mb-3">Minimum Rating</h4>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[tempFilters.minRating]}
                        onValueChange={([value]) =>
                          setTempFilters((prev) => ({
                            ...prev,
                            minRating: value,
                          }))
                        }
                        max={5}
                        step={0.5}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">
                        {tempFilters.minRating}+
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold mb-3">Price Range</h4>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((price) => (
                        <Button
                          key={price}
                          variant={
                            price >= tempFilters.priceRange[0] &&
                            price <= tempFilters.priceRange[1]
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            if (price === tempFilters.priceRange[0] && price === tempFilters.priceRange[1]) {
                              setTempFilters((prev) => ({
                                ...prev,
                                priceRange: [1, 4],
                              }));
                            } else {
                              setTempFilters((prev) => ({
                                ...prev,
                                priceRange: [price, price],
                              }));
                            }
                          }}
                        >
                          {"$".repeat(price)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Max Delivery Time */}
                  <div>
                    <h4 className="font-semibold mb-3">Max Delivery Time</h4>
                    <div className="flex gap-2 flex-wrap">
                      {[20, 30, 45, 60].map((time) => (
                        <Button
                          key={time}
                          variant={
                            tempFilters.maxDeliveryTime === time
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setTempFilters((prev) => ({
                              ...prev,
                              maxDeliveryTime:
                                prev.maxDeliveryTime === time ? null : time,
                            }))
                          }
                        >
                          Under {time} mins
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Other Options */}
                  <div>
                    <h4 className="font-semibold mb-3">Other</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vegOnly"
                          checked={tempFilters.isVegOnly}
                          onCheckedChange={(checked) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              isVegOnly: !!checked,
                            }))
                          }
                        />
                        <Label htmlFor="vegOnly">Pure Veg Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="offers"
                          checked={tempFilters.hasOffers}
                          onCheckedChange={(checked) =>
                            setTempFilters((prev) => ({
                              ...prev,
                              hasOffers: !!checked,
                            }))
                          }
                        />
                        <Label htmlFor="offers">With Offers</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <SheetFooter className="border-t pt-4">
                <Button
                  className="w-full"
                  onClick={applyFilters}
                  data-testid="button-apply-filters"
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Sort Dropdown */}
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            data-testid="button-sort"
          >
            Sort
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Quick Filter Chips */}
          {quickFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={isQuickFilterActive(filter.id) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleQuickFilter(filter.id)}
              className="flex-shrink-0"
              data-testid={`filter-${filter.id}`}
            >
              <filter.icon className="h-4 w-4 mr-1.5" />
              {filter.label}
              {isQuickFilterActive(filter.id) && (
                <X className="h-3 w-3 ml-1.5" />
              )}
            </Button>
          ))}

          {/* Active Cuisines */}
          {filters.cuisines.map((cuisine) => (
            <Button
              key={cuisine}
              variant="default"
              size="sm"
              onClick={() =>
                setFilters({
                  cuisines: filters.cuisines.filter((c) => c !== cuisine),
                })
              }
              className="flex-shrink-0"
            >
              {cuisine}
              <X className="h-3 w-3 ml-1.5" />
            </Button>
          ))}

          {/* Clear All */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="flex-shrink-0 text-primary"
              data-testid="button-clear-all-filters"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}