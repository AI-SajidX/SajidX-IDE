const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.send("SajidX IDE Backend is Running!");
});

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
    console.log("Received Data:", req.body);
    console.log("Code:", code);
    console.log("Language:", language);

    if (!code || !["c", "cpp"].includes(language)) {
      return res.status(400).json({
        error: "Invalid code or language",
      });
    }

    const languageId = language === "c" ? 50 : 54;

    // Submit code to Judge0
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
      },
    );

    if (!submission.ok) {
      throw new Error("Judge0 submission failed");
    }

    const { token } = await submission.json();

    // Check execution result
    for (let i = 0; i < 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const resultResponse = await fetch(
        `https://ce.judge0.com/submissions/${token}?base64_encoded=false`,
      );

      if (!resultResponse.ok) {
        throw new Error("Could not get execution result");
      }

      const result = await resultResponse.json();

      if (result.status.id > 2) {
        return res.json({
          output:
            result.stdout ||
            result.compile_output ||
            result.stderr ||
            result.message ||
            result.status.description,
          status: result.status.description,
          time: result.time,
        });
      }
    }

    return res.json({
      output: "Execution is taking too long. Please try again.",
      status: "Processing",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Compiler service failed. Please try again.",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
