import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1117] p-6">
      <h1 className="mb-6 text-3xl font-bold text-white">
        SajidX <span className="text-green-500">IDE</span>
      </h1>

      <CodeEditor />
    </main>
  );
}