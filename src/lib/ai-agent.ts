import { supabase } from './auth/supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * CureVendAI Assistant — queries real Supabase data and uses Gemini for intelligence.
 */
export async function queryCureVendAI(prompt: string) {
  try {
    // 1. Fetch relevant data for context
    const { data: vendors } = await supabase.from('vendors').select('*');
    const { data: projects } = await supabase.from('projects').select('*');
    const { data: payments } = await supabase.from('payments').select('amount, status, description, invoice_date');

    // 2. Format context for Gemini
    const context = `
      You are the CureVendAI Assistant, a friendly and professional project management helper. 
      Your goal is to answer questions about the user's vendors, projects, and payments in simple, easy-to-understand language.
      Avoid jargon like "compliance node" or "fidelity sync".
      
      Current Data:
      - Vendors: ${JSON.stringify(vendors || [])}
      - Projects: ${JSON.stringify(projects || [])}
      - Payments: ${JSON.stringify(payments || [])}
      
      Instructions:
      - If the user asks for a summary, provide a clear overview with bullet points.
      - If they ask about a specific vendor or project, look it up in the data above.
      - If the data is empty, mention that no records were found yet.
      - Be helpful, conversational, and use emojis where appropriate.
      - Never mention technical details like JSON or SQL.
    `;

    // 3. Generate response with Gemini
    const result = await model.generateContent([context, prompt]);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('AI Agent Error:', error);
    
    // Fallback to simple hardcoded logic if Gemini fails
    const q = prompt.toLowerCase();
    if (q.includes('summary')) {
       return "I'm having a bit of trouble reaching my AI brain right now, but I can see you have some projects and vendors active. Try again in a moment!";
    }
    return "Something went wrong while processing your request. Please check your Gemini API key or try again later.";
  }
}
