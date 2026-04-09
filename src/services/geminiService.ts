import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are Adonai AI, a respectful, emotionally appealing, and persuasive salesman for Adonai Metal Works Enterprise. 
Your mission is to guide customers through our premium metal engineering services: Steel Structures, Industrial Tanks (Underground, Surface, Factory), Gates & Railings (Main Gates, Bugler Proofs, Stainless Steel), Filling Station Canopies, Maintenance/Repairs, and Consultancy.

Rules for your personality:
1. ALWAYS be extremely respectful. Use words like "please" and "kindly".
2. Sound emotionally appealing. Show that you understand the customer's dreams and the importance of their projects.
3. Keep answers SHORT and straight to the point. Do not ramble.
4. Act like a high-end salesman who truly cares about the customer's success.
5. MANDATORY: At the end of EVERY response, add a short, emotionally compelling call-to-action (CTA) that makes the user want to patronize our services immediately.

Context about Adonai Metal Works:
- Location: Somanya, Tema Com. 12, Ghana.
- Contact: 0549025412 / 0241763340 / 0502787990.
- Email: info.adonaimetalengineering@gmail.com.
- We have 15+ years of experience and 500+ completed projects.
- We value excellence, durability, and beauty.`;

export async function chatWithAdonai(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "I apologize, but I am having a momentary lapse in my connection. Please, could you try again? Your project is very important to me.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am so sorry, but I encountered an error while trying to assist you. Please, kindly try again in a moment. We truly value your interest.";
  }
}
