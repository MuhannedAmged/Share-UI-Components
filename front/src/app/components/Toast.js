"use client";
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

const Toast = ({ status = "success", text = "", show = false }) => {
  const icons = {
    success: <IconCheck size={20} stroke={2} className="text-emerald-400" />,
    error: <IconX size={20} stroke={2} className="text-rose-400" />,
    warning: <IconExclamationMark size={20} stroke={2} className="text-amber-400" />,
  };

  const bgColors = {
    success: "border-emerald-500/20 bg-emerald-500/10",
    error: "border-rose-500/20 bg-rose-500/10",
    warning: "border-amber-500/20 bg-amber-500/10",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className={`fixed top-6 right-6 z-[9999] min-w-[280px] max-w-sm rounded-2xl border backdrop-blur-xl p-4 shadow-2xl shadow-black/40 ${bgColors[status] || bgColors.warning}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl bg-white/5 border border-white/10`}>
              {icons[status] || icons.warning}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white capitalize leading-none mb-1">{status}</p>
              <p className="text-xs text-gray-400 leading-tight">{text}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
