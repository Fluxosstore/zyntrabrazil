import React from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import TrialExpired from "@/pages/TrialExpired";

const TRIAL_HOURS = 24;

export default function TrialGuard() {
  const { user } = useAuth();

  // Admins are not restricted
  if (user?.role === "admin") return <Outlet />;

  // Paid users are not restricted
  const plan = user?.plan || "free";
  if (plan !== "free") return <Outlet />;

  // Check trial — TRIAL_HOURS from account creation
  const createdDate = user?.created_date ? new Date(user.created_date) : null;
  if (!createdDate) return <Outlet />;

  const trialEnd = new Date(createdDate.getTime() + TRIAL_HOURS * 60 * 60 * 1000);
  if (new Date() > trialEnd) {
    return <TrialExpired />;
  }

  return <Outlet />;
}