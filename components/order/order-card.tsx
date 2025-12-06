"use client";

import Link from "next/link"; // FIXED: Use Next.js Link
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderStatusType } from "../../shared/schema";
import { 
  MapPin, 
  Clock, 
  Package, 
  ArrowRight,
  RotateCcw,
  Star,
  Phone,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: Order & {
    restaurant?: { name: string; imageUrl?: string | null };
  };
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  accepted: { label: "Accepted", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  preparing: { label: "Preparing", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
  ready: { label: "Ready", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
  picked_up: { label: "Picked Up", color: "text-indigo-600", bgColor: "bg-indigo-100 dark:bg-indigo-900/30" },
  on_the_way: { label: "On The Way", color: "text-cyan-600", bgColor: "bg-cyan-100 dark:bg-cyan-900/30" },
  delivered: { label: "Delivered", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  cancelled: { label: "Cancelled", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
};

export function OrderCard({ order }: OrderCardProps) {
  const config = statusConfig[order.status] || statusConfig.pending;
  const isActive = !["delivered", "cancelled"].includes(order.status);
  const items = order.items || [];

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all",
        isActive && "border-primary/50"
      )}
      data-testid={`order-card-${order.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {order.restaurant?.imageUrl ? (
                <img
                  src={order.restaurant.imageUrl}
                  alt={order.restaurant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <span className="text-lg font-bold text-primary/30">
                    {order.restaurant?.name?.charAt(0) || "R"}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold truncate">
                {order.restaurant?.name || "Restaurant"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <Badge className={cn("flex-shrink-0", config.bgColor, config.color)}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          {items.slice(0, 3).map((item: { quantity: number; dishName: string; totalPrice: number }, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {item.quantity}x {item.dishName}
              </span>
              <span>{Number(item.totalPrice).toFixed(2)}</span>
            </div>
          ))}
          {items.length > 3 && (
            <p className="text-sm text-muted-foreground">
              +{items.length - 3} more items
            </p>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>{Number(order.total).toFixed(2)}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{order.deliveryAddress}</span>
        </div>

        {isActive && order.estimatedDeliveryTime && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Estimated delivery in {order.estimatedDeliveryTime} mins
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          {isActive ? (
            <>
              {/* FIXED: Use asChild to merge Button styling with Next.js Link */}
              <Button asChild variant="default" className="flex-1" data-testid="button-track-order">
                <Link href={`/order/${order.id}`}>
                  <Package className="h-4 w-4 mr-2" />
                  Track Order
                </Link>
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                asChild
                data-testid="button-whatsapp-support"
              >
                <a
                  href={`https://wa.me/911234567890?text=Hi, I need help with my order ${order.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiWhatsapp className="h-4 w-4 text-green-600" />
                </a>
              </Button>
            </>
          ) : (
            <>
              {/* FIXED: Use asChild here as well */}
              <Button asChild variant="outline" className="flex-1" data-testid="button-view-details">
                <Link href={`/order/${order.id}`}>
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              
              {order.status === "delivered" && (
                <Button variant="outline" size="icon" data-testid="button-rate-order">
                  <Star className="h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="icon" data-testid="button-reorder">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}