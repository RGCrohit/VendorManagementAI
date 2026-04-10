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
    const needsData = q.includes('summary') || q.includes('project') || q.includes('vendor') || q.includes('payment') || q.includes('spend') || q.includes('money') || q.includes('org') || q.includes('view') || q.includes('report') || q.includes('hierarchy');
    
    if (needsData) {
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
      Speak in a premium, friendly business tone. Use clean bullet points for data.
      
      IF THE USER WANTS TO PERFORM AN ACTION:
      1. Send Email: Return ONLY a JSON like {"action": "SEND_EMAIL", "to": "email", "subject": "title", "body": "content"}
      2. Schedule Meeting: Return ONLY a JSON like {"action": "SCHEDULE_MEETING", "title": "name", "date": "YYYY-MM-DD", "time": "HH:mm"}
      
      IMPORTANT: If you return a JSON action, do NOT include ANY other text before or after the JSON.
    `;

    const fullPrompt = `${systemInstructions}\n\nContext Data:\n${dataContext || "No live data available."}\n\nUser Query: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();

    // 4. Robust JSON Extraction (Regex-based)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const jsonData = JSON.parse(jsonMatch[0]);
        if (jsonData.action) return jsonMatch[0]; // Return the raw JSON for the UI to handle
      } catch (e) {
        // Not actual JSON, continue to return text
      }
    }
    
    return text || "I'm here to help. Could you tell me more about what you need?";

  } catch (error: any) {
    // DIAGNOSTIC LOGGING: This helps identify if it's a Supabase error or a Gemini error
    console.error('--- AI AGENT DIAGNOSTIC START ---');
    console.error('Query:', prompt);
    console.error('Error Message:', error.message);
    console.error('Error Details:', error);
    console.error('--- AI AGENT DIAGNOSTIC END ---');

    if (error.message?.includes('API_KEY_INVALID')) return "API Key error. Please contact administration.";
    if (error.message?.includes('safety')) return "Your request was flagged by safety filters. Could you try rephrasing?";
    
    // Check for common Supabase table errors
    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
       return "Database error: One or more tables (vendors, projects, payments) are missing. Please run the SQL migrations in Supabase.";
    }

    return "I'm having a quick sync with the servers. Please try again in 5 seconds.";
  }
}
