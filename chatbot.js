/* ==========================================================================
   CLH AI Chatbot Widget — Hybrid: AI-first with keyword fallback
   Self-contained widget injected into every page.
   ========================================================================== */

(function () {
  'use strict';

  // API endpoint
  const API_URL = '/api/chat';
  const WELCOME_MESSAGE = `Hi there! I'm the Commercial Loan Help assistant. I can help you understand commercial loan types, the 2026 maturity wall, SBA programs, and how our free matching service works.\n\nWhat can I help you with?`;

  const SUGGESTIONS = [
    "What is the 2026 maturity wall?",
    "What types of commercial loans are there?",
    "How does your matching service work?",
    "What's the difference between SBA 7(a) and 504?"
  ];

  let chatOpen = false;
  let messages = [];
  let isStreaming = false;

  // ===========================================================================
  // CLIENT-SIDE KNOWLEDGE BASE (fallback when AI API is unavailable)
  // ===========================================================================
  const FALLBACK_RESPONSES = [
    {
      keywords: ['maturity wall', 'maturing', '2026 wall', 'maturity', 'refinanc'],
      response: `**The 2026 Commercial Loan Maturity Wall**\n\nApproximately **$875 billion** in commercial and multifamily mortgage debt is set to mature in 2026 — the largest single-year maturity event in commercial real estate history.\n\n**Why it matters:**\n- Most loans originated 2019–2022 at historically low rates\n- Today's refinancing rates are significantly higher\n- Property values compressed 15–30%\n- Tighter DSCRs make traditional refinancing difficult\n\n**Your options:**\n1. Traditional Refinance\n2. Bridge Loan (12–36 months)\n3. Mezzanine Debt\n4. Preferred Equity\n5. Private Credit\n\nOur free ClearPath matching system can connect you with lenders who specialize in your exact situation — it only takes 60 seconds and requires no credit pull.`
    },
    {
      keywords: ['sba', '7a', '7(a)', '504', 'small business'],
      response: `**SBA Loan Programs**\n\n**SBA 7(a) Loans:**\n- Up to $5 million\n- Flexible use: real estate, working capital, equipment, acquisitions\n- SBA guarantees up to 85% of loan\n- Terms up to 25 years for real estate\n- Best for: small businesses needing flexible financing\n\n**SBA 504 Loans:**\n- Long-term, fixed-rate financing\n- For owner-occupied commercial real estate and heavy equipment\n- Structure: bank (50%), CDC (40%), borrower (10% down)\n- Below-market fixed rates on the CDC portion\n- Best for: businesses buying their own building\n\nWant to find the best SBA lender for your situation? Our free ClearPath matching takes just 60 seconds.`
    },
    {
      keywords: ['bridge', 'short term', 'short-term', 'quick close'],
      response: `**Bridge Loans**\n\n- Short-term: typically 6–36 months\n- Quick closing: 2–4 weeks possible\n- Higher leverage available (up to 75–80% LTV)\n- Rates vary based on deal specifics and borrower profile\n\n**Best for:** Acquisitions, repositioning, value-add projects, or buying time before permanent financing.\n\nBridge loans are one of the most common solutions for the 2026 maturity wall. Our ClearPath matching can connect you with bridge lenders in about 60 seconds.`
    },
    {
      keywords: ['cmbs', 'mortgage-backed', 'securit'],
      response: `**CMBS Loans (Commercial Mortgage-Backed Securities)**\n\n- Non-recourse financing\n- For stabilized commercial real estate\n- Competitive fixed rates\n- Terms: 5, 7, or 10 years typically\n\n**Best for:** Larger stabilized properties where non-recourse is important.\n\nWant to explore CMBS options? Our ClearPath matching can connect you with CMBS conduits — free, no credit pull, 60 seconds.`
    },
    {
      keywords: ['mezzanine', 'mezz', 'subordinate', 'gap'],
      response: `**Mezzanine Debt**\n\n- Subordinate financing between senior loan and equity\n- Terms: 2–7 years\n- Fills the gap when senior financing falls short\n\nMezzanine debt is increasingly popular in 2026 as property values have compressed and senior lenders have pulled back. Our ClearPath matching can help you find the right mezzanine provider.`
    },
    {
      keywords: ['private credit', 'non-bank', 'alternative'],
      response: `**Private Credit / Non-Bank Lending**\n\n- More flexible underwriting than traditional banks\n- Can move quickly on complex deals\n- Rates vary widely based on risk profile\n\n**Best for:** Deals that don't fit traditional bank criteria. Private credit has become a major force in commercial lending, especially for borrowers facing the 2026 maturity wall.\n\nOur ClearPath matching has relationships with hundreds of private credit funds. Try it free — 60 seconds, no credit pull.`
    },
    {
      keywords: ['construction', 'build', 'develop', 'ground up', 'renovation'],
      response: `**Construction Loans**\n\n- For ground-up development or major renovation\n- Interest-only during construction period\n- Typically 12–24 months\n- Converts to permanent financing upon completion (or requires refinance)\n\nConstruction lending has unique requirements. Our ClearPath matching can connect you with experienced construction lenders in about 60 seconds.`
    },
    {
      keywords: ['clearpath', 'matching', 'how does it work', 'how it work', 'your service', 'your process', 'how do you'],
      response: `**How ClearPath Matching Works**\n\nOur proprietary ClearPath system evaluates your loan type, asset class, credit profile, and timeline — then connects you with the best lender from our network of hundreds of relationships.\n\n**The process:**\n1. Answer 7 quick questions (about 60 seconds)\n2. ClearPath searches hundreds of lender relationships\n3. We present your best matching options\n4. You connect directly with matched lenders\n5. No obligation — move forward only when you're ready\n\n**Key facts:**\n- Licensed in all 50 states\n- No minimum loan size\n- $0 cost to use\n- No credit pull required\n\nReady to find your match? Try it now — it only takes 60 seconds.`
    },
    {
      keywords: ['dscr', 'debt service', 'coverage ratio'],
      response: `**DSCR (Debt Service Coverage Ratio)**\n\n- Formula: Net Operating Income ÷ Annual Debt Service\n- Most lenders require minimum 1.20–1.25x\n- DSCR has become the most critical underwriting metric in 2026\n\nA DSCR below 1.0x means the property doesn't generate enough income to cover debt payments. Many maturing loans are facing DSCR challenges due to higher refinancing rates.\n\nNot sure where you stand? Our free ClearPath matching can help you explore your options.`
    },
    {
      keywords: ['ltv', 'loan to value', 'loan-to-value', 'down payment'],
      response: `**LTV (Loan-to-Value Ratio)**\n\n- Formula: Loan Amount ÷ Property Value\n- Typical maximums: 65–75% for conventional, up to 80% for SBA\n- Lower LTV = better terms and more lender options\n\nMany properties facing 2026 maturities have seen values compress, which pushes LTV higher and makes refinancing more difficult.\n\nOur ClearPath matching can connect you with lenders who work within your LTV range — free, 60 seconds.`
    },
    {
      keywords: ['loan type', 'types of loan', 'what loan', 'which loan', 'commercial loan', 'options'],
      response: `**Commercial Loan Types We Match**\n\n- **SBA 7(a)** — Up to $5M, flexible use\n- **SBA 504** — Fixed-rate, owner-occupied real estate\n- **Bridge Loans** — Short-term, quick close\n- **CMBS** — Non-recourse, stabilized properties\n- **Mezzanine Debt** — Gap financing\n- **Private Credit** — Flexible, non-bank\n- **Construction Loans** — Ground-up or renovation\n- **Business Lines of Credit** — Revolving working capital\n\nNot sure which is right for you? Our free ClearPath matching evaluates your situation and connects you with the right lender — 60 seconds, no credit pull.`
    },
    {
      keywords: ['rate', 'interest', 'percent', 'apr', 'how much'],
      response: `Great question — rates vary based on many factors including your credit profile, property type, LTV, DSCR, and current market conditions. I'm not able to quote specific rates as they change frequently and depend on your unique situation.\n\nThe best way to get accurate rate information is through our **free ClearPath matching** system. It connects you with lenders who specialize in your exact scenario — takes about 60 seconds and requires no credit pull.`
    },
    {
      keywords: ['hospitality', 'hotel', 'motel', 'lodging', 'resort'],
      response: `**Hospitality & Hotel Lending**\n\nHospitality is one of the sectors most impacted by the 2026 maturity wall, with many hotels facing challenging refinancing conditions.\n\n**Key considerations:**\n- Hospitality requires specialized lenders who understand RevPAR, ADR, and seasonal cash flow\n- SBA 504 loans are popular for owner-operated hotels\n- Bridge loans can help reposition underperforming properties\n\nOur network includes lenders who specialize specifically in hospitality lending. Try our free ClearPath matching to find the right fit.`
    },
    {
      keywords: ['multifamily', 'apartment', 'residential', 'housing'],
      response: `**Multifamily Lending**\n\nMultifamily properties represent a significant portion of the 2026 maturity wall. Fortunately, multifamily remains one of the strongest asset classes for lenders.\n\n**Options include:**\n- Agency financing (Fannie Mae / Freddie Mac)\n- CMBS for larger stabilized properties\n- Bridge loans for value-add repositioning\n- SBA programs for smaller owner-occupied buildings\n\nOur ClearPath matching can connect you with the right multifamily lender — free, 60 seconds, no credit pull.`
    },
    {
      keywords: ['investor', 'invest', 'marketplace', 'return', 'yield'],
      response: `**For Investors**\n\nCommercial Loan Help operates as a marketplace connecting borrowers with our network of lender relationships. We're lender-agnostic — we work for the borrower, not any single bank.\n\nFor more information about our business model and marketplace approach, visit our **Investors** page or reach out directly.\n\nIf you're a borrower looking for financing, our free ClearPath matching takes just 60 seconds.`
    },
    {
      keywords: ['who', 'about', 'company', 'what is commercial'],
      response: `**About Commercial Loan Help**\n\nWe're a commercial loan marketplace and advisory service — **not a lender**. Our proprietary ClearPath matching system connects borrowers with the best lender from our network of hundreds of established relationships.\n\n**Key facts:**\n- Licensed in all 50 states\n- No minimum loan size\n- $0 cost to use the matching service\n- No credit pull required\n- SBA lenders, bridge lenders, CMBS conduits, private credit funds, and more\n\nReady to find your match? ClearPath takes just 60 seconds.`
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
      response: `Welcome to Commercial Loan Help! I can help you understand:\n\n- **Commercial loan types** (SBA, bridge, CMBS, mezzanine, and more)\n- **The 2026 maturity wall** and your refinancing options\n- **How our free ClearPath matching** connects you with the right lender\n\nWhat would you like to know more about?`
    },
    {
      keywords: ['thank', 'thanks', 'appreciate'],
      response: `You're welcome! If you have any other questions about commercial lending, I'm here to help.\n\nWhen you're ready, our free **ClearPath matching** can connect you with the right lender in about 60 seconds — no credit pull required.`
    }
  ];

  const DEFAULT_FALLBACK = `That's a great question! While I may not have the specific details on that topic, here's how I can help:\n\n- **Commercial loan types** — SBA, bridge, CMBS, mezzanine, and more\n- **The 2026 maturity wall** — understanding your options\n- **ClearPath matching** — our free service to find the right lender\n\nYou can also try our free **ClearPath matching** system to connect directly with a lender who specializes in your situation — it only takes 60 seconds and requires no credit pull.\n\nAsk me about any of these topics, or try a different question!`;

  // ---- Keyword-matching fallback function ----
  function getKeywordResponse(userText) {
    const lower = userText.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of FALLBACK_RESPONSES) {
      let score = 0;
      for (const kw of entry.keywords) {
        if (lower.includes(kw)) {
          score += kw.length; // longer keyword matches = higher relevance
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    return bestMatch ? bestMatch.response : DEFAULT_FALLBACK;
  }

  // ---- Build the widget HTML ----
  function buildWidget() {
    // Trigger button
    const trigger = document.createElement('button');
    trigger.className = 'clh-chat-trigger';
    trigger.setAttribute('aria-label', 'Open chat assistant');
    trigger.innerHTML = `
      <svg class="chat-open-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="chat-close-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      <span class="clh-chat-badge">1</span>
    `;
    trigger.addEventListener('click', toggleChat);

    // Chat window
    const win = document.createElement('div');
    win.className = 'clh-chat-window';
    win.id = 'clh-chat-window';
    win.innerHTML = `
      <div class="clh-chat-header">
        <div class="clh-chat-header-title">Commercial Loan Help</div>
        <div class="clh-chat-header-sub">AI-Powered Lending Assistant</div>
        <div class="clh-chat-header-status">
          <span class="clh-chat-header-dot"></span>
          Online — typically replies instantly
        </div>
      </div>
      <div class="clh-chat-messages" id="clh-chat-messages"></div>
      <div class="clh-chat-input-area">
        <textarea class="clh-chat-input" id="clh-chat-input"
          placeholder="Ask about commercial loans..."
          rows="1"
          maxlength="500"></textarea>
        <button class="clh-chat-send" id="clh-chat-send" aria-label="Send message">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
      <div class="clh-chat-disclaimer">
        AI assistant for educational purposes only. Not a loan officer. No rate guarantees.
      </div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(win);

    // Event listeners
    const input = document.getElementById('clh-chat-input');
    const sendBtn = document.getElementById('clh-chat-send');

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });

    sendBtn.addEventListener('click', sendMessage);

    // Show welcome message after a short delay
    setTimeout(() => {
      showWelcome();
    }, 500);
  }

  // ---- Toggle chat open/closed ----
  function toggleChat() {
    chatOpen = !chatOpen;
    const win = document.getElementById('clh-chat-window');
    const trigger = document.querySelector('.clh-chat-trigger');
    const badge = trigger.querySelector('.clh-chat-badge');

    if (chatOpen) {
      win.classList.add('open');
      trigger.classList.add('open');
      badge.classList.add('hidden');
      // Focus input
      setTimeout(() => {
        document.getElementById('clh-chat-input').focus();
      }, 300);
    } else {
      win.classList.remove('open');
      trigger.classList.remove('open');
    }
  }

  // ---- Show welcome message with suggestions ----
  function showWelcome() {
    const container = document.getElementById('clh-chat-messages');
    if (!container || container.children.length > 0) return;

    // Welcome message
    const msgEl = createMessageElement('assistant', WELCOME_MESSAGE);
    container.appendChild(msgEl);

    // Suggestions
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'clh-suggestions';
    suggestionsDiv.id = 'clh-suggestions';

    SUGGESTIONS.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'clh-suggestion-btn';
      btn.textContent = q;
      btn.addEventListener('click', () => {
        // Remove suggestions
        suggestionsDiv.remove();
        // Set as user message and send
        document.getElementById('clh-chat-input').value = q;
        sendMessage();
      });
      suggestionsDiv.appendChild(btn);
    });

    container.appendChild(suggestionsDiv);
    scrollToBottom();
  }

  // ---- Create a message bubble element ----
  function createMessageElement(role, content) {
    const el = document.createElement('div');
    el.className = `clh-msg clh-msg-${role}`;
    if (role === 'assistant') {
      el.innerHTML = formatMarkdown(content);
    } else {
      el.textContent = content;
    }
    return el;
  }

  // ---- Basic markdown formatting ----
  function formatMarkdown(text) {
    return text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Bullet lists
      .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
      // Numbered lists
      .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
      // Line breaks
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  // ---- Show typing indicator ----
  function showTyping() {
    const container = document.getElementById('clh-chat-messages');
    const typing = document.createElement('div');
    typing.className = 'clh-typing';
    typing.id = 'clh-typing';
    typing.innerHTML = '<div class="clh-typing-dot"></div><div class="clh-typing-dot"></div><div class="clh-typing-dot"></div>';
    container.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const typing = document.getElementById('clh-typing');
    if (typing) typing.remove();
  }

  // ---- Scroll to bottom ----
  function scrollToBottom() {
    const container = document.getElementById('clh-chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  // ---- Simulate typing effect for fallback responses ----
  function simulateTyping(text, container, callback) {
    const msgEl = createMessageElement('assistant', '');
    container.appendChild(msgEl);

    // Split text into words and reveal progressively for a natural feel
    const words = text.split(' ');
    let displayed = '';
    let i = 0;

    const interval = setInterval(() => {
      // Add 2-4 words per tick for speed
      const chunk = words.slice(i, i + 3).join(' ');
      displayed += (i > 0 ? ' ' : '') + chunk;
      i += 3;

      msgEl.innerHTML = formatMarkdown(displayed);
      scrollToBottom();

      if (i >= words.length) {
        clearInterval(interval);
        if (callback) callback(msgEl);
      }
    }, 40);
  }

  // ---- Send message (hybrid: tries AI first, falls back to keywords) ----
  async function sendMessage() {
    if (isStreaming) return;

    const input = document.getElementById('clh-chat-input');
    const text = input.value.trim();
    if (!text) return;

    // Remove suggestions if still showing
    const suggestions = document.getElementById('clh-suggestions');
    if (suggestions) suggestions.remove();

    // Add user message
    const container = document.getElementById('clh-chat-messages');
    messages.push({ role: 'user', content: text });
    container.appendChild(createMessageElement('user', text));
    input.value = '';
    input.style.height = 'auto';
    scrollToBottom();

    // Disable input while responding
    isStreaming = true;
    const sendBtn = document.getElementById('clh-chat-send');
    sendBtn.disabled = true;

    showTyping();

    let aiSucceeded = false;

    try {
      // Timeout after 15 seconds (shorter timeout — fall back faster)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error('Server error: ' + response.status);
      }

      // Handle SSE streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let msgEl = null;
      let streamError = null;

      hideTyping();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.error) {
              streamError = parsed.error;
              break;
            }

            if (parsed.text) {
              assistantText += parsed.text;

              if (!msgEl) {
                msgEl = createMessageElement('assistant', assistantText);
                container.appendChild(msgEl);
              } else {
                msgEl.innerHTML = formatMarkdown(assistantText);
              }
              scrollToBottom();
            }

            if (parsed.done) {
              // Add CTA if the response mentions matching or ClearPath
              if (assistantText.toLowerCase().includes('clearpath') ||
                  assistantText.toLowerCase().includes('matching') ||
                  assistantText.toLowerCase().includes('60 seconds') ||
                  assistantText.toLowerCase().includes('find my loan') ||
                  assistantText.toLowerCase().includes('/match')) {
                if (msgEl && !msgEl.querySelector('.clh-msg-cta')) {
                  const cta = document.createElement('a');
                  cta.className = 'clh-msg-cta';
                  cta.href = 'match.html';
                  cta.textContent = 'Start Free Matching →';
                  msgEl.appendChild(cta);
                }
              }
            }
          } catch (parseErr) {
            // Skip unparseable JSON chunks only
          }
        }
        if (streamError) break;
      }

      if (streamError) {
        throw new Error(streamError);
      }

      if (assistantText) {
        messages.push({ role: 'assistant', content: assistantText });
        aiSucceeded = true;
      } else {
        throw new Error('No response received');
      }

    } catch (err) {
      console.log('CLH Chat: AI unavailable, using knowledge base fallback. Reason:', err.message);
      // AI failed — use keyword-matching fallback
      hideTyping();

      const fallbackText = getKeywordResponse(text);
      simulateTyping(fallbackText, container, (msgEl) => {
        messages.push({ role: 'assistant', content: fallbackText });
        // Add CTA for matching references
        if (fallbackText.toLowerCase().includes('clearpath') ||
            fallbackText.toLowerCase().includes('60 seconds')) {
          if (msgEl && !msgEl.querySelector('.clh-msg-cta')) {
            const cta = document.createElement('a');
            cta.className = 'clh-msg-cta';
            cta.href = 'match.html';
            cta.textContent = 'Start Free Matching →';
            msgEl.appendChild(cta);
          }
        }
      });

      aiSucceeded = true; // fallback worked, don't show error
    }

    if (!aiSucceeded) {
      hideTyping();
      const errorEl = createMessageElement('assistant',
        "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. You can also use our free matching service at any time — it only takes 60 seconds and requires no credit pull.");
      container.appendChild(errorEl);
      scrollToBottom();
    }

    isStreaming = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ---- Initialize on DOM ready ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }

})();
