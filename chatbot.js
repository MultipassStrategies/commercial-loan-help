/* ==========================================================================
   CLH AI Chatbot Widget — Frontend
   Self-contained widget injected into every page.
   ========================================================================== */

(function () {
  'use strict';

  // API endpoint
  const API_URL = '/api';
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

  // ---- Send message ----
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

    // Disable input while streaming
    isStreaming = true;
    const sendBtn = document.getElementById('clh-chat-send');
    sendBtn.disabled = true;

    showTyping();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages }),
      });

      hideTyping();

      if (!response.ok) {
        throw new Error('Server error');
      }

      // Handle SSE streaming
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      let msgEl = null;

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
              throw new Error(parsed.error);
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
            // Skip unparseable chunks
          }
        }
      }

      if (assistantText) {
        messages.push({ role: 'assistant', content: assistantText });
      }

    } catch (err) {
      hideTyping();
      const errorEl = createMessageElement('assistant',
        "I'm sorry, I'm having trouble connecting right now. You can still use our free matching service at any time — it only takes 60 seconds and requires no credit pull.");
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
