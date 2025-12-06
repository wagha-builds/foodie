import { Metadata } from "next";
import SearchClient from "./client";

export const metadata: Metadata = {
  title: "Search | Foodie",
  description: "Find your favorite food",
};

export default function SearchPage() {
  return <SearchClient />;
}