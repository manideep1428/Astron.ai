import React, { useState, useEffect } from "react";
import { X, GripHorizontal } from "lucide-react";
import { motion, useDragControls } from "framer-motion";

interface ActionPopupProps {
  action: "summarize" | "define" | "translate";
  selectedText: string;
  onClose: () => void;
}

const ActionPopup: React.FC<ActionPopupProps> = ({ action, selectedText, onClose }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dragControls = useDragControls();

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setResult(`This is the ${action}d result for: "${selectedText}"`);
      setLoading(false);
    };

    fetchResult();
  }, [action, selectedText]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.2}
      dragControls={dragControls}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[2147483648] w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-300 dark:border-gray-700 transition-colors duration-300 overflow-hidden"
    >
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <motion.div
            className="cursor-grab active:cursor-grabbing hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded-lg transition-colors duration-200"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <GripHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </motion.div>
          <h2 className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-100">
            {action}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="p-4 bg-white dark:bg-gray-900">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/6"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Selected Text:
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              {selectedText}
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 pt-2">
              Result:
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {result}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ActionPopup;
