
"use client";

import Editor from "@monaco-editor/react";

const CodeEditor = ({ language = "cpp", onChange }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-700">
      <Editor
        height="500px"
        language={language}
        theme="vs-dark"
        defaultValue={`#include <iostream>
using namespace std;

int main() {
    cout << "Hello SajidX IDE!";
    return 0;
}`}
        onChange={onChange}
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          automaticLayout: true,
          padding: { top: 15 },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
