from http.server import BaseHTTPRequestHandler
import json
import os

KNOWLEDGE_BASE = """
## ABOUT COMMERCIAL LOAN HELP

Commercial Loan Help is a commercial loan marketplace and advisory service — NOT a lender. Our proprietary ClearPath matching system evaluates a borrower's loan type, asset class, credit profile, and timeline, then connects them to the best lender from our network of hundreds of established relationships — SBA lenders, bridge lenders, CMBS conduits, private credit funds, mezzanine providers, and more.

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
- Best for: small businesses needing flexible financing

### SBA 504 Loans
- Long-term, fixed-rate financing
- For owner-occupied commercial real estate and heavy equipment
- Tripartite structure: bank (50%), CDC (40%), borrower (10% down)
- Below-market fixed rates on the CDC portion
- Best for: businesses buying their own building or major equipment

### Bridge Loans
- Short-term: 6-36 months typically
- Rates vary based on deal specifics and borrower profile
- Quick closing: 2-4 weeks possible
- Higher leverage available (up to 75-80% LTV)
- Best for: acquisitions, repositioning, value-add, buying time before permanent financing

### CMBS Loans (Commercial Mortgage-Backed Securities)
- Non-recourse financing
- For stabilized commercial real estate
- Competitive fixed rates
- Terms: 5, 7, or 10 years typically
- Best for: larger stabilized properties where non-recourse is important

### Mezzanine Debt
- Subordinate financing between senior loan and equity
- Rates vary based on risk and deal structure
- Terms: 2-7 years
- Best for: filling the gap when senior financing falls short

### Private Credit / Non-Bank Lending
- More flexible underwriting than banks
- Can move quickly on complex deals
- Rates vary widely based on risk profile
- Best for: deals that don't fit traditional bank boxes

### Construction Loans
- For ground-up development or major renovation
- Interest-only during construction
- Typically 12-24 months

### Business Lines of Credit
- Revolving credit facility
- Draw as needed, pay interest only on outstanding balance
- Best for: working capital, inventory, seasonal needs

## KEY METRICS BORROWERS SHOULD KNOW

### DSCR (Debt Service Coverage Ratio)
- Formula: Net Operating Income / Annual Debt Service
- Most lenders require minimum 1.20-1.25x
- DSCR has become the most critical underwriting metric in 2026

### LTV (Loan-to-Value Ratio)
- Formula: Loan Amount / Property Value
- Typical maximums: 65-75% for conventional, up to 80% for SBA

## COMMERCIAL LOAN HELP'S PROCESS

1. Borrower answers 7 quick questions through ClearPath (60 seconds)
2. ClearPath searches hundreds of lender relationships
3. We present the best matching options
4. Borrower connects directly with matched lenders
5. No obligation — borrower only moves forward when ready
"""

SYSTEM_PROMPT = """You are the Commercial Loan Help AI Assistant — a knowledgeable, helpful guide for anyone navigating commercial lending.

## YOUR IDENTITY
- You are an AI educational assistant, NOT a loan officer, broker, or lender
- You represent Commercial Loan Help, a commercial loan marketplace
- Your name is "CLH Assistant" if asked

## STRICT COMPLIANCE RULES
1. NEVER quote specific interest rates or rate ranges. Do not cite any percentage figures for rates. Explain that rates vary based on deal specifics and redirect to ClearPath matching.
2. NEVER guarantee loan approval, funding amounts, or specific terms
3. NEVER act as or pretend to be a loan officer, broker, or lender
4. NEVER provide legal, tax, or investment advice
5. NEVER ask for sensitive personal information
6. If asked about rates, say: "I can't quote rates — they depend on many factors including your credit profile, property type, LTV, DSCR, and current market conditions. Our ClearPath matching system can connect you with lenders who specialize in your exact scenario."

## CONVERSION GUIDANCE
When appropriate, suggest the free ClearPath matching system (takes 60 seconds, no credit pull).

## TONE
Professional but warm. Concise. Keep responses under 200 words when possible. Use bullet points for lists.
"""

FULL_SYSTEM = f"{SYSTEM_PROMPT}\n\n## KNOWLEDGE BASE\n{KNOWLEDGE_BASE}"


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(content_length)) if content_length else {}

        messages = body.get("messages", [])
        if not messages:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "No messages provided"}).encode())
            return

        if len(messages) > 20:
            messages = messages[-20:]

        cleaned = []
        for msg in messages:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role in ("user", "assistant") and isinstance(content, str) and content.strip():
                cleaned.append({"role": role, "content": content[:2000]})

        if not cleaned or cleaned[-1]["role"] != "user":
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Invalid message format"}).encode())
            return

        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "API key not configured"}).encode())
            return

        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        try:
            from anthropic import Anthropic

            client = Anthropic(api_key=api_key)
            with client.messages.stream(
                model="claude-haiku-4-5",
                max_tokens=600,
                system=FULL_SYSTEM,
                messages=cleaned,
            ) as stream:
                for text in stream.text_stream:
                    chunk = f"data: {json.dumps({'text': text})}\n\n"
                    self.wfile.write(chunk.encode())
                    self.wfile.flush()

            done = f"data: {json.dumps({'done': True})}\n\n"
            self.wfile.write(done.encode())
            self.wfile.flush()
        except Exception as e:
            err = f"data: {json.dumps({'error': str(e)})}\n\n"
            self.wfile.write(err.encode())
            self.wfile.flush()

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
