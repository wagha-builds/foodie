import type { Dish, Restaurant, MenuCategory as MenuCategoryType } from "../../shared/schema";
import { DishCard, DishCardSkeleton } from "./dish-card";
import { Skeleton } from "../../components/ui/skeleton";

interface MenuCategoryProps {
  category: MenuCategoryType;
  dishes: Dish[];
  restaurant: Restaurant;
}

export function MenuCategorySection({ category, dishes, restaurant }: MenuCategoryProps) {
  if (dishes.length === 0) return null;

  return (
    <section
      id={`category-${category.id}`}
      className="scroll-mt-32"
      data-testid={`menu-category-${category.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{category.name}</h2>
        <span className="text-sm text-muted-foreground">
          {dishes.length} {dishes.length === 1 ? "item" : "items"}
        </span>
      </div>
      
      {category.description && (
        <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
      )}

      <div className="divide-y">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} restaurant={restaurant} />
        ))}
      </div>
    </section>
  );
}

// Skeleton loader
export function MenuCategorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="divide-y">
        {[1, 2, 3].map((i) => (
          <DishCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Sidebar for category navigation
interface CategorySidebarProps {
  categories: MenuCategoryType[];
  dishCounts: Record<string, number>;
  activeCategory: string | null;
  onCategoryClick: (categoryId: string) => void;
}

export function CategorySidebar({
  categories,
  dishCounts,
  activeCategory,
  onCategoryClick,
}: CategorySidebarProps) {
  return (
    <nav className="sticky top-32 space-y-1">
      {categories.map((category) => {
        const count = dishCounts[category.id] || 0;
        if (count === 0) return null;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              activeCategory === category.id
                ? "bg-primary/10 text-primary font-medium"
                : "hover-elevate text-muted-foreground"
            }`}
            data-testid={`category-nav-${category.id}`}
          >
            <div className="flex items-center justify-between">
              <span className="truncate">{category.name}</span>
              <span className="text-xs ml-2">{count}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}