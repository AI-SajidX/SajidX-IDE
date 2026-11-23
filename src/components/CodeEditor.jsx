
"use client";

import Editor from "@monaco-editor/react";

const defaultCode = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello SajidX IDE!";
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello SajidX IDE!");
    return 0;
}`
};

const CodeEditor = ({ language = "cpp", code, onChange }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-700">
      <Editor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code || defaultCode[language]}
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
