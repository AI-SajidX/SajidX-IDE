
"use client";

import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";

// Default code for each language
const defaultCodes = {
  c: `#include <stdio.h>

int main() {
    printf("Hello SajidX IDE!");
    return 0;
}`,

  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello SajidX IDE!";
    return 0;
}`,
};

export default function Home() {
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [code, setCode] = useState(defaultCodes.cpp);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [executionTime, setExecutionTime] = useState("");
  const [memory, setMemory] = useState("");

  // New Features
  const [theme, setTheme] = useState("vs-dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clear Previous Results
  const clearResults = () => {
    setOutput("");
    setStatus("");
    setExecutionTime("");
    setMemory("");
  };

  // Change Language
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    setLanguage(selectedLanguage);
    setCode(defaultCodes[selectedLanguage]);
    clearResults();
  };

  // Clear Output
  const handleClearOutput = () => {
    clearResults();
  };

  // Reset Code
  const handleResetCode = () => {
    setCode(defaultCodes[language]);
    setInput("");
    clearResults();
  };

  // Copy Code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      setOutput("Unable to copy code. Please try again.");
    }
  };

  // Toggle Theme
  const handleThemeChange = () => {
    setTheme((previousTheme) =>
      previousTheme === "vs-dark" ? "light" : "vs-dark"
    );
  };

  // Run Code
  const handleRun = async () => {
    try {
      setLoading(true);

      setOutput("Compiling your code...");
      setStatus("Processing");
      setExecutionTime("");
      setMemory("");

      const response = await fetch(
        "http://localhost:5000/api/compile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language,
            input,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Compilation failed");
      }

      setStatus(data.status || "Unknown");
      setExecutionTime(data.time || "");
      setMemory(data.memory ?? "");

      setOutput(data.output || "No output");

    } catch (error) {
      setStatus("Error");
      setExecutionTime("");
      setMemory("");
      setOutput(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Status Color
  const statusColor =
    status === "Accepted"
      ? "text-green-400"
      : status === "Compilation Error"
      ? "text-red-400"
      : status?.includes("Runtime Error")
      ? "text-yellow-400"
      : status === "Error"
      ? "text-red-400"
      : "text-gray-400";

  const statusBg =
    status === "Accepted"
      ? "bg-green-500/10 border-green-500/30"
      : status === "Compilation Error"
      ? "bg-red-500/10 border-red-500/30"
      : status?.includes("Runtime Error")
      ? "bg-yellow-500/10 border-yellow-500/30"
      : status === "Error"
      ? "bg-red-500/10 border-red-500/30"
      : "bg-gray-500/10 border-gray-500/30";

  return (
    <main className="min-h-screen bg-[#0d1117] p-3 sm:p-6">

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            SajidX <span className="text-green-500">IDE</span>
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Code. Compile. Create.
          </p>
        </div>

        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-400 sm:text-sm">
          Online C / C++ Compiler
        </span>
      </div>

      {/* Editor Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

        <h2 className="text-lg font-semibold text-white">
          Code Editor
        </h2>

        <div className="flex flex-wrap gap-2">

          {/* Language Selector */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="rounded-lg border border-gray-700 bg-[#161b22] px-3 py-2 text-sm text-white outline-none"
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>

          {/* Theme Button */}
          <button
            onClick={handleThemeChange}
            className="rounded-lg border border-gray-700 bg-[#161b22] px-3 py-2 text-sm text-white transition hover:bg-gray-700"
          >
            {theme === "vs-dark" ? "☀ Light" : "☾ Dark"}
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            {copied ? "✓ Copied" : "Copy Code"}
          </button>

        </div>
      </div>

      {/* Code Editor */}
      <CodeEditor
        language={language}
        code={code}
        onChange={(value) => setCode(value || "")}
        theme={theme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() =>
          setIsFullscreen((previous) => !previous)
        }
      />

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-3">

        <button
          onClick={handleRun}
          disabled={loading}
          className="rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Running..." : "▶ Run Code"}
        </button>

        <button
          onClick={handleResetCode}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          Reset Code
        </button>

        <button
          onClick={handleClearOutput}
          className="rounded-lg bg-gray-700 px-5 py-2 font-semibold text-white transition hover:bg-gray-600"
        >
          Clear Output
        </button>

      </div>

      {/* Input and Output */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Custom Input */}
        <div>
          <h2 className="mb-3 font-semibold text-white">
            Custom Input
          </h2>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your input here..."
            className="h-48 w-full resize-none rounded-lg border border-gray-700 bg-[#161b22] p-4 text-white outline-none focus:border-green-500"
          />
        </div>

        {/* Output */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-white">
              Output
            </h2>

            {status && (
              <span
                className={`rounded-md border px-3 py-1 text-sm font-semibold ${statusColor} ${statusBg}`}
              >
                {status}
              </span>
            )}
          </div>

          <pre className="h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-gray-700 bg-[#161b22] p-4 text-sm text-gray-200">
            {output || "Your output will appear here..."}
          </pre>

          {/* Execution Information */}
          {(executionTime || memory !== "") && (
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-400">

              {executionTime && (
                <p>
                  <span className="text-gray-200">Time:</span>{" "}
                  {executionTime}s
                </p>
              )}

              {memory !== "" && memory !== null && (
                <p>
                  <span className="text-gray-200">Memory:</span>{" "}
                  {memory} KB
                </p>
              )}

            </div>
          )}
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-800 pt-5 text-center text-sm text-gray-500">
        An Online C / C++ Compiler by AI-SajidX
      </footer>

    </main>
  );
}
