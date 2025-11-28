import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    // The GenAI SDK can return the model output in different shapes depending on version
    // and streaming vs non-streaming usage. Try a few common paths to extract a text string
    // and fall back to a safe stringified representation so the client always receives valid JSON.
    let answerText: string = '';

    try {
      // Common simple property
      if (response && typeof response.text === 'string') {
        answerText = response.text;
      }

      // genai newer shapes: output[0].content[0].text or candidates
      if (!answerText && response?.output && Array.isArray(response.output) && response.output[0]) {
        const out = response.output[0];
        if (out?.content && Array.isArray(out.content) && out.content[0]?.text) {
          answerText = out.content[0].text;
        }
      }

      if (!answerText && response?.candidates && Array.isArray(response.candidates) && response.candidates[0]) {
        const cand = response.candidates[0];
        if (cand?.content && Array.isArray(cand.content) && cand.content[0]?.text) {
          answerText = cand.content[0].text;
        }
      }

      // last resort: if response has a single top-level string somewhere, stringify the whole response
      if (!answerText) {
        answerText = typeof response === 'string' ? response : JSON.stringify(response);
      }
    } catch (e) {
      console.error('Error extracting text from Gemini response shape:', e, response);
      answerText = JSON.stringify(response);
    }

    return res.status(200).json({ answer: answerText });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: 'Internal Server Error processing your request' });
  }
}