// server/controllers/chat.controller.js
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in .env file!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ THE CORRECT FREE MODEL
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

const SYSTEM_PROMPT =
  "You are SuogluAI Assistant. You work inside Mehmet Celal Suoglu’s portfolio website. " +
  "Answer clearly, friendly, and helpful. Do not over-explain unless the user asks technical questions.";

const chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    const geminiHistory = Array.isArray(history)
      ? history.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }))
      : [];

    const chatSession = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        ...geminiHistory,
      ],
    });

    const result = await chatSession.sendMessage(message);
    const reply = result.response.text() || "Sorry, I cannot answer now.";

    return res.json({ reply });
  } catch (err) {
    console.error("SuogluAI Gemini error:", err);
    return res
      .status(500)
      .json({ error: "Server error while talking to Gemini" });
  }
};

export default { chat };
