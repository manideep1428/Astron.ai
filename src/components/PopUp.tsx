import { useState, useEffect } from "react";
import {
  FileText,
  RefreshCcw,
  Send,
  Trash2,
  Folder,
  X,
  Save,
} from "lucide-react";
import {
  summarizeFullText,
  summarizePageContentWithTitle,
} from "../api/summarize";
import { promptWithAIStreaming } from "../api/prompt";
import { rewriteText } from "../api/rewrite";

interface Message {
  text: string;
  isUser: boolean;
  isLoading?: boolean;
}

type SavedSummariesType = { [key: string]: string };

export default function Popup() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [savedSummaries, setSavedSummaries] = useState<SavedSummariesType>({});
  const [viewSaved, setViewSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["messages", "summaries"], (result) => {
      setMessages(result.messages || []);
      setSavedSummaries(result.summaries || {});
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ messages, summaries: savedSummaries });
  }, [messages, savedSummaries]);

  const addMessage = (
    text: string,
    isUser: boolean,
    isLoading: boolean = false
  ) => {
    setMessages((prev) => [...prev, { text, isUser, isLoading }]);
  };

  const updateLastMessage = (text: string, isLoading: boolean = false) => {
    setMessages((prev) =>
      prev.map((msg, index) =>
        index === prev.length - 1 ? { ...msg, text, isLoading } : msg
      )
    );
  };

  const showSkeleton = (text: string) => {
    setIsLoading(true);
    addMessage(text, false, true);
  };

  const summarizeCurrentPage = async () => {
    try {
      showSkeleton("Summarizing current page...");

      // Request page content from the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0] && tabs[0].id) {
          try {
            const [result] = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => {
                // More robust content extraction
                const pageContent = [
                  document.title,
                  document.body.innerText,
                  Array.from(
                    document.querySelectorAll(
                      "article, main, .content, .article"
                    )
                  )
                    .map((el) => el.textContent)
                    .join(" "),
                ].join("\n\n");

                // Log for debugging
                console.log(
                  "Extracted Page Content:",
                  pageContent.slice(0, 500) + "..."
                );

                return pageContent;
              },
            });

            if (result && result.result) {
              const { content: summary } = await summarizePageContentWithTitle(
                result.result
              );
              updateLastMessage(`Summary: ${summary}`);
            } else {
              throw new Error("Could not extract page content.");
            }
          } catch (scriptErr) {
            console.error("Script Execution Error:", scriptErr);
            updateLastMessage(
              `Error: ${
                scriptErr instanceof Error
                  ? scriptErr.message
                  : "Failed to summarize page."
              }`
            );
          }
        } else {
          throw new Error("No active tab found.");
        }
      });
    } catch (err) {
      console.error("Summarization Error:", err);
      updateLastMessage(
        `Error: ${
          err instanceof Error ? err.message : "Failed to summarize page."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentPageSummary = async () => {
    try {
      showSkeleton("Saving current page summary...");

      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs[0] && tabs[0].id) {
          try {
            const [result] = await chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              func: () => {
                // More robust content extraction
                const pageContent = [
                  document.title,
                  document.body.innerText,
                  Array.from(
                    document.querySelectorAll(
                      "article, main, .content, .article"
                    )
                  )
                    .map((el) => el.textContent)
                    .join(" "),
                ].join("\n\n");

                return pageContent;
              },
            });

            if (result && result.result) {
              const { title, content: summary } =
                await summarizePageContentWithTitle(result.result);
              const summaryId = `summary-${Date.now()}`;
              setSavedSummaries((prev) => ({
                ...prev,
                [summaryId]: `${title}: ${summary}`,
              }));

              updateLastMessage("Page summary saved successfully!");
            } else {
              throw new Error("Could not extract page content.");
            }
          } catch (scriptErr) {
            console.error("Script Execution Error:", scriptErr);
            updateLastMessage(
              `Error: ${
                scriptErr instanceof Error
                  ? scriptErr.message
                  : "Failed to save page summary."
              }`
            );
          }
        } else {
          throw new Error("No active tab found.");
        }
      });
    } catch (err) {
      console.error("Save Summary Error:", err);
      updateLastMessage(
        `Error: ${
          err instanceof Error ? err.message : "Failed to save page summary."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;

    addMessage(input, true);
    setIsLoading(true);

    try {
      if (input.startsWith("rewrite:")) {
        showSkeleton("Rewriting text...");
        const textToRewrite = input.slice(8).trim();
        const rewrittenText = await rewriteText(textToRewrite);
        updateLastMessage(`Rewritten: ${rewrittenText}`);
      } else if (input.startsWith("summarize:")) {
        showSkeleton("Summarizing text...");
        const textToSummarize = input.slice(10).trim();
        const summary = await summarizeFullText(textToSummarize);
        updateLastMessage(`Summary: ${summary}`);
      } else {
        showSkeleton("Processing input...");
        let streamedSummary = "";
        await promptWithAIStreaming(input, (chunk) => {
          streamedSummary += chunk;
          updateLastMessage(streamedSummary, true);
        });
        updateLastMessage(streamedSummary);
      }
    } catch (err) {
      updateLastMessage(
        `Error: ${err instanceof Error ? err.message : "Something went wrong."}`
      );
    } finally {
      setInputText("");
      setIsLoading(false);
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

      <div className="grid grid-cols-4 gap-2 p-4 bg-white shadow">
        <button
          onClick={summarizeCurrentPage}
          className="flex flex-col items-center justify-center p-2 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
          disabled={isLoading}
        >
          <FileText size={24} className="mb-1 text-blue-600" />
          <span className="text-sm">Summarize Page</span>
        </button>
        <button
          onClick={saveCurrentPageSummary}
          className="flex flex-col items-center justify-center p-2 bg-green-100 rounded hover:bg-green-200 transition-colors"
          disabled={isLoading}
        >
          <Save size={24} className="mb-1 text-green-600" />
          <span className="text-sm">Save Page</span>
        </button>
        <button
          onClick={() => setInputText("rewrite: ")}
          className="flex flex-col items-center justify-center p-2 bg-purple-100 rounded hover:bg-purple-200 transition-colors"
          disabled={isLoading}
        >
          <RefreshCcw size={24} className="mb-1 text-purple-600" />
          <span className="text-sm">Rewrite</span>
        </button>
        <button
          onClick={toggleSavedSummariesView}
          className="flex flex-col items-center justify-center p-2 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors"
          disabled={isLoading}
        >
          <Folder size={24} className="mb-1 text-yellow-600" />
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
                  message.isUser ? "bg-blue-100" : "bg-gray-200"
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                    <p>{message.text}</p>
                  </div>
                ) : (
                  <p>{message.text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your command here..."
          className="w-full bg-white text-black px-3 py-2 border rounded"
          disabled={isLoading}
        />
        <button
          onClick={() => handleUserInput(inputText)}
          disabled={isLoading}
          className={`px-4 py-2 text-white rounded transition-colors ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
