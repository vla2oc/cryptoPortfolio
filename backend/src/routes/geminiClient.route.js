import { Router } from "express";
import { fetchNewsSentiment } from "../routes/python_sentiment.route.js";
import { askGemini } from "../services/geminiClient.js";
import { cryptoAssets } from "./assets.route.js";

const router = Router();

// POST /api/agent/chat
// body: { message: string, portfolio?: [{ symbol, amount? }] }
router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Field 'message' is required" });
        }
        const data = await fetchNewsSentiment(10, "cryptocurrency");
        const news = await data.results || data;


        const userPortfolio = cryptoAssets


        const prompt = `
You are CryptoBert AI, a crypto market assistant.

You have:
- User's portfolio (coins they hold).
- Recent crypto news labeled as positive/negative/neutral by a FinBERT-based crypto model.
- A direct question from the user.

Rules:
- Use ONLY the provided labeled news as your main signal.
- Focus on coins from the user's portfolio when relevant.
- Be concise, structured, no hype, no financial advice language.
- Answer in clear English.

User portfolio:
${JSON.stringify(userPortfolio, null, 2)}

Labeled news:
${JSON.stringify(news, null, 2)}

User question:
"${message}"

Now respond:
When answering:
- Always base your reasoning on the provided labeled news.
- Adapt your format to the user's question.
- If the user asks about overall market mood, provide a short structured summary:
  1) Market overview
  2) Key coins / sectors
  3) Risks / catalysts
  4) One-line verdict (bullish / bearish / mixed)
- If the user asks about a specific coin or topic, focus on that and only include the final verdict if it is relevant.
- Do NOT invent facts that are not supported by the provided news.

`;

        const answer = await askGemini(prompt);

        return res.json({
            answer,
            news, 
        });
    } catch (err) {
        console.error("Agent error:", err);
        return res.status(500).json({ error: "Failed to generate agent response" });
    }
});

export default router;
