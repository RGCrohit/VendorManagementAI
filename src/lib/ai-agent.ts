import { supabase } from './auth/supabase';

/**
 * CureVendAI Assistant — queries real Supabase data and responds in plain English.
 */
export async function queryCureVendAI(prompt: string) {
  const q = prompt.toLowerCase().trim();
  
  try {
    // ── Greetings ──────────────────────────────────────────────────
    const hour = new Date().getHours();
    let greeting = "Hi";
    if (hour < 12) greeting = "Good morning";
    else if (hour < 17) greeting = "Good afternoon";
    else greeting = "Good evening";

    if (q.match(/^(hi|hello|hey|greetings)[!\s]*$/) || q === 'hello') {
       return `${greeting}! I'm your CureVendAI assistant. I can look up vendor info, project budgets, payment status, and more. What would you like to know?`;
    }

    if (q.match(/how are you/)) {
       return "I'm running great! Everything looks good on my end. How can I help you today?";
    }

    if (q.match(/who are you|what are you|what can you do/)) {
       return "I'm the CureVendAI assistant. I can help you check vendor details, project progress, payment history, and answer questions about your data. Just ask!";
    }

    // ── Summary / Overview ─────────────────────────────────────────
    if (q.includes('summary') || q.includes('overview') || q.includes('dashboard') || q.includes('status')) {
      const { data: vendors } = await supabase.from('vendors').select('*');
      const { data: projects } = await supabase.from('projects').select('*');
      const { data: payments } = await supabase.from('payments').select('amount, status');

      const vendorCount = vendors?.length || 0;
      const activeVendors = vendors?.filter(v => v.status === 'active').length || 0;
      const projectCount = projects?.length || 0;
      const totalSpend = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0;

      return `Here's your quick summary:\n\n• Vendors: ${vendorCount} total (${activeVendors} active)\n• Projects: ${projectCount} in progress\n• Total payments: ₹${(totalSpend / 100000).toFixed(1)}L\n• Pending payments: ${pendingPayments}\n\nAnything specific you'd like to dig into?`;
    }

    // ── Project Queries ────────────────────────────────────────────
    if (q.includes('project') || q.includes('budget') || q.includes('phoenix') || q.includes('enterprise') || q.includes('supply chain')) {
      const { data: projects } = await supabase.from('projects').select('*');
      
      // Search for a specific project by name
      const searchTerms = ['phoenix', 'enterprise', 'supply chain'];
      const matchedTerm = searchTerms.find(t => q.includes(t));
      
      if (matchedTerm) {
        const p = projects?.find(x => x.name.toLowerCase().includes(matchedTerm));
        if (p) {
          const budgetL = (p.budget / 100000).toFixed(1);
          const spentL = (p.spent / 100000).toFixed(1);
          const pct = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
          return `📋 ${p.name}\n\n• Status: ${p.status}\n• Budget: ₹${budgetL}L\n• Spent so far: ₹${spentL}L (${pct}%)\n• Timeline: ${p.timeline || 'Not set'}\n• Vendors assigned: ${p.vendor_count || 0}`;
        }
        return `I couldn't find a project matching "${matchedTerm}". Try asking "show all projects" to see what's available.`;
      }
      
      if (projects && projects.length > 0) {
        const list = projects.map(p => `• ${p.name} — ${p.status} (₹${(p.spent / 100000).toFixed(1)}L of ₹${(p.budget / 100000).toFixed(1)}L spent)`).join('\n');
        return `You have ${projects.length} projects:\n\n${list}\n\nAsk me about any specific project for more details!`;
      }
      return "No projects found in the database yet.";
    }

    // ── Vendor Queries ─────────────────────────────────────────────
    if (q.includes('vendor') || q.includes('supplier') || q.includes('acme') || q.includes('nova') || q.includes('zenith') || q.includes('delta') || q.includes('apex') || q.includes('sigma')) {
      const { data: vendors } = await supabase.from('vendors').select('*');
      
      // Search for specific vendor
      const vendorNames = ['acme', 'nova', 'zenith', 'delta', 'apex', 'sigma', 'omega', 'prime'];
      const matchedVendor = vendorNames.find(n => q.includes(n));
      
      if (matchedVendor) {
        const v = vendors?.find(x => x.name.toLowerCase().includes(matchedVendor));
        if (v) {
          return `🏢 ${v.name}\n\n• Industry: ${v.industry || v.sector || 'N/A'}\n• Status: ${v.status}\n• Rating: ${v.rating || v.risk_score || 'N/A'}%\n• Joined: ${v.joined_at ? new Date(v.joined_at).toLocaleDateString() : 'N/A'}`;
        }
        return `I couldn't find a vendor matching "${matchedVendor}".`;
      }

      if (vendors && vendors.length > 0) {
        const active = vendors.filter(v => v.status === 'active' || v.status === 'verified').length;
        const pending = vendors.filter(v => v.status === 'pending').length;
        const suspended = vendors.filter(v => v.status === 'suspended' || v.status === 'flagged').length;
        
        return `You have ${vendors.length} vendors:\n\n• ✅ Active: ${active}\n• ⏳ Pending: ${pending}\n• ❌ Suspended/Flagged: ${suspended}\n\nAsk about a specific vendor by name for more details!`;
      }
      return "No vendors found in the database yet.";
    }

    // ── Payment / Finance Queries ──────────────────────────────────
    if (q.includes('payment') || q.includes('finance') || q.includes('spend') || q.includes('money') || q.includes('invoice') || q.includes('paid') || q.includes('pending')) {
      const { data: payments } = await supabase.from('payments').select('amount, status, invoice_date');
      
      if (payments && payments.length > 0) {
        const totalSpend = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const paid = payments.filter(p => p.status === 'paid');
        const pending = payments.filter(p => p.status === 'pending');
        const paidTotal = paid.reduce((sum, p) => sum + Number(p.amount), 0);
        const pendingTotal = pending.reduce((sum, p) => sum + Number(p.amount), 0);
        
        return `💰 Payment Summary:\n\n• Total: ₹${(totalSpend / 100000).toFixed(1)}L across ${payments.length} transactions\n• Completed: ₹${(paidTotal / 100000).toFixed(1)}L (${paid.length} payments)\n• Pending: ₹${(pendingTotal / 100000).toFixed(1)}L (${pending.length} payments)\n\nNeed to see the Finance page? Just say "go to finance".`;
      }
      return "No payment records found yet.";
    }

    // ── Meeting Queries ────────────────────────────────────────────
    if (q.includes('meeting') || q.includes('schedule') || q.includes('calendar') || q.includes('call')) {
      const { data: meetings } = await supabase.from('meetings').select('*').order('meeting_date', { ascending: true }).limit(5);
      
      if (meetings && meetings.length > 0) {
        const list = meetings.map(m => `• ${m.title} — ${new Date(m.meeting_date).toLocaleDateString()} at ${m.meeting_time || 'TBD'}`).join('\n');
        return `📅 Upcoming Meetings:\n\n${list}\n\nWant to schedule a new meeting? Head to the Meetings page!`;
      }
      return "No meetings scheduled yet. You can create one from the Meetings page!";
    }

    // ── Help ───────────────────────────────────────────────────────
    if (q.includes('help') || q.includes('what can')) {
       return "Here's what I can help with:\n\n• \"Show me a summary\" — Quick overview of everything\n• \"How are my projects doing?\" — Project status & budgets\n• \"Tell me about vendors\" — Vendor list & status\n• \"Payment status\" — Payment summary\n• \"Any meetings coming up?\" — Upcoming schedule\n\nOr just ask naturally — I'll figure it out! 😊";
    }

    // ── Fallback ──────────────────────────────────────────────────
    return `I heard: "${prompt}"\n\nI'm not sure what you're looking for. Try asking about:\n• Projects (budgets, status)\n• Vendors (details, ratings)\n• Payments (pending, totals)\n• Meetings (upcoming schedule)\n\nOr just say "summary" for a quick overview!`;

  } catch (error) {
    console.error('AI Agent Error:', error);
    return "Sorry, I had trouble connecting to the database. Please check your connection and try again.";
  }
}
