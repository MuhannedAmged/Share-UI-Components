"use client";
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react";

const Toast = ({ status = "", text = "", show = false }) => {
  if (!show) return null;

  const renderIcon = () => {
    if (status === "success") {
      return <IconCheck size={20} stroke={1.75} className="text-green-400" />;
    } else if (status === "error") {
      return <IconX size={20} stroke={1.75} className="text-red-400" />;
    } else {
      return (
        <IconExclamationMark
          size={20}
          stroke={1.75}
          className="text-yellow-400"
        />
      );
    }
  };

  return (
    <div className="main-shadow text-white w-64 fixed top-4 right-5 rounded-md z-50 bg-neutral-800 shadow-lg">
      <div className="p-3 flex gap-3 items-center">
        {renderIcon()}
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
};

export default Toast;
