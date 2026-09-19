import React, { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminRevenue from "@/components/admin/AdminRevenue";
import AdminCoupons from "@/components/admin/AdminCoupons";
import AdminSupport from "@/components/admin/AdminSupport";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminProduct from "@/components/admin/AdminProduct";
import AdminSettings from "@/components/admin/AdminSettings";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />;
      case "orders":
        return <AdminOrders />;
      case "revenue":
        return <AdminRevenue />;
      case "coupons":
        return <AdminCoupons />;
      case "support":
        return <AdminSupport />;
      case "users":
        return <AdminUsers />;
      case "product":
        return <AdminProduct />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      <AdminSidebar active={activeTab} onSelect={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderTab()}
      </main>
    </div>
  );
}