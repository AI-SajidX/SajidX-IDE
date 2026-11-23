"use client";

import { useState } from "react";
import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
    cout << "Hello SajidX IDE!";
    return 0;
}`);
  const handleRun = async () => {
    try {
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
    }
  };

  return (
    <main className="min-h-screen bg-[#0d1117] p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">
        SajidX <span className="text-green-500">IDE</span>
      </h1>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Code Editor</h2>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-lg border border-gray-700 bg-[#161b22] px-4 py-2 text-white"
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      <CodeEditor
        language={language}
        code={code}
        onChange={(value) => setCode(value || "")}
      />

      <div className="mt-4">
        <button
          onClick={handleRun}
          className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
        >
          ▶ Run Code
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <h2 className="mb-3 font-semibold text-white">Custom Input</h2>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your input here..."
            className="h-40 w-full resize-none rounded-lg border border-gray-700 bg-[#161b22] p-4 text-white outline-none"
          />
        </div>

        <div>
          <h2 className="mb-3 font-semibold text-white">Output</h2>

          <div className="h-40 overflow-auto rounded-lg border border-gray-700 bg-[#161b22] p-4 text-green-400">
            {output || "Your output will appear here..."}
          </div>
        </div>
      </div>
    </main>
  );
}
