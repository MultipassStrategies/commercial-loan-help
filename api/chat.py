"""
Commercial Loan Help — AI Chatbot Serverless Function (Vercel)
Handles POST /api/chat with streaming SSE responses via Claude.
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import time

# ---- Knowledge Base & System Prompt (inline for serverless) ----

KNOWLEDGE_BASE = """
## ABOUT COMMERCIAL LOAN HELP

Commercial Loan Help is a commercial loan marketplace and advisory service — NOT a lender. Our proprietary ClearPath™ matching system evaluates a borrower's loan type, asset class, credit profile, and timeline, then connects them to the best lender from our network of hundreds of established relationships — SBA lenders, bridge lenders, CMBS conduits, private credit funds, mezzanine providers, and more.

Key facts:
- Licensed in all 50 states
- No minimum loan size
- $0 cost to use the matching service
- No credit pull required for initial matching
- Matching takes approximately 60 seconds
- We are lender-agnostic — we work for the borrower, not any single bank

## THE 2026 COMMERCIAL LOAN MATURITY WALL

Approximately $875 billion in commercial and multifamily mortgage debt is scheduled to mature in 2026, representing about 17% of the $5 trillion outstanding. This is the largest single-year maturity event in commercial real estate history.

Why it matters:
- Most of these loans were originated between 2019 and 2022 at historically low rates
- Current refinancing rates are significantly higher than origination rates
- Many properties have experienced value compression of 15-30%
- Debt Service Coverage Ratios (DSCR) have tightened, making traditional refinancing difficult
- The Federal Funds rate is currently 3.50-3.75% (as of early 2026)

The five main options for maturing loans:
1. Traditional Refinance — if DSCR and LTV still qualify
2. Bridge Loan — short-term (12-36 months) to buy time
3. Mezzanine Debt — fills the gap between senior loan and equity
4. Preferred Equity — provides additional leverage without adding to debt stack
5. Private Credit — non-bank lenders with flexible underwriting

## LOAN PRODUCTS WE MATCH

### SBA 7(a) Loans
- Up to $5 million
- Flexible use: real estate, working capital, equipment, acquisitions
- SBA guarantees up to 85% of loan amount
- Terms up to 25 years for real estate
- Requires 680+ credit score typically
- Must be a for-profit US business
- Best for: small businesses needing flexible financing

### SBA 504 Loans
- Long-term, fixed-rate financing
- For owner-occupied commercial real estate and heavy equipment
- Tripartite structure: bank (50%), CDC (40%), borrower (10% down)
- Below-market fixed rates on the CDC portion
- Terms: 10, 20, or 25 years
- Best for: businesses buying their own building or major equipment

### Bridge Loans
- Short-term: 6-36 months typically
- Rates vary based on deal specifics and borrower profile
- Quick closing: 2-4 weeks possible
- Higher leverage available (up to 75-80% LTV)
- Interest-only payments common
- Best for: acquisitions, repositioning, value-add, buying time before permanent financing

### CMBS Loans (Commercial Mortgage-Backed Securities)
- Non-recourse financing
- For stabilized commercial real estate
- Competitive fixed rates
- Terms: 5, 7, or 10 years typically
- Prepayment penalties (defeasance or yield maintenance)
- Minimum typically $2-3 million
- Best for: larger stabilized properties where non-recourse is important

### Mezzanine Debt
- Subordinate financing between senior loan and equity
- Rates vary based on risk and deal structure
- Terms: 2-7 years
- Often interest-only
- Provides additional leverage (75-90% of capital stack)
- Best for: filling the gap when senior financing falls short

### Preferred Equity
- Equity-like capital with debt-like characteristics
- Returns structured as preferred return to equity investors
- Does not add to the debt stack (important for DSCR calculations)
- Priority over common equity in distributions
- Best for: recapitalization, development, situations where more debt isn't possible

### Private Credit / Non-Bank Lending
- AUM has grown to $1.5-1.8 trillion (2026)
- More flexible underwriting than banks
- Can move quickly on complex deals
- Rates vary widely based on risk profile
- Best for: deals that don't fit traditional bank boxes

### Construction Loans
- For ground-up development or major renovation
- Interest-only during construction
- Typically 12-24 months
- Requires detailed plans, permits, and contractor bids
- Often converts to permanent financing upon completion

### Business Lines of Credit
- Revolving credit facility
- Draw as needed, pay interest only on outstanding balance
- Terms: 1-5 years, renewable
- Best for: working capital, inventory, seasonal needs

## KEY METRICS BORROWERS SHOULD KNOW

### DSCR (Debt Service Coverage Ratio)
- Formula: Net Operating Income / Annual Debt Service
- Most lenders require minimum 1.20-1.25x
- Below 1.0x means the property doesn't generate enough income to cover debt payments
- DSCR has become the most critical underwriting metric in 2026

### LTV (Loan-to-Value Ratio)
- Formula: Loan Amount / Property Value
- Typical maximums: 65-75% for conventional, up to 80% for SBA
- Lower LTV = less risk = better rates and terms

### Cap Rate (Capitalization Rate)
- Formula: Net Operating Income / Property Value
- Varies by property type and market

## COMMERCIAL PROPERTY TYPES

- Multifamily (5+ units): Apartments, student housing, senior housing
- Office: Class A, B, C; suburban vs CBD
- Retail: Strip centers, NNN, anchored centers, malls
- Industrial: Warehouse, distribution, flex space, manufacturing
- Hospitality: Hotels, motels (flagged and independent)
- Mixed-Use: Combination of residential and commercial
- Self-Storage: Climate-controlled and traditional
- Healthcare: Medical office, assisted living, skilled nursing
- Special Purpose: Gas stations, car washes, restaurants

## HOSPITALITY LENDING SPECIFICS

- RevPAR (Revenue Per Available Room) is the key metric
- PIP (Property Improvement Plans) required by flags
- Seasonal cash flow requires specialized underwriting
- Flagged properties (Marriott, Hilton, IHG) have different requirements than independents
- SBA 504 available for owner-operated hotels
- Bridge loans popular for renovations and brand conversions

## SMALL BUSINESS LENDING

- Nearly 40% of small businesses are turned down by traditional lenders
- $130 billion lending gap between what small businesses need and what banks provide
- CDFIs (Community Development Financial Institutions) offer below-market rates
- SBA programs specifically designed for underserved businesses
- Working capital options: lines of credit, term loans, merchant cash advances
- Equipment financing: often 100% LTV available
- Fee waivers available on certain SBA programs for veterans, women-owned, minority-owned businesses

## COMMERCIAL LOAN HELP'S PROCESS

1. Borrower answers 7 quick questions through ClearPath (60 seconds)
2. ClearPath searches hundreds of lender relationships
3. We present the best matching options
4. Borrower connects directly with matched lenders
5. No obligation — borrower only moves forward when ready

Contact options:
- Online: ClearPath matching quiz at /match
- The service is free to borrowers
"""

SYSTEM_PROMPT = """You are the Commercial Loan Help AI Assistant — a knowledgeable, helpful guide for anyone navigating commercial lending. You are embedded on the Commercial Loan Help website.

## YOUR IDENTITY
- You are an AI educational assistant, NOT a loan officer, broker, or lender
- You represent Commercial Loan Help, a commercial loan marketplace and advisory service
- Your name is "CLH Assistant" if asked

## WHAT YOU DO
- Answer questions about commercial loan types, terms, and concepts
- Explain the lending process in plain English
- Help users understand which loan products might fit their situation
- Provide general market context and educational information
- Guide users toward Commercial Loan Help's free matching service when appropriate

## STRICT COMPLIANCE RULES — NEVER VIOLATE THESE
1. NEVER quote specific interest rates or rate ranges — not even general market ranges. Do not cite any percentage figures for rates. Instead, explain that rates vary significantly based on deal specifics and redirect to ClearPath matching.
2. NEVER guarantee loan approval, funding amounts, or specific terms
3. NEVER act as or pretend to be a loan officer, broker, or lender
4. NEVER provide legal, tax, or investment advice — suggest consulting appropriate professionals
5. NEVER ask for sensitive personal information (SSN, bank accounts, exact income figures)
6. NEVER make promises about what Commercial Loan Help can or will do for a specific borrower
7. Always include appropriate disclaimers when discussing lending
8. If asked about specific rates, say: "I can't quote rates — they depend on many factors including your credit profile, property type, LTV, DSCR, and current market conditions. Our ClearPath matching system can connect you with lenders who specialize in your exact scenario, and they'll give you real numbers based on your deal."

## CONVERSION GUIDANCE
When the conversation naturally reaches a point where the user would benefit from talking to a real person or getting matched, suggest one of these actions:
- "Would you like to try our free ClearPath matching system? It takes about 60 seconds and there's no credit pull required." → Link to /match
- "For your specific situation, our team can help you evaluate your options. No obligation, no cost." → Encourage them to use the matching quiz
- Don't be pushy — weave it in naturally when they're clearly looking for help with a real transaction

## TONE & STYLE
- Professional but warm — like a knowledgeable colleague, not a textbook
- Use plain English, avoid excessive jargon (but use proper terms when appropriate)
- Be concise — keep responses focused and scannable
- When explaining concepts, use examples when helpful
- Acknowledge the complexity of commercial lending honestly
- Be empathetic — many borrowers are stressed about maturing loans or financing challenges

## KNOWLEDGE BOUNDARIES
- You know about commercial lending generally and Commercial Loan Help specifically
- If asked about topics outside commercial lending, politely redirect
- If asked about competitors, be professional — don't disparage, focus on CLH's value proposition
- For very specific or technical questions beyond your knowledge, suggest speaking with a CLH specialist

## RESPONSE FORMAT
- Keep responses under 200 words when possible
- Use bullet points for lists
- Bold key terms when introducing them
- If a response needs to be longer, break it into clear sections
"""

FULL_SYSTEM = f"""{SYSTEM_PROMPT}

## COMMERCIAL LENDING KNOWLEDGE BASE
Use the following information to answer questions accurately. This is your primary reference.

{KNOWLEDGE_BASE}
"""


# ---- Vercel Serverless Handler ----

class handler(BaseHTTPRequestHandler):
    """Vercel Python serverless function for /api/chat"""

    def do_POST(self):
        try:
            from anthropic import Anthropic

            content_length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(content_length))
            messages = body.get("messages", [])

            if not messages:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No messages provided"}).encode())
                return

            # Limit conversation history to last 20 messages
            if len(messages) > 20:
                messages = messages[-20:]

            # Validate message format
            cleaned = []
            for msg in messages:
                role = msg.get("role", "")
                content = msg.get("content", "")
                if role in ("user", "assistant") and isinstance(content, str) and content.strip():
                    cleaned.append({"role": role, "content": content[:2000]})

            if not cleaned or cleaned[-1]["role"] != "user":
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Invalid message format"}).encode())
                return

            # Call Claude with streaming
            api_key = os.environ.get("ANTHROPIC_API_KEY", "")
            if not api_key:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "API key not configured"}).encode())
                return

            client = Anthropic(api_key=api_key)

            # Stream the response
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()

            try:
                with client.messages.stream(
                    model="claude-3-5-haiku-20241022",
                    max_tokens=600,
                    system=FULL_SYSTEM,
                    messages=cleaned,
                ) as stream:
                    for text in stream.text_stream:
                        chunk = f"data: {json.dumps({'text': text})}\n\n"
                        self.wfile.write(chunk.encode())
                        self.wfile.flush()

                done_chunk = f"data: {json.dumps({'done': True})}\n\n"
                self.wfile.write(done_chunk.encode())
                self.wfile.flush()

            except Exception as e:
                error_chunk = f"data: {json.dumps({'error': str(e)})}\n\n"
                self.wfile.write(error_chunk.encode())
                self.wfile.flush()

        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_OPTIONS(self):
        """Handle CORS preflight requests."""
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
        self.end_headers()

    def do_GET(self):
        """Health check."""
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps({"status": "ok", "service": "clh-chatbot"}).encode())
