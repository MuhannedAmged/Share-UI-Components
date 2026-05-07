"use client";
import { IconWifi, IconWifiOff } from "@tabler/icons-react";
import { useState, useEffect } from "react";

const OnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      setIsOnline(navigator.onLine);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <div className="fixed bottom-2.5 right-2.5 main-shadow rounded-full">
      {isOnline ? (
        <IconWifi size={20} stroke={1.75} className="text-green-400 p-2" />
      ) : (
        <IconWifiOff size={20} stroke={1.75} className="text-red-400 p-2" />
      )}
    </div>
  );
};

export default OnlineStatus;
