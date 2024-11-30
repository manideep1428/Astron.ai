import { useState, useEffect } from "react";
import { FileText, RefreshCcw, Send, Trash2, Folder, X } from "lucide-react";
import { summarizeFullText } from "../api/summarize";
import { rewriteText } from "../api/rewrite";
import { promptWithAIStreaming } from "../api/prompt";

interface Message {
  text: string;
  isUser: boolean;
}

type SavedSummariesType = { [key: string]: string };

export default function Popup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [savedSummaries, setSavedSummaries] = useState<SavedSummariesType>({});
  const [viewSaved, setViewSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get(["messages", "summaries"], (result) => {
      setMessages(result.messages || []);
      setSavedSummaries(result.summaries || {});
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ messages, summaries: savedSummaries });
  }, [messages, savedSummaries]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages((prev) => [...prev, { text, isUser }]);
  };

  const summarizeCurrentPage = async () => {
    try {
      const activeTabId = await getActiveTabId();
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTabId },
          func: getPageContent,
        },
        async (results) => {
          const pageContent = results[0]?.result;
          if (!pageContent) {
            addMessage("Error: Could not extract page content.", false);
            return;
          }

          addMessage("Summarizing current page...", false);

          const summary = await summarizeFullText(pageContent);
          const summaryId = `summary-${Date.now()}`;
          setSavedSummaries((prev) => ({ ...prev, [summaryId]: summary }));

          addMessage(`Summary: ${summary}`, false);
        }
      );
    } catch (err) {
      console.error(err);
      addMessage(`Error: ${err instanceof Error ? err.message : "Failed to summarize page."}`, false);
    }
  };

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;

    addMessage(input, true);

    try {
      if (input.startsWith("rewrite:")) {
        const textToRewrite = input.slice(8).trim();
        const rewrittenText = await rewriteText(textToRewrite);
        addMessage(`Rewritten: ${rewrittenText}`, false);
      } else if (input.startsWith("summarize:")) {
        const textToSummarize = input.slice(10).trim();
        const summary = await summarizeFullText(textToSummarize);
        addMessage(`Summary: ${summary}`, false);
      } else {
        let streamedSummary = "";
        await promptWithAIStreaming(input, (chunk) => {
          streamedSummary += chunk;
          setMessages((prev) =>
            prev.map((msg, index) =>
              index === prev.length - 1 ? { ...msg, text: streamedSummary } : msg
            )
          );
        });
        addMessage(streamedSummary, false);
      }
    } catch (err) {
      console.error(err);
      addMessage(`Error: ${err instanceof Error ? err.message : "Something went wrong."}`, false);
    } finally {
      setInputText("");
    }
  };

  const deleteAllSummaries = () => {
    setSavedSummaries({});
    chrome.storage.local.remove("summaries");
    setError("No saved summaries.");
  };

  const deleteSummary = (key: string) => {
    const updatedSummaries = { ...savedSummaries };
    delete updatedSummaries[key];
    setSavedSummaries(updatedSummaries);
    if (Object.keys(updatedSummaries).length === 0) {
      setError("No saved summaries.");
    }
  };

  const toggleSavedSummariesView = () => {
    setViewSaved(!viewSaved);
    setError(null);
  };

  const getActiveTabId = async (): Promise<number> => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs.length || !tabs[0].id) throw new Error("No active tab found.");
    return tabs[0].id;
  };

  const getPageContent = () => document.body.innerText || "";

  return (
    <div className="flex flex-col h-[600px] w-[400px] bg-gray-100 text-gray-800 font-sans">
      <header className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Summarizer</h1>
        <button
          onClick={() => {
            setMessages([]);
            setSavedSummaries({});
            chrome.storage.local.remove(["messages", "summaries"]);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Reset
        </button>
      </header>

      <div className="grid grid-cols-3 gap-2 p-4 bg-white shadow">
        <button
          onClick={summarizeCurrentPage}
          className="flex flex-col items-center justify-center p-2 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
        >
          <FileText size={24} className="mb-1 text-blue-600" />
          <span className="text-sm">Summarize Page</span>
        </button>
        <button
          onClick={() => setInputText("rewrite: ")}
          className="flex flex-col items-center justify-center p-2 bg-purple-100 rounded hover:bg-purple-200 transition-colors"
        >
          <RefreshCcw size={24} className="mb-1 text-purple-600" />
          <span className="text-sm">Rewrite</span>
        </button>
        <button
          onClick={toggleSavedSummariesView}
          className="flex flex-col items-center justify-center p-2 bg-green-100 rounded hover:bg-green-200 transition-colors"
        >
          <Folder size={24} className="mb-1 text-green-600" />
          <span className="text-sm">View Saved</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-white">
        {viewSaved ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Saved Summaries</h2>
              <button
                onClick={toggleSavedSummariesView}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(savedSummaries).map(([key, summary]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                  >
                    <p className="text-sm flex-1 mr-2">{summary}</p>
                    <button
                      onClick={() => deleteSummary(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {Object.keys(savedSummaries).length > 0 && (
              <button
                onClick={deleteAllSummaries}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete All
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  message.isUser
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your command..."
            className="flex-1 px-3 py-2 border text-black bg-white rounded focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleUserInput(inputText)}
          />
          <button
            onClick={() => handleUserInput(inputText)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
