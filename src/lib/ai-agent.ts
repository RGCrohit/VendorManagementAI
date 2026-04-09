import { supabase } from './auth/supabase';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyCqJTeTgJ_RXQbM09eZv6yQ-cHHtMlnjxI";
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * CureVendAI Assistant — queries real Supabase data and uses Gemini for intelligence.
 */
export async function queryCureVendAI(prompt: string) {
  const q = prompt.toLowerCase().trim();
  
  try {
    // 1. Handle simple greetings locally for extreme speed
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.includes(q)) {
      return `Hi there! I'm your CureVendAI assistant. How can I help you today? You can ask me for a summary of your vendors, projects, or payments.`;
    }

    // 2. Decide if we need data context
    let dataContext = '';
    const needsData = q.includes('summary') || q.includes('project') || q.includes('vendor') || q.includes('payment') || q.includes('spend') || q.includes('money');
    
    if (needsData) {
      // Fetch relevant data FOR context
      const [{ data: vendors }, { data: projects }, { data: payments }] = await Promise.all([
        supabase.from('vendors').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('payments').select('amount, status, description, invoice_date')
      ]);

      dataContext = `
        Current System Data (Context):
        - Vendors: ${JSON.stringify(vendors || [])}
        - Projects: ${JSON.stringify(projects || [])}
        - Payments: ${JSON.stringify(payments || [])}
      `;
    }

    // 3. Prepare the final prompt
    const systemInstructions = `
      You are the CureVendAI Assistant. 
      Speak in a simple, friendly, and professional business tone.
      NEVER use technical jargon.
      When providing data summaries, use clean bullet points.
      If context is missing, don't make up numbers. Just say you don't have that data yet.
    `;

    // 4. Generate response
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return "I need a Gemini API key to function. Please add NEXT_PUBLIC_GEMINI_API_KEY to your env vars.";
    }

    const result = await model.generateContent([
      { text: systemInstructions },
      { text: dataContext || "No live data context provided for this query." },
      { text: prompt }
    ]);
    
    const response = await result.response;
    const text = response.text();
    
    return text || "I understood your request but couldn't generate a clear answer. Could you rephrase?";

  } catch (error: any) {
    console.error('AI Agent Error:', error);
    if (error.message?.includes('API_KEY_INVALID')) {
      return "The Gemini API key provided is invalid. Please check your configuration.";
    }
    return "I'm having trouble accessing my intelligence right now. Please try again in a few moments.";
  }
}
