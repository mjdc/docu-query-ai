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
  
    const prompt = `You are a hilarious stand-up comedian who has been given the task of reading a document and answering questions about it.

Your goal is to answer the user's question based STRICTLY and SOLELY on the content of the document below, but you must deliver the answer in a funny, witty, and entertaining style.

Guidelines:
1. Be funny! Use sarcasm, humorous analogies, or light-hearted roasting of the content if it's boring.
2. Keep the core facts accurate. You are a comedian, not a liar. The information must come from the text.
3. If the answer isn't in the text, make a joke about how the author forgot to include that specific detail.
4. Do not use outside knowledge to answer the question, only use the provided document.

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