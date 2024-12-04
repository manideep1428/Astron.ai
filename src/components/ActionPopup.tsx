import React, { useState, useEffect } from "react";
import { X, GripHorizontal, HelpCircle } from 'lucide-react';
import { motion, useDragControls } from "framer-motion";
import { summarizeText } from "../api/summarize";
import { defineText } from "../api/prompt";
import { supportedLanguages, translateText } from "../api/translate";
import { rewriteText } from "../api/rewrite";
import { SelectSVG } from "./svgs";

interface ActionPopupProps {
  action: "summarize" | "define" | "translate" | "rewrite";
  selectedText: string;
  onClose: () => void;
}

const SkeletonLoader = ({ theme }: { theme: any }) => (
  <div className="space-y-4 p-2">
    {[...Array(3)].map((_, index) => (
      <div 
        key={index} 
        className={`animate-pulse flex space-x-4 items-center ${theme.secondaryBg} rounded-lg p-3`}
      >
        <div className={`h-4 w-4 rounded-full ${theme.tertiaryText} opacity-20`}></div>
        <div className="flex-1 space-y-3">
          <div className={`h-3 ${theme.tertiaryText} rounded opacity-20`}></div>
          <div className={`h-3 w-5/6 ${theme.tertiaryText} rounded opacity-10`}></div>
        </div>
      </div>
    ))}
  </div>
);

const ActionPopup: React.FC<ActionPopupProps> = ({ action, selectedText, onClose }) => {
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const isDark = document.documentElement.classList.contains('dark') || 
                  document.body.classList.contains('dark') ||
                  mediaQuery.matches

    setIsDarkMode(isDark)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

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
          case "rewrite":
            res = await rewriteText(selectedText);
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

  // Invert colors based on page theme
  const baseTheme = isDarkMode ? {
    bg: 'bg-white',
    secondaryBg: 'bg-gray-50',
    hoverBg: 'hover:bg-gray-100',
    text: 'text-gray-900',
    secondaryText: 'text-gray-600',
    tertiaryText: 'text-gray-500',
    border: 'border-gray-200',
    input: 'bg-white border-gray-300 focus:border-gray-400',
  } : {
    bg: 'bg-gray-900',
    secondaryBg: 'bg-gray-800',
    hoverBg: 'hover:bg-gray-700',
    text: 'text-white',
    secondaryText: 'text-gray-300',
    tertiaryText: 'text-gray-400',
    border: 'border-gray-700',
    input: 'bg-gray-800 border-gray-600 focus:border-gray-500',
  }

  return (
    <motion.div
      drag={isDragging}
      dragMomentum={false}
      dragElastic={0.2}
      dragControls={dragControls}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[2147483648] w-96 min-h-[320px] ${baseTheme.bg} rounded-xl shadow-xl border ${baseTheme.border} backdrop-blur-sm transition-colors duration-300`}
    >
      <div className={`flex justify-between items-center p-3 border-b ${baseTheme.border} ${baseTheme.secondaryBg}`}>
        <div className="flex items-center gap-2">
          <motion.div
            className={`cursor-grab active:cursor-grabbing ${baseTheme.hoverBg} p-1 rounded-lg transition-colors duration-200`}
            onPointerDown={(e) => {
              setIsDragging(true);
              dragControls.start(e);
            }}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
          >
            <GripHorizontal className={`w-5 h-5 ${baseTheme.tertiaryText}`} />
          </motion.div>
          <h2 className={`text-lg font-semibold capitalize ${baseTheme.text}`}>
            {action}
          </h2>
        </div>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg ${baseTheme.hoverBg} transition-colors duration-200`}
          aria-label="Close"
        >
          <X className={`w-5 h-5 ${baseTheme.secondaryText}`} />
        </button>
      </div>

      <div className={`p-4 ${baseTheme.bg} relative`}>
        {action === "translate" && !targetLanguage ? (
          <div className="space-y-3">
            <label htmlFor="targetLang" className={`block text-sm font-medium ${baseTheme.secondaryText}`}>
              Select target language:
            </label>
            <div className="relative">
              <select
                id="targetLang"
                onChange={handleTargetLanguageChange}
                className={`block appearance-none w-full ${baseTheme.input} ${baseTheme.text} py-2 px-4 pr-8 rounded-lg transition-colors duration-200 focus:outline-none`}
              >
                <option value="">Select a language</option>
                {supportedLanguages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${baseTheme.secondaryText}`}>
                <SelectSVG />
              </div>
            </div>
          </div>
        ) : loading ? (
          <SkeletonLoader theme={baseTheme} />
        ) : error ? (
          <div className="flex items-center space-x-2 text-sm text-red-500 dark:text-red-400 p-3">
            <HelpCircle className="w-5 h-5 opacity-70" />
            <span>{error}</span>
          </div>
        ) : result ? (
          <div className="space-y-3">
            <div className={`text-xs font-medium ${baseTheme.tertiaryText} pt-2`}>
              Result:
            </div>
            <div className={`text-sm ${baseTheme.text} leading-relaxed`}>
              {result}
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default ActionPopup;