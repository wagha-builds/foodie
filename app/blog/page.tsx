"use client";

import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Dishes to Try in Bangalore",
    category: "Food Trends",
    excerpt: "Explore the culinary delights of the garden city with our curated list of must-try dishes ranging from street food to fine dining.",
    date: "Dec 10, 2024"
  },
  {
    id: 2,
    title: "The History of Biryani",
    category: "Culture",
    excerpt: "Dive deep into the rich history of India's favorite dish. From Persia to your plate, discover the journey of aromatic spices.",
    date: "Nov 28, 2024"
  },
  {
    id: 3,
    title: "Healthy Eating on a Budget",
    category: "Health",
    excerpt: "Who said healthy food has to be expensive? Here are 5 tips to maintain a balanced diet without burning a hole in your pocket.",
    date: "Nov 15, 2024"
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Foodie Blog</h1>
      <p className="text-muted-foreground mb-8">Stories, news, and tips for food lovers.</p>
      
      <div className="grid gap-8">
        {blogPosts.map((post) => (
          <div key={post.id} className="border rounded-xl p-6 hover:shadow-lg transition-all bg-card">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className="text-orange-600 bg-orange-100 hover:bg-orange-200">
                {post.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{post.date}</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-3">{post.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {post.excerpt}
            </p>
            
            <Button 
              variant="ghost" 
              className="p-0 h-auto font-semibold text-primary"
              asChild
            >
              <Link href={`/blog/${post.id}`}>
                Read more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}