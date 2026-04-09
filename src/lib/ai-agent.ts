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
      You are the CureVendAI Executive Assistant. 
      You have the power to PERFORM ACTIONS. 
      
      If the user wants to SEND AN EMAIL:
      Return ONLY a JSON string like this: {"action": "SEND_EMAIL", "to": "email", "subject": "title", "body": "content"}
      
      If the user wants to SCHEDULE A MEETING:
      Return ONLY a JSON string like this: {"action": "SCHEDULE_MEETING", "title": "name", "date": "YYYY-MM-DD", "time": "HH:mm"}
      
      Otherwise:
      Speak in a premium, friendly business tone. Use clean bullet points for data.
      If context is missing, say you don't have that data.
    `;

    // 4. Generate response
    const fullPrompt = `${systemInstructions}\n\nContext Data:\n${dataContext || "No live data available."}\n\nUser Query: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
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
