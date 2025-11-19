import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Robustly get the API key from supported environment variables
  const apiKey = process.env.API_KEY || process.env.VITE_API_KEY;

  if (!apiKey) {
    console.error("Server Error: API Key is missing. Checked API_KEY and VITE_API_KEY.");
    return res.status(500).json({ error: 'Server misconfiguration: API Key not set' });
  }

  try {
    // Handle body parsing manually if it comes in as a string (common in some serverless environments)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        console.error("Failed to parse request body:", e);
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const { documentText, question } = body || {};

    if (!documentText || !question) {
        return res.status(400).json({ error: 'Missing document text or question in request body' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";
  
    const prompt = `Based strictly and solely on the content of the following document, please provide a concise and factual answer to the user's question. Do not use any external knowledge or make assumptions beyond what is written in the text. If the answer cannot be found within the document, you must state that the information is not available in the provided text.

DOCUMENT:
---
${documentText}
---

QUESTION:
${question}
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return res.status(200).json({ answer: response.text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error processing your request' });
  }
}