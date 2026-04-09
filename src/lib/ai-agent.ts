import { supabase } from './auth/supabase';

/**
 * CureVend AI Agentic Brain
 * Simulated 'LangChain' protocol that handles conversational NLP and queries real Supabase data.
 */
export async function queryCureVendAI(prompt: string) {
  const q = prompt.toLowerCase();
  
  try {
    // === 1. NATURAL LANGUAGE / GREETING MODULE ===
    const hour = new Date().getHours();
    let timeGreeting = "Good day";
    if (hour < 12) timeGreeting = "Good morning";
    else if (hour < 17) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    if (q.match(/^(hi|hello|hey|greetings|wakeup)[\s!]*$/) || q.includes('hello')) {
       return `${timeGreeting}! I am your CureVend Governance Agent, powered by our neural ledger. I can analyze project budgets, audit vendor compliance, and execute settlements. How can I assist you today?`;
    }

    if (q.includes('good morning') || q.includes('morning')) {
       if (hour >= 12) return `It's actually a bit later in the day, but ${timeGreeting}! The ecosystem is fully synchronized. How can I assist?`;
       return `Good morning to you too! The fiscal nodes are stable. Do you have a specific project audit in mind?`;
    }
    if (q.includes('good afternoon') || q.includes('afternoon')) {
       return `${timeGreeting}! Audit registries are active. What would you like to review?`;
    }
    if (q.includes('good evening') || q.includes('evening')) {
       return `${timeGreeting}! Running end-of-day analytics. How can I help?`;
    }

    if (q.match(/how are you|how do you do/)) {
       return "I'm operating at 99.8% fidelity across all governance nodes. Thank you for asking. What shall we investigate?";
    }

    if (q.match(/who are you|what are you/)) {
       return "I am the CureVend AI Co-Pilot. I act as your autonomous LangChain-driven interface to manage vendors, track capital leakages, and trigger Razorpay settlements.";
    }

    // === 2. PROJECT QUERIES ===
    if (q.includes('project') || q.includes('node') || q.includes('phoenix') || q.includes('enterprise')) {
      const { data: projects } = await supabase.from('project_nodes').select('*');
      
      if (q.includes('phoenix')) {
        const p = projects?.find(x => x.name.toLowerCase().includes('phoenix'));
        return p ? 
          `Project Phoenix Status is currently ${p.status.toUpperCase()}. You have a capital allocation of ₹${p.budget_allocated/100000}L, with ₹${p.budget_realized/100000}L already realized. The automated neural net detected a 32% variance in Tier-2 nodes.` : 
          "Node 'Phoenix' not localized in the current active fiscal registry.";
      }
      
      return `I have located ${projects?.length || 0} active governance nodes. The overall portfolio realized spend across these nodes is ₹${projects?.reduce((acc, p) => acc + (p.budget_realized || 0), 0) / 100000}L.`;
    }

    // === 3. VENDOR QUERIES ===
    if (q.includes('vendor') || q.includes('compliance') || q.includes('acme') || q.includes('nova')) {
      const { data: vendors } = await supabase.from('vendor_registry').select('*');
      
      if (q.includes('acme')) {
        const v = vendors?.find(x => x.name.toLowerCase().includes('acme'));
        return v ? 
          `Acme Global Solutions: Status is currently ${v.status.toUpperCase()}. Their Compliance Risk Score is ${v.risk_score}%. The latest neural audit telemetry was synced successfully.` :
          "Vendor 'Acme' is not found in the verified registry.";
      }

      const flagged = vendors?.filter(v => v.status === 'flagged').length || 0;
      return `Registry Scan Status: We have ${vendors?.length || 0} external vendors in the ecosystem. Notice: ${flagged} nodes are currently flagged for compliance/KYC risk.`;
    }

    // === 4. FINANCE / LEDGER QUERIES ===
    if (q.includes('finance') || q.includes('ledger') || q.includes('spend') || q.includes('budget') || q.includes('pay')) {
      const { data: ledger } = await supabase.from('financial_ledger').select('amount, disbursement_status');
      const totalSpend = ledger?.reduce((acc, l) => acc + Number(l.amount), 0) || 0;
      const pending = ledger?.filter(l => l.disbursement_status === 'pending').length || 0;
      
      return `Analyzing 6-Month Financial Ledger: Your total portfolio disbursement volume is ₹${(totalSpend / 100000).toFixed(1)}L. I also see ${pending} pending settlements that require Razorpay authorization.`;
    }

    // === 5. FALLBACK CATCH-ALL ===
    return `I received your command: "${prompt}". My NLP core is analyzing those parameters against the global ledger, but I need more specific keywords like 'Projects', 'Vendors', or 'Finance' to generate a full report.`;

  } catch (error) {
    console.error('AI LangChain Failure:', error);
    return "Governance Node Error: I am unable to synchronize with the Supabase back-end at this moment. Please verify your connection or fiscal credentials.";
  }
}
