
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

// Home Route
app.get("/", (req, res) => {
  res.send("SajidX IDE Backend is Running!");
});

// Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Frontend connected successfully!",
  });
});

// Compile API
app.post("/api/compile", async (req, res) => {
  try {
    const { code, language, input } = req.body;

    console.log("Received:", { language });

    // Validate Input
    if (
      typeof code !== "string" ||
      !code.trim() ||
      !["c", "cpp"].includes(language)
    ) {
      return res.status(400).json({
        error: "Invalid code or language",
      });
    }

    // Judge0 Language IDs
    const languageId = language === "c" ? 50 : 54;

    // Submit Code to Judge0
    const submission = await fetch(
      "https://ce.judge0.com/submissions?base64_encoded=false&wait=false",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: input || "",
          cpu_time_limit: 2,
          memory_limit: 128000,
          enable_network: false,
        }),
      }
    );

    if (!submission.ok) {
      const details = await submission.text();

      console.error("Submission Error:", {
        status: submission.status,
        details,
      });

      throw new Error(
        `Judge0 submission failed: HTTP ${submission.status}`
      );
    }

    const { token } = await submission.json();

    if (!token) {
      throw new Error("Judge0 did not return a token");
    }

    // Poll Execution Result
    for (let i = 0; i < 25; i++) {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      const resultResponse = await fetch(
        `https://ce.judge0.com/submissions/${token}?base64_encoded=false`
      );

      console.log(
        "Judge0 HTTP Status:",
        resultResponse.status
      );

      const responseText = await resultResponse.text();

      console.log("Judge0 Raw Response:", responseText);

      if (!resultResponse.ok) {
        throw new Error(
          `Judge0 result failed: HTTP ${resultResponse.status} - ${responseText}`
        );
      }

      const result = JSON.parse(responseText);

      // 1 = In Queue, 2 = Processing
      if (result.status.id <= 2) {
        continue;
      }

      // Get Compiler / Runtime Output
      const output =
        result.compile_output ||
        result.stderr ||
        result.stdout ||
        result.message ||
        result.status.description;

      return res.json({
        success: result.status.id === 3,
        output: output || "No output",
        status: result.status.description,
        time: result.time,
        memory: result.memory,
      });
    }

    // Timeout
    return res.status(504).json({
      error: "Execution timeout. Please try again.",
    });

  } catch (error) {
    console.error("Compiler Error:", error);

    return res.status(500).json({
      error: error.message || "Compiler service failed",
    });
  }
});

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
