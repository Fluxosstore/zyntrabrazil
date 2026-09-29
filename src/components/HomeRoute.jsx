import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import Home from "@/pages/Home";
import PublicChat from "@/pages/PublicChat";

export default function HomeRoute() {
  const { isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (isMobile && !isAuthenticated) {
    return <PublicChat />;
  }
  return <Home />;
}