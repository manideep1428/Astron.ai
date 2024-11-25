import React, { useState, useEffect } from "react";
import { X, GripHorizontal } from 'lucide-react';
import { motion, useDragControls } from "framer-motion";
import { summarizeText } from "../api/summarize";
import { defineText } from "../api/prompt";
import { supportedLanguages, translateText } from "../api/translate";

interface ActionPopupProps {
  action: "summarize" | "define" | "translate";
  selectedText: string;
  onClose: () => void;
}

const ActionPopup: React.FC<ActionPopupProps> = ({ action, selectedText, onClose }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const dragControls = useDragControls();

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      setError(null);

      try {
        let res: string;
        switch (action) {
          case "summarize":
            res = await summarizeText(selectedText);
            break;
          case "define":
            res = await defineText(selectedText);
            break;
          case "translate":
            if (!targetLanguage) {
              setLoading(false);
              return;
            }
            res = await translateText(selectedText, targetLanguage);
            break;
          default:
            throw new Error("Invalid action");
        }
        setResult(res);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (action !== "translate" || (action === "translate" && targetLanguage)) {
      fetchResult();
    }
  }, [action, selectedText, targetLanguage]);

  const handleTargetLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetLanguage(e.target.value);
  };

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
        {action === "translate" && !targetLanguage ? (
          <div className="space-y-3">
            <label htmlFor="targetLang" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select target language:
            </label>
            <div className="relative">
              <select
                id="targetLang"
                onChange={handleTargetLanguageChange}
                className="block appearance-none w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="">Select a language</option>
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-4/6"></div>
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : result ? (
          <div className="space-y-3">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 pt-2">
              Result:
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200">
              {result}
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default ActionPopup;

