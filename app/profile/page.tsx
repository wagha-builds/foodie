import { Metadata } from "next";
import ProfileClient from "./client";

export const metadata: Metadata = {
  title: "My Profile | Foodie",
  description: "Manage your account settings",
};

export default function ProfilePage() {
  return <ProfileClient />;
}