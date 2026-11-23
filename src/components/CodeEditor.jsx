
"use client";

import Editor from "@monaco-editor/react";

const CodeEditor = ({
  language = "cpp",
  code,
  onChange,
  theme = "vs-dark",
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-[#0d1117] p-3 sm:p-5"
          : "overflow-hidden rounded-xl border border-gray-700"
      }
    >
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-700 bg-[#161b22] px-4 py-3">
        <h3 className="font-semibold text-white">
          {language === "cpp" ? "C++ Editor" : "C Editor"}
        </h3>

        <button
          onClick={onToggleFullscreen}
          className="rounded-lg bg-gray-700 px-3 py-2 text-sm text-white transition hover:bg-gray-600"
        >
          {isFullscreen ? "✕ Exit Full Screen" : "⛶ Full Screen"}
        </button>
      </div>

      {/* Monaco Editor */}
      <div className={isFullscreen ? "min-h-0 flex-1" : ""}>
        <Editor
          height={
            isFullscreen
              ? "100%"
              : "500px"
          }
          language={language}
          theme={theme}
          value={code}
          onChange={onChange}
          options={{
            fontSize: 15,
            minimap: { enabled: false },
            automaticLayout: true,
            padding: { top: 15 },
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
