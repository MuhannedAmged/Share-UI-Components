"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import OnlineStatus from "./components/OnLineState";
import Loading from "./components/Loading";

export default function ClientRoot({ children }) {
  const [showLoading, setShowLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setShowLoading(true);
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      <OnlineStatus />
      {showLoading ? <Loading /> : children}
    </>
  );
}
