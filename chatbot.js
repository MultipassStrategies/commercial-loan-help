/* ==========================================================================
   CLH AI Chatbot Widget v4 — Client-side knowledge base
   Self-contained widget injected into every page.
   ========================================================================== */

(function () {
  'use strict';

  var WELCOME_MESSAGE = 'Hi there! I\'m the Commercial Loan Help assistant. I can help you understand commercial loan types, the 2026 maturity wall, SBA programs, and how our free matching service works.\n\nWhat can I help you with?';

  var SUGGESTIONS = [
    'What is the 2026 maturity wall?',
    'What types of commercial loans are there?',
    'How does your matching service work?',
    'What\'s the difference between SBA 7(a) and 504?'
  ];

  var chatOpen = false;
  var messages = [];
  var isResponding = false;

  // ===========================================================================
  // CLIENT-SIDE KNOWLEDGE BASE
  // ===========================================================================
  var RESPONSES = [
    {
      keywords: ['maturity wall', 'maturing', '2026 wall', 'maturity', 'refinanc'],
      answer: '<strong>The 2026 Commercial Loan Maturity Wall</strong><br><br>Approximately <strong>$875 billion</strong> in commercial and multifamily mortgage debt is set to mature in 2026 — the largest single-year maturity event in commercial real estate history.<br><br><strong>Why it matters:</strong><br><ul><li>Most loans originated 2019–2022 at historically low rates</li><li>Today\'s refinancing rates are significantly higher</li><li>Property values compressed 15–30%</li><li>Tighter DSCRs make traditional refinancing difficult</li></ul><br><strong>Your options:</strong><br><ul><li>Traditional Refinance</li><li>Bridge Loan (12–36 months)</li><li>Mezzanine Debt</li><li>Preferred Equity</li><li>Private Credit</li></ul><br>Our free ClearPath matching system can connect you with lenders who specialize in your exact situation — it only takes 60 seconds and requires no credit pull.'
    },
    {
      keywords: ['sba', '7a', '7(a)', '504', 'small business'],
      answer: '<strong>SBA Loan Programs</strong><br><br><strong>SBA 7(a) Loans:</strong><ul><li>Up to $5 million</li><li>Flexible use: real estate, working capital, equipment, acquisitions</li><li>SBA guarantees up to 85% of loan</li><li>Terms up to 25 years for real estate</li><li>Best for: small businesses needing flexible financing</li></ul><br><strong>SBA 504 Loans:</strong><ul><li>Long-term, fixed-rate financing</li><li>For owner-occupied commercial real estate and heavy equipment</li><li>Structure: bank (50%), CDC (40%), borrower (10% down)</li><li>Below-market fixed rates on the CDC portion</li><li>Best for: businesses buying their own building</li></ul><br>Want to find the best SBA lender for your situation? Our free ClearPath matching takes just 60 seconds.'
    },
    {
      keywords: ['bridge', 'short term', 'short-term', 'quick close'],
      answer: '<strong>Bridge Loans</strong><br><br><ul><li>Short-term: typically 6–36 months</li><li>Quick closing: 2–4 weeks possible</li><li>Higher leverage available (up to 75–80% LTV)</li><li>Rates vary based on deal specifics and borrower profile</li></ul><br><strong>Best for:</strong> Acquisitions, repositioning, value-add projects, or buying time before permanent financing.<br><br>Bridge loans are one of the most common solutions for the 2026 maturity wall. Our ClearPath matching can connect you with bridge lenders in about 60 seconds.'
    },
    {
      keywords: ['cmbs', 'mortgage-backed', 'securit'],
      answer: '<strong>CMBS Loans (Commercial Mortgage-Backed Securities)</strong><br><br><ul><li>Non-recourse financing</li><li>For stabilized commercial real estate</li><li>Competitive fixed rates</li><li>Terms: 5, 7, or 10 years typically</li></ul><br><strong>Best for:</strong> Larger stabilized properties where non-recourse is important.<br><br>Want to explore CMBS options? Our ClearPath matching can connect you with CMBS conduits — free, no credit pull, 60 seconds.'
    },
    {
      keywords: ['mezzanine', 'mezz', 'subordinate', 'gap'],
      answer: '<strong>Mezzanine Debt</strong><br><br><ul><li>Subordinate financing between senior loan and equity</li><li>Terms: 2–7 years</li><li>Fills the gap when senior financing falls short</li></ul><br>Mezzanine debt is increasingly popular in 2026 as property values have compressed and senior lenders have pulled back. Our ClearPath matching can help you find the right mezzanine provider.'
    },
    {
      keywords: ['private credit', 'non-bank', 'alternative'],
      answer: '<strong>Private Credit / Non-Bank Lending</strong><br><br><ul><li>More flexible underwriting than traditional banks</li><li>Can move quickly on complex deals</li><li>Rates vary widely based on risk profile</li></ul><br><strong>Best for:</strong> Deals that don\'t fit traditional bank criteria. Private credit has become a major force in commercial lending, especially for borrowers facing the 2026 maturity wall.<br><br>Our ClearPath matching has relationships with hundreds of private credit funds. Try it free — 60 seconds, no credit pull.'
    },
    {
      keywords: ['construction', 'build', 'develop', 'ground up', 'renovation'],
      answer: '<strong>Construction Loans</strong><br><br><ul><li>For ground-up development or major renovation</li><li>Interest-only during construction period</li><li>Typically 12–24 months</li><li>Converts to permanent financing upon completion</li></ul><br>Construction lending has unique requirements. Our ClearPath matching can connect you with experienced construction lenders in about 60 seconds.'
    },
    {
      keywords: ['clearpath', 'matching', 'how does it work', 'how it work', 'your service', 'your process', 'how do you'],
      answer: '<strong>How ClearPath Matching Works</strong><br><br>Our proprietary ClearPath system evaluates your loan type, asset class, credit profile, and timeline — then connects you with the best lender from our network of hundreds of relationships.<br><br><strong>The process:</strong><ul><li>Answer 7 quick questions (about 60 seconds)</li><li>ClearPath searches hundreds of lender relationships</li><li>We present your best matching options</li><li>You connect directly with matched lenders</li><li>No obligation — move forward only when you\'re ready</li></ul><br><strong>Key facts:</strong><ul><li>Licensed in all 50 states</li><li>No minimum loan size</li><li>$0 cost to use</li><li>No credit pull required</li></ul><br>Ready to find your match? It only takes 60 seconds.'
    },
    {
      keywords: ['dscr', 'debt service', 'coverage ratio'],
      answer: '<strong>DSCR (Debt Service Coverage Ratio)</strong><br><br><ul><li>Formula: Net Operating Income ÷ Annual Debt Service</li><li>Most lenders require minimum 1.20–1.25x</li><li>DSCR has become the most critical underwriting metric in 2026</li></ul><br>A DSCR below 1.0x means the property doesn\'t generate enough income to cover debt payments. Many maturing loans are facing DSCR challenges due to higher refinancing rates.<br><br>Not sure where you stand? Our free ClearPath matching can help you explore your options.'
    },
    {
      keywords: ['ltv', 'loan to value', 'loan-to-value', 'down payment'],
      answer: '<strong>LTV (Loan-to-Value Ratio)</strong><br><br><ul><li>Formula: Loan Amount ÷ Property Value</li><li>Typical maximums: 65–75% for conventional, up to 80% for SBA</li><li>Lower LTV = better terms and more lender options</li></ul><br>Many properties facing 2026 maturities have seen values compress, which pushes LTV higher and makes refinancing more difficult.<br><br>Our ClearPath matching can connect you with lenders who work within your LTV range — free, 60 seconds.'
    },
    {
      keywords: ['loan type', 'types of loan', 'what loan', 'which loan', 'commercial loan', 'options', 'what kind'],
      answer: '<strong>Commercial Loan Types We Match</strong><br><br><ul><li><strong>SBA 7(a)</strong> — Up to $5M, flexible use</li><li><strong>SBA 504</strong> — Fixed-rate, owner-occupied real estate</li><li><strong>Bridge Loans</strong> — Short-term, quick close</li><li><strong>CMBS</strong> — Non-recourse, stabilized properties</li><li><strong>Mezzanine Debt</strong> — Gap financing</li><li><strong>Private Credit</strong> — Flexible, non-bank</li><li><strong>Construction Loans</strong> — Ground-up or renovation</li><li><strong>Business Lines of Credit</strong> — Revolving working capital</li></ul><br>Not sure which is right for you? Our free ClearPath matching evaluates your situation and connects you with the right lender — 60 seconds, no credit pull.'
    },
    {
      keywords: ['rate', 'interest', 'percent', 'apr', 'how much', 'cost'],
      answer: 'Great question — rates vary based on many factors including your credit profile, property type, LTV, DSCR, and current market conditions. I\'m not able to quote specific rates as they change frequently and depend on your unique situation.<br><br>The best way to get accurate rate information is through our <strong>free ClearPath matching</strong> system. It connects you with lenders who specialize in your exact scenario — takes about 60 seconds and requires no credit pull.'
    },
    {
      keywords: ['hospitality', 'hotel', 'motel', 'lodging', 'resort'],
      answer: '<strong>Hospitality & Hotel Lending</strong><br><br>Hospitality is one of the sectors most impacted by the 2026 maturity wall, with many hotels facing challenging refinancing conditions.<br><br><strong>Key considerations:</strong><ul><li>Hospitality requires specialized lenders who understand RevPAR, ADR, and seasonal cash flow</li><li>SBA 504 loans are popular for owner-operated hotels</li><li>Bridge loans can help reposition underperforming properties</li></ul><br>Our network includes lenders who specialize specifically in hospitality lending. Try our free ClearPath matching to find the right fit.'
    },
    {
      keywords: ['multifamily', 'apartment', 'residential', 'housing'],
      answer: '<strong>Multifamily Lending</strong><br><br>Multifamily properties represent a significant portion of the 2026 maturity wall. Fortunately, multifamily remains one of the strongest asset classes for lenders.<br><br><strong>Options include:</strong><ul><li>Agency financing (Fannie Mae / Freddie Mac)</li><li>CMBS for larger stabilized properties</li><li>Bridge loans for value-add repositioning</li><li>SBA programs for smaller owner-occupied buildings</li></ul><br>Our ClearPath matching can connect you with the right multifamily lender — free, 60 seconds, no credit pull.'
    },
    {
      keywords: ['investor', 'invest', 'marketplace', 'return', 'yield'],
      answer: '<strong>For Investors</strong><br><br>Commercial Loan Help operates as a marketplace connecting borrowers with our network of lender relationships. We\'re lender-agnostic — we work for the borrower, not any single bank.<br><br>For more information about our business model and marketplace approach, visit our <strong>Investors</strong> page or reach out directly.<br><br>If you\'re a borrower looking for financing, our free ClearPath matching takes just 60 seconds.'
    },
    {
      keywords: ['who', 'about', 'company', 'what is commercial'],
      answer: '<strong>About Commercial Loan Help</strong><br><br>We\'re a commercial loan marketplace and advisory service — <strong>not a lender</strong>. Our proprietary ClearPath matching system connects borrowers with the best lender from our network of hundreds of established relationships.<br><br><strong>Key facts:</strong><ul><li>Licensed in all 50 states</li><li>No minimum loan size</li><li>$0 cost to use the matching service</li><li>No credit pull required</li><li>SBA lenders, bridge lenders, CMBS conduits, private credit funds, and more</li></ul><br>Ready to find your match? ClearPath takes just 60 seconds.'
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo'],
      answer: 'Welcome to Commercial Loan Help! I can help you understand:<br><br><ul><li><strong>Commercial loan types</strong> (SBA, bridge, CMBS, mezzanine, and more)</li><li><strong>The 2026 maturity wall</strong> and your refinancing options</li><li><strong>How our free ClearPath matching</strong> connects you with the right lender</li></ul><br>What would you like to know more about?'
    },
    {
      keywords: ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'perfect'],
      answer: 'You\'re welcome! If you have any other questions about commercial lending, I\'m here to help.<br><br>When you\'re ready, our free <strong>ClearPath matching</strong> can connect you with the right lender in about 60 seconds — no credit pull required.'
    }
  ];

  var DEFAULT_ANSWER = 'That\'s a great question! While I may not have the specific details on that topic, here\'s how I can help:<br><br><ul><li><strong>Commercial loan types</strong> — SBA, bridge, CMBS, mezzanine, and more</li><li><strong>The 2026 maturity wall</strong> — understanding your options</li><li><strong>ClearPath matching</strong> — our free service to find the right lender</li></ul><br>You can also try our free <strong>ClearPath matching</strong> system to connect directly with a lender who specializes in your situation — it only takes 60 seconds and requires no credit pull.<br><br>Ask me about any of these topics, or try a different question!';

  // ---- Find best matching response ----
  function findResponse(userText) {
    var lower = userText.toLowerCase();
    var bestMatch = null;
    var bestScore = 0;

    for (var i = 0; i < RESPONSES.length; i++) {
      var entry = RESPONSES[i];
      var score = 0;
      for (var j = 0; j < entry.keywords.length; j++) {
        if (lower.indexOf(entry.keywords[j]) !== -1) {
          score += entry.keywords[j].length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    return bestMatch ? bestMatch.answer : DEFAULT_ANSWER;
  }

  // ---- Build the widget HTML ----
  function buildWidget() {
    var trigger = document.createElement('button');
    trigger.className = 'clh-chat-trigger';
    trigger.setAttribute('aria-label', 'Open chat assistant');
    trigger.innerHTML = '<svg class="chat-open-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><svg class="chat-close-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg><span class="clh-chat-badge">1</span>';
    trigger.addEventListener('click', toggleChat);

    var win = document.createElement('div');
    win.className = 'clh-chat-window';
    win.id = 'clh-chat-window';
    win.innerHTML = '<div class="clh-chat-header"><div class="clh-chat-header-title">Commercial Loan Help</div><div class="clh-chat-header-sub">AI-Powered Lending Assistant</div><div class="clh-chat-header-status"><span class="clh-chat-header-dot"></span>Online — typically replies instantly</div></div><div class="clh-chat-messages" id="clh-chat-messages"></div><div class="clh-chat-input-area"><textarea class="clh-chat-input" id="clh-chat-input" placeholder="Ask about commercial loans..." rows="1" maxlength="500"></textarea><button class="clh-chat-send" id="clh-chat-send" aria-label="Send message"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div><div class="clh-chat-disclaimer">AI assistant for educational purposes only. Not a loan officer. No rate guarantees.</div>';

    document.body.appendChild(trigger);
    document.body.appendChild(win);

    var input = document.getElementById('clh-chat-input');
    var sendBtn = document.getElementById('clh-chat-send');

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    input.addEventListener('input', function() {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });

    sendBtn.addEventListener('click', sendMessage);

    setTimeout(function() { showWelcome(); }, 500);
  }

  function toggleChat() {
    chatOpen = !chatOpen;
    var win = document.getElementById('clh-chat-window');
    var trigger = document.querySelector('.clh-chat-trigger');
    var badge = trigger.querySelector('.clh-chat-badge');

    if (chatOpen) {
      win.classList.add('open');
      trigger.classList.add('open');
      badge.classList.add('hidden');
      setTimeout(function() {
        document.getElementById('clh-chat-input').focus();
      }, 300);
    } else {
      win.classList.remove('open');
      trigger.classList.remove('open');
    }
  }

  function showWelcome() {
    var container = document.getElementById('clh-chat-messages');
    if (!container || container.children.length > 0) return;

    var msgEl = document.createElement('div');
    msgEl.className = 'clh-msg clh-msg-assistant';
    msgEl.innerHTML = WELCOME_MESSAGE.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
    container.appendChild(msgEl);

    var suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'clh-suggestions';
    suggestionsDiv.id = 'clh-suggestions';

    for (var i = 0; i < SUGGESTIONS.length; i++) {
      (function(q) {
        var btn = document.createElement('button');
        btn.className = 'clh-suggestion-btn';
        btn.textContent = q;
        btn.addEventListener('click', function() {
          suggestionsDiv.remove();
          document.getElementById('clh-chat-input').value = q;
          sendMessage();
        });
        suggestionsDiv.appendChild(btn);
      })(SUGGESTIONS[i]);
    }

    container.appendChild(suggestionsDiv);
    scrollToBottom();
  }

  function scrollToBottom() {
    var container = document.getElementById('clh-chat-messages');
    if (container) container.scrollTop = container.scrollHeight;
  }

  // ---- Send message ----
  function sendMessage() {
    if (isResponding) return;

    var input = document.getElementById('clh-chat-input');
    var text = input.value.trim();
    if (!text) return;

    var suggestions = document.getElementById('clh-suggestions');
    if (suggestions) suggestions.remove();

    var container = document.getElementById('clh-chat-messages');

    // User bubble
    var userEl = document.createElement('div');
    userEl.className = 'clh-msg clh-msg-user';
    userEl.textContent = text;
    container.appendChild(userEl);

    input.value = '';
    input.style.height = 'auto';
    scrollToBottom();

    isResponding = true;
    var sendBtn = document.getElementById('clh-chat-send');
    sendBtn.disabled = true;

    // Show typing dots
    var typing = document.createElement('div');
    typing.className = 'clh-typing';
    typing.id = 'clh-typing';
    typing.innerHTML = '<div class="clh-typing-dot"></div><div class="clh-typing-dot"></div><div class="clh-typing-dot"></div>';
    container.appendChild(typing);
    scrollToBottom();

    // Get response from knowledge base
    var responseHTML = findResponse(text);

    // Simulate a brief delay (like thinking), then show the response
    setTimeout(function() {
      // Remove typing dots
      var dots = document.getElementById('clh-typing');
      if (dots) dots.remove();

      // Assistant bubble
      var assistEl = document.createElement('div');
      assistEl.className = 'clh-msg clh-msg-assistant';
      assistEl.innerHTML = responseHTML;

      // Add CTA button if response mentions ClearPath or matching
      if (responseHTML.indexOf('ClearPath') !== -1 || responseHTML.indexOf('60 seconds') !== -1) {
        var cta = document.createElement('a');
        cta.className = 'clh-msg-cta';
        cta.href = 'match.html';
        cta.textContent = 'Start Free Matching \u2192';
        assistEl.appendChild(cta);
      }

      container.appendChild(assistEl);
      scrollToBottom();

      messages.push({ role: 'user', content: text });
      messages.push({ role: 'assistant', content: responseHTML });

      isResponding = false;
      sendBtn.disabled = false;
      input.focus();
    }, 800 + Math.random() * 700);
  }

  // ---- Initialize ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }

})();
