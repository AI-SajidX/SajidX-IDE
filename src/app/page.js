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

  // Change Programming Language
  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;

    setLanguage(selectedLanguage);
    setCode(defaultCodes[selectedLanguage]);
    setOutput("");
  };

  const handleClearOutput = () => {
    setOutput("");
  };

  const handleResetCode = () => {
    setCode(defaultCodes[language]);
    setOutput("");
    setInput("");
  };

  // Run Code
  const handleRun = async () => {
    try {
      setLoading(true);
      setOutput("Compiling your code...");

      const response = await fetch("http://localhost:5000/api/compile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          input,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Compilation failed");
      }

      setOutput(`Status: ${data.status}\n\n${data.output || "No output"}`);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d1117] p-6">
      {/* Header */}
      <h1 className="mb-6 text-3xl font-bold text-white">
        SajidX <span className="text-green-500">IDE</span>
      </h1>

      {/* Editor Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Code Editor</h2>

        <select
          value={language}
          onChange={handleLanguageChange}
          className="rounded-lg border border-gray-700 bg-[#161b22] px-4 py-2 text-white"
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      {/* Code Editor */}
      <CodeEditor
        language={language}
        code={code}
        onChange={(value) => setCode(value || "")}
      />

      {/* Run Button */}

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleRun}
          disabled={loading}
          className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Running..." : "▶ Run Code"}
        </button>

        <button
          onClick={handleResetCode}
          className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Reset Code
        </button>

        <button
          onClick={handleClearOutput}
          className="rounded-lg bg-gray-700 px-6 py-2 font-semibold text-white hover:bg-gray-600"
        >
          Clear Output
        </button>
      </div>

      {/* Input and Output */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Custom Input */}
        <div>
          <h2 className="mb-3 font-semibold text-white">Custom Input</h2>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your input here..."
            className="h-40 w-full resize-none rounded-lg border border-gray-700 bg-[#161b22] p-4 text-white outline-none"
          />
        </div>

        {/* Output */}
        <div>
          <h2 className="mb-3 font-semibold text-white">Output</h2>

          <pre className="h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-gray-700 bg-[#161b22] p-4 text-green-400">
            {output || "Your output will appear here..."}
          </pre>
        </div>
      </div>
    </main>
  );
}
