from http.server import BaseHTTPRequestHandler
import json
import os

KNOWLEDGE_BASE = """
## ABOUT COMMERCIAL LOAN HELP

Commercial Loan Help is a commercial loan marketplace and advisory service, not a lender. Our proprietary ClearPath matching system evaluates a borrower's loan type, asset class, credit profile, and timeline, then connects them to the best lender from our network of hundreds of established relationships: SBA lenders, bridge lenders, CMBS conduits, private credit funds, mezzanine providers, and more.

Key facts:
- Licensed in all 50 states
- No minimum loan size
- $0 cost to use the matching service
- No credit pull required for initial matching
- Matching takes approximately 60 seconds
- Lender-agnostic: we work for the borrower, not any single bank

ClearPath Process:
1. Borrower answers 7 quick questions (60 seconds)
2. ClearPath searches hundreds of lender relationships
3. We present the best matching options
4. Borrower connects directly with matched lenders
5. No obligation; borrower only moves forward when ready

## THE 2026 COMMERCIAL LOAN MATURITY WALL

Approximately $875 billion in commercial and multifamily mortgage debt is scheduled to mature in 2026, representing about 17% of the $5 trillion outstanding. This is the largest single-year maturity event in commercial real estate history. Combined with 2025 and 2027 maturities, over $1.5 trillion must be refinanced in a three-year window.

Why it matters:
- Most loans were originated between 2019 and 2022 at historically low rates
- Current refinancing rates are significantly higher than origination rates
- Many properties have experienced value compression of 15-30%
- Debt Service Coverage Ratios (DSCR) have tightened, making traditional refinancing difficult
- Some lenders have reduced CRE exposure due to regulatory pressure

Five main options for maturing loans:
1. Traditional Refinance: if DSCR and LTV still qualify at current rates
2. Bridge Loan: short-term (12-36 months) to buy time for stabilization or rate improvement
3. Mezzanine Debt: fills the gap between senior loan and equity when LTV falls short
4. Preferred Equity: provides additional leverage without adding to the debt stack
5. Private Credit: non-bank lenders with flexible underwriting for complex situations

Extend and Pretend: Some lenders are offering loan extensions (1-3 years) to avoid forced sales and crystallized losses. This strategy delays but does not solve the underlying refinancing challenge.

## LOAN TYPES

### SBA 7(a) Loans
- Maximum: $5 million
- Flexible use: real estate, working capital, equipment, business acquisitions, partner buyouts
- SBA guarantees up to 85% of loan amount (loans up to $150K) or 75% (loans over $150K)
- Terms: up to 25 years for real estate, 10 years for equipment, 7 years for working capital
- Rates: variable, tied to Prime Rate plus a spread
- Down payment: typically 10-20%
- Credit score: generally 680+ preferred
- Best for: small businesses needing flexible financing, partner buyouts, business acquisitions with real estate

### SBA 504 Loans
- Long-term, fixed-rate financing for owner-occupied commercial real estate and heavy equipment
- Tripartite structure: bank provides 50%, CDC provides 40%, borrower puts down 10%
- Below-market fixed rates on the CDC portion (20-year or 25-year term)
- Must be owner-occupied (at least 51% for existing buildings, 60% for new construction)
- Job creation or public policy requirements apply
- Best for: businesses buying their own building or major equipment with lower down payment

### Commercial Bridge Loans
- Short-term: 6 to 36 months typically
- Quick closing: 2-4 weeks possible, sometimes faster
- Higher leverage available: up to 75-80% LTV
- Interest-only payments during the loan term
- Rates vary based on deal specifics and borrower profile
- Best for: acquisitions, repositioning, value-add projects, buying time before permanent financing
- Exit strategy required (refinance to permanent or sale)

### Hard Money Loans
- Asset-based lending focused primarily on property value, not borrower credit
- Very fast closing: 1-2 weeks possible
- Higher cost than conventional options
- Typically 65-75% LTV
- Terms: 6-24 months
- Best for: time-sensitive deals, distressed properties, borrowers with credit challenges

### CMBS Loans (Commercial Mortgage-Backed Securities)
- Non-recourse financing (with standard bad boy carve-outs)
- For stabilized commercial real estate only
- Competitive fixed rates
- Terms: 5, 7, or 10 years typically
- Amortization: 25-30 years
- Minimum loan size: usually $2-3 million
- Prepayment: defeasance or yield maintenance (can be costly)
- Best for: larger stabilized properties where non-recourse and competitive rates matter
- Less flexible than bank loans (special servicer handles modifications)

### Construction Loans
- For ground-up development or major renovation
- Interest-only during construction period
- Typically 12-24 months (plus extensions)
- Loan-to-Cost (LTC) typically 65-80%
- Interest reserve built into loan to cover payments during construction
- Draw schedule: funds disbursed as construction progresses
- Requires strong sponsor experience, detailed budget, and construction timeline
- Best for: developers with a track record and solid development plans

### Construction-to-Permanent Loans
- Single-close product that converts from construction loan to permanent financing upon completion
- Saves time and closing costs compared to two separate loans
- Available through some banks, SBA 504, and Fannie Mae/Freddie Mac (multifamily)

### Mezzanine Debt
- Subordinate financing positioned between senior debt and equity in the capital stack
- Secured by a pledge of ownership interests (not a mortgage lien)
- Terms: 2-7 years
- Rates higher than senior debt due to increased risk
- Can push total leverage to 80-90% of value
- UCC foreclosure process (faster than mortgage foreclosure)
- Best for: filling the gap when senior financing falls short of total capital needed

### Preferred Equity
- Equity investment with a preferred return, positioned above common equity in the capital stack
- Not technically debt, so it does not add to the property's debt stack
- Investor receives a preferred return before common equity holders
- Can be structured as current-pay or accruing
- Best for: situations where additional debt would violate loan covenants or DSCR requirements

### Private Credit and Debt Funds
- Non-bank lenders with over $200 billion in dry powder as of 2026
- More flexible underwriting than traditional banks
- Can move quickly on complex deals
- Filling the gap left by bank lending pullback
- Terms and structures vary widely
- Best for: deals that do not fit traditional bank criteria, complex capital structures, time-sensitive opportunities

### Fannie Mae DUS (Multifamily)
- Delegated Underwriting and Servicing program for multifamily properties (5+ units)
- Non-recourse with standard carve-outs
- Fixed and floating rate options
- Terms: 5, 7, 10, 12, 15 years
- Amortization: up to 30 years
- Minimum loan: typically $1 million
- Supplemental loans available
- Best for: stabilized multifamily properties seeking competitive non-recourse terms

### Freddie Mac Optigo (Multifamily)
- Small Balance Loan (SBL) program for $1-7.5 million multifamily
- Conventional program for larger multifamily
- Non-recourse, fixed and floating rates
- Streamlined process for SBL
- Best for: multifamily of all sizes, particularly small balance deals

### HUD/FHA 223(f)
- Acquisition or refinance of existing multifamily properties (5+ units)
- Up to 85% LTV (87% for affordable housing)
- Fully non-recourse
- 35-year fully amortizing term (no balloon)
- Lowest rates in multifamily lending
- MIP (Mortgage Insurance Premium) applies
- Longer process: 90-180 days typical
- Best for: long-term hold multifamily investors seeking the lowest cost of capital

### HUD/FHA 221(d)(4)
- New construction or substantial rehabilitation of multifamily
- Up to 85% LTC (87-90% for affordable)
- Fully non-recourse
- 40-year term plus construction period (up to 3 years)
- Longest term and lowest rate available for multifamily construction
- Davis-Bacon wage requirements apply
- Best for: multifamily developers with patience for the HUD process

### HUD 232
- For senior housing: assisted living, skilled nursing, memory care, board and care
- Both new construction (232/241a) and refinance (232/223f)
- Fully non-recourse, long-term, low rates
- Best for: experienced senior housing operators

### USDA Business and Industry (B&I) Loans
- For businesses in rural areas (populations under 50,000)
- Government guarantee up to 80% (loans up to $5M), 70% ($5-10M), 60% ($10-25M)
- Terms up to 30 years for real estate
- Maximum: $25 million
- Best for: businesses in rural communities seeking favorable terms with a government guarantee

### Permanent / Long-Term Commercial Loans
- For stabilized, cash-flowing commercial properties
- Fixed or variable rates
- Terms: 5-30 years depending on lender type
- Amortization: 20-30 years typical
- Sources: banks, life companies, CMBS, agency (Fannie/Freddie for multifamily)

### Small Balance Commercial Loans
- Generally under $5 million (some programs up to $7.5 million)
- Streamlined underwriting process
- Available from banks, credit unions, Freddie Mac SBL, and specialized lenders
- Best for: smaller commercial properties and borrowers seeking efficient execution

### Business Lines of Credit
- Revolving credit facility
- Draw as needed, pay interest only on outstanding balance
- Annual renewal typical
- Secured or unsecured options
- Best for: working capital, inventory, seasonal needs, operating expenses

### Equipment Financing
- For purchase of business equipment
- Equipment serves as collateral
- Terms match useful life of equipment (3-10 years typical)
- Up to 100% financing available
- Best for: businesses acquiring machinery, vehicles, technology, or specialized equipment

### Land Loans
- For acquisition of commercial or development land
- Higher down payment required: typically 30-50%
- Shorter terms: 1-5 years
- Higher rates than improved property loans
- Best for: developers acquiring land for future development (often refinanced into construction loan)

### Portfolio Loans
- Held by originating bank (not sold on secondary market)
- More flexible underwriting and terms
- May accept non-standard properties or borrower situations
- Terms negotiable
- Best for: unique situations that do not fit agency, CMBS, or standard programs

## PROPERTY TYPES AND FINANCING CONSIDERATIONS

### Multifamily / Apartments
- Strongest asset class for lender appetite
- Most financing options available: agency (Fannie/Freddie), HUD, CMBS, bank, private credit
- DSCR requirements: typically 1.20-1.25x
- LTV: up to 80% (agency), 85% (HUD)
- Strong long-term fundamentals driven by housing demand

### Office Buildings
- Challenged sector following remote work shift
- Lenders are cautious; higher down payments and lower LTV (60-65%)
- Suburban and medical office performing better than urban CBD
- Class A properties with strong tenants still financeable
- Class B/C facing significant headwinds

### Retail Properties
- Recovery underway; anchored centers and necessity-based retail performing well
- High-street and experiential retail gaining lender interest
- Single-tenant net lease (NNN) popular with lenders due to credit tenant
- Unanchored strip centers face more scrutiny

### Industrial / Warehouse
- Lender favorite due to strong fundamentals
- E-commerce, nearshoring, and supply chain reconfiguration driving demand
- Lower vacancy rates nationally
- Competitive terms available; LTV up to 75%

### Hospitality / Hotels
- Specialized lenders required; understanding of RevPAR, ADR, and occupancy critical
- Flagged (branded) properties generally easier to finance than independent
- SBA 504 popular for owner-operated hotels
- Bridge loans common for repositioning or renovation
- Seasonal cash flow requires careful underwriting

### Self-Storage
- Growing asset class with attractive cash flow characteristics
- Relatively recession-resistant
- SBA and conventional financing available
- Self-service model reduces operating complexity
- Strong investor interest driving development

### Mixed-Use Properties
- Treated as most restrictive use by lenders (e.g., if 40% retail and 60% residential, may be underwritten as retail)
- Residential component generally helps with financing
- SBA available if owner-occupied commercial portion qualifies

### Medical Office Buildings
- Recession-resistant tenancy
- Stable, long-term leases common
- Specialized build-out requirements
- Lender favorable due to tenant quality and lease stability

### Senior Housing / Assisted Living
- HUD 232 provides excellent terms for qualified operators
- Operating complexity increases underwriting scrutiny
- Experienced operators have significant financing advantages
- Growing demand driven by aging demographics

### Gas Station / C-Store
- SBA loans popular (7(a) and 504)
- Environmental concerns require Phase I and often Phase II ESA
- Underground storage tank compliance critical
- Specialized underwriting based on fuel volume and store revenue

### Restaurant Properties
- Higher perceived risk due to restaurant failure rates
- Owner-occupied SBA loans most common
- Lenders prefer franchise/flag concepts over independent
- Strong personal guarantee typically required

## KEY LENDING METRICS AND CONCEPTS

### DSCR (Debt Service Coverage Ratio)
- Formula: Net Operating Income / Annual Debt Service
- Most lenders require minimum 1.20-1.25x
- DSCR has become the most critical underwriting metric in 2026
- Higher DSCR = more comfort for the lender = better terms
- A DSCR below 1.0x means the property cannot cover its debt payments from operations

### LTV (Loan-to-Value Ratio)
- Formula: Loan Amount / Property Value
- Typical maximums: 65-75% for conventional, up to 80% for SBA, 85% for HUD
- Lower LTV = lower risk for lender = better rates and terms

### LTC (Loan-to-Cost Ratio)
- Formula: Loan Amount / Total Project Cost
- Used primarily for construction and value-add deals
- Typical maximum: 75-85%
- Includes acquisition, construction, soft costs

### Debt Yield
- Formula: NOI / Loan Amount
- Minimum usually 8-10% depending on property type
- Increasingly used alongside DSCR and LTV as a sizing constraint
- Measures the lender's return independent of interest rate and amortization

### Cap Rate (Capitalization Rate)
- Formula: NOI / Property Value
- Measures the unlevered return on a property investment
- Lower cap rate = higher value relative to income = more expensive market
- Varies significantly by property type, location, and quality

### NOI (Net Operating Income)
- Revenue minus operating expenses (excluding debt service, depreciation, and capital expenditures)
- The foundation for property valuation and loan sizing
- T12 (trailing 12 months) actuals preferred by lenders over pro forma projections

### Amortization vs. Term
- Amortization: the repayment schedule, usually 25-30 years
- Term: the actual loan duration, typically 5-10 years for commercial
- At the end of the term, remaining balance is due as a balloon payment
- Fully amortizing loans (like HUD) have no balloon

### Recourse vs. Non-Recourse
- Recourse: borrower personally liable for the full loan balance
- Non-recourse: lender's remedy limited to the property (with carve-out exceptions)
- CMBS, agency, and HUD loans are typically non-recourse
- Bank loans are usually recourse (with some exceptions for strong sponsors)

### Bad Boy Carve-Outs
- Exceptions to non-recourse protection that trigger personal liability
- Common triggers: fraud, misrepresentation, environmental contamination, voluntary bankruptcy filing, misapplication of rents or insurance proceeds

### Prepayment Penalties
Three common types in commercial lending:
1. Yield Maintenance: make-whole penalty ensuring lender receives the same yield as if the loan ran to maturity. Usually the most expensive option.
2. Defeasance: borrower purchases a portfolio of government securities that replicate the remaining loan payments. Common in CMBS. Property is released from the lien.
3. Step-Down: declining percentage over time (e.g., 5%, 4%, 3%, 2%, 1%). Most borrower-friendly.

### SOFR (Secured Overnight Financing Rate)
- Replaced LIBOR as the benchmark index for floating-rate commercial loans
- Based on overnight repurchase agreement transactions
- Floating rate loans typically priced as SOFR plus a spread

### Capital Stack
From top (lowest risk, first repaid) to bottom (highest risk, last repaid):
1. Senior Debt (first mortgage): 50-75% of value
2. Mezzanine Debt: 75-85% of value
3. Preferred Equity: 85-90% of value
4. Common Equity: remaining capital from sponsors/investors

## UNDERWRITING AND LOAN PROCESS

### Application Process
1. Pre-qualification: initial conversation about deal and borrower profile
2. Term Sheet / Letter of Intent: lender outlines proposed terms
3. Formal Application: submission of full documentation package
4. Underwriting: lender analyzes property, borrower, and market
5. Approval / Commitment: formal loan commitment issued
6. Closing: legal documents executed, funds disbursed

### Documents Typically Required
- Personal Financial Statement (PFS)
- Tax returns (2-3 years personal and business)
- Rent roll (current and historical)
- Operating statements / T12 (trailing 12 months)
- Property photos and description
- Business plan or executive summary
- Entity documents (operating agreement, articles of organization)
- Schedule of real estate owned

### Underwriting Timeline
- Bridge Loans: 2-4 weeks
- Bank Loans: 30-60 days
- CMBS: 45-90 days
- Agency (Fannie/Freddie): 45-60 days
- HUD/FHA: 90-180 days (longest, but best terms)

### Appraisal
- Required for virtually all commercial loans
- Three approaches: Income (most common for investment property), Sales Comparison, Cost
- Ordered by the lender, paid by the borrower
- Must be performed by a licensed MAI appraiser for most commercial transactions

### Phase I Environmental Site Assessment (ESA)
- Standard requirement for commercial real estate loans
- Identifies potential environmental contamination risks
- If concerns are found, Phase II (soil/water testing) may be required
- Lender will not close without satisfactory environmental clearance

### Credit Score Considerations
- Most commercial lenders: 660+ minimum
- SBA loans: typically 680+ preferred
- Hard money / private credit: more flexible, may accept 600+
- Strong deal fundamentals can sometimes offset lower credit scores

### Entity Structure
- LLC is most common structure for CRE ownership
- Single-Purpose Entity (SPE) required for CMBS loans
- Protects personal assets and provides liability separation
- Operating agreement should match loan requirements

## BORROWER SCENARIOS

### First-Time CRE Borrower
- SBA loans or local/community bank loans are the most accessible starting points
- Strong business plan and personal financial statement are critical
- Consider starting with a smaller deal to build a track record
- Owner-occupied properties are easier to finance as a first deal

### Maturing Loan Refinance
- Start evaluating options 6-12 months before maturity
- Compare current property value and cash flow to original loan terms
- Bridge loan is a viable option if permanent financing is not immediately achievable
- Explore mezzanine or preferred equity if there is a capital gap
- ClearPath matching can quickly identify refinance options

### Value-Add Acquisition
- Bridge loan for acquisition plus renovation capital
- Business plan should detail renovation scope, budget, and projected stabilized value
- Refinance to permanent financing once property is stabilized
- Lenders focus on sponsor experience and feasibility of the value-add plan

### Cash-Out Refinance
- Access equity in a stabilized, cash-flowing property
- Typically limited to 70-75% LTV for commercial cash-out
- Proceeds can be used for any purpose (new acquisitions, capital improvements, debt repayment)
- Property must demonstrate strong DSCR at the higher loan amount

### 1031 Exchange Financing
- Must identify replacement property within 45 days of sale
- Must close replacement property within 180 days
- Debt on replacement must be equal to or greater than debt on relinquished property
- Qualified intermediary required
- Pre-approval and fast closing capability are critical

### Partner Buyout
- SBA 7(a) loans can finance partner buyouts
- Valuation of the business/property is required
- May need a combination of debt sources
- Operating agreement buy-sell provisions matter for structuring

### Ground-Up Development
- Construction loan for the build phase
- Permanent takeout financing upon completion and stabilization
- Strong sponsor experience is required; first-time developers face challenges
- Detailed budget, timeline, and market study are critical

## MARKET CONDITIONS 2026

### Bank Lending Environment
- Regional and community banks have reduced CRE lending exposure
- Regulatory pressure from FDIC and OCC to manage CRE concentration risk
- Tighter underwriting standards: lower LTV, higher DSCR requirements
- Relationship banking still matters for qualified borrowers

### Private Credit Growth
- Debt funds have over $200 billion in dry powder for CRE lending
- Filling the gap left by bank retrenchment
- More flexible terms but generally higher cost
- Expanding into bridge, mezzanine, construction, and preferred equity

### Sector Outlook
- Multifamily: fundamentals normalizing after rapid 2021-2022 rent growth. Rent growth moderating but long-term demand strong. Supply wave in some markets.
- Office: continued bifurcation. Class A with amenities performing; Class B/C facing value declines of 20-40%. Conversion to residential gaining traction in select markets.
- Industrial: continued strength. E-commerce, nearshoring, and data center demand driving tenant activity.
- Retail: selective recovery. Grocery-anchored and experiential retail performing. Unanchored strip centers remain challenged.
- Hospitality: RevPAR recovery continuing. Business travel normalizing. Leisure demand stable.

## COMPARISON QUICK REFERENCES

### SBA 7(a) vs. SBA 504
- 7(a): more flexible use (working capital, equipment, acquisitions, real estate). Variable rate. Up to $5M.
- 504: lower fixed rate on CDC portion. Owner-occupied real estate only. Lower down payment (10%). Job creation requirement.
- Choose 7(a) for flexibility. Choose 504 for the lowest fixed rate on owner-occupied real estate.

### Bridge Loan vs. Permanent Loan
- Bridge: short-term (6-36 months), interest-only, higher rate, quick close, for transitional properties
- Permanent: long-term (5-30 years), amortizing, lower rate, for stabilized properties
- Bridge is temporary; permanent is the long-term solution

### CMBS vs. Bank Loan
- CMBS: non-recourse, fixed rate, less flexible, prepayment via defeasance/yield maintenance
- Bank: usually recourse, may offer fixed or floating, more flexible, prepayment varies
- CMBS for non-recourse and fixed rate certainty. Bank for flexibility and relationship.

### Fixed vs. Floating Rate
- Fixed: rate certainty, protection from rising rates, may have yield maintenance or defeasance
- Floating: lower initial rate, risk of rate increases, typically easier prepayment (usually no penalty after lockout)
- Fixed for stability and long-term hold. Floating for short-term hold or expectation of declining rates.

### Bank vs. Non-Bank (Private Credit)
- Bank: lower cost, stricter underwriting, slower, regulatory constraints
- Non-bank: higher cost, flexible underwriting, faster, no regulatory constraints
- Bank when you qualify. Non-bank when you need speed, flexibility, or do not fit bank criteria.

## SPECIALTY PROPERTY TYPES

### Gas Station / Convenience Store Loans
- Loan range: $500K-$10M. SBA 504 and 7(a) are popular options.
- Environmental concerns are critical: Phase I (and often Phase II) Environmental Site Assessments are required.
- Branded vs unbranded: branded stations may get better terms due to franchise backing.
- Income underwriting includes fuel margins plus c-store revenue.

### Hotel / Hospitality Loans
- Loan range: $1M-$100M+. Options include SBA, CMBS, agency (limited), and conventional.
- Flagged (branded) hotels generally get better financing terms than independent properties.
- Key metrics: RevPAR (Revenue Per Available Room), ADR (Average Daily Rate), occupancy.
- Franchise agreement and PIP (Property Improvement Plan) requirements affect deal structure.

### Self-Storage Facility Loans
- Loan range: $500K-$20M. Conventional, SBA, CMBS for larger facilities.
- Key metrics: price per square foot, occupancy stabilization timeline, climate-controlled premium.
- Value-add: converting to climate-controlled, adding RV/boat storage, operational improvements.

### Senior Housing / Assisted Living Loans
- Loan range: $2M-$50M+. HUD 232, Fannie Mae, Freddie Mac, and conventional.
- Property subtypes: independent living, assisted living, memory care, skilled nursing.
- Licensing and regulatory compliance significantly impact financing.

### Medical Office Building Loans
- Loan range: $1M-$30M. SBA for owner-occupied, conventional for investment.
- Tenant credit matters: healthcare system tenants are preferred over solo practitioners.
- Specialized buildout costs can be significant.

### Cannabis Real Estate Loans
- Federal illegality prevents bank/SBA lending. Private lenders and sale-leaseback structures dominate.
- Higher rates (typically 12-18%) and lower LTV (50-65%) reflect regulatory risk.
- Facility types: cultivation, processing, dispensary, distribution.

### Restaurant Real Estate Loans
- SBA 504 and 7(a) are common for owner-occupied restaurants.
- Franchise restaurants may get preferential terms.
- Lenders evaluate food cost ratios, operator experience, and market conditions.

### Car Wash Facility Loans
- SBA available for construction and acquisition. Loan range: $500K-$10M.
- Express tunnel, full-service, and self-serve have different economics.
- Membership/subscription revenue models are increasingly preferred by lenders.

### Auto Dealership Loans
- Loan range: $2M-$30M. Floor plan financing is separate from real estate loans.
- OEM image compliance requirements can drive renovation costs.
- Blue sky value (goodwill above tangible assets) is a key acquisition metric.

### Manufactured Housing Community (MHC) Loans
- Loan range: $1M-$50M+. Fannie Mae and Freddie Mac have dedicated MHC programs.
- Key metrics: lot rent, pad occupancy, tenant-owned vs park-owned homes.
- Value-add: utility billing, infill development, amenity upgrades.

## ADDITIONAL LENDING CONCEPTS

### Recourse vs Non-Recourse
- Recourse: lender can pursue borrower's personal assets in default. Common in bank, SBA, most bridge loans.
- Non-recourse: lender's remedy limited to the collateral property. Common in CMBS, agency, life company loans.
- Non-recourse loans include "bad boy" carve-outs that trigger full recourse for fraud, voluntary bankruptcy, or misappropriation.

### Bad Boy Carve-Outs
- Provisions in non-recourse loans that convert to full recourse if borrower commits prohibited acts.
- Common triggers: fraud, voluntary bankruptcy, misappropriation of funds, unauthorized property transfers, environmental violations.
- A guarantor (usually the sponsor) signs these carve-outs.

### Personal Guaranty
- Full guaranty: guarantor liable for entire loan amount. Limited guaranty: capped at a specific amount or percentage.
- Completion guaranty: common in construction loans, requires project to be finished.
- Burnoff provisions: guaranty reduces over time as loan is repaid or conditions are met.

### Capital Stack
- Layers from lowest risk to highest: senior debt (first lien), subordinate/mezzanine debt, preferred equity, common equity.
- Each layer is priced based on risk. Senior debt: lowest cost, first claim. Common equity: highest return potential, last claim.
- Intercreditor agreements govern the relationship between layers.

### SOFR and Floating Rate Loans
- SOFR (Secured Overnight Financing Rate) replaced LIBOR as the benchmark for floating rate commercial loans.
- Structure: SOFR + spread (e.g., SOFR + 250 basis points).
- Rate caps are typically required by lenders on floating rate loans to limit borrower exposure.

### Amortization and Balloon Payments
- Most commercial loans amortize over 20-30 years but have a shorter loan term (5-10 years).
- At maturity, the remaining balance (balloon payment) must be paid, typically through refinancing.
- Interest-only periods (1-5 years) reduce initial payments but increase the balloon.

### Prepayment Penalties
- Yield maintenance: present value calculation based on Treasury rates. Cost varies with rate environment.
- Defeasance: replacing loan collateral with Treasury securities. Common in CMBS. Requires a consultant.
- Step-down: declining percentage (e.g., 5-4-3-2-1% over 5 years). Most borrower-friendly.
- Lockout: no prepayment allowed for a set period.

### Lease Types (Impact on Underwriting)
- NNN (Triple Net): tenant pays taxes, insurance, maintenance. Most predictable NOI for lenders.
- Gross Lease: landlord pays all expenses. Higher gross rent but more expense risk.
- Modified Gross: shared expense responsibility. Common in office and medical office.

### Building Classes
- Class A: premium location, newest construction, top amenities, lowest cap rates, best financing terms.
- Class B: good quality, older but maintained, value-add potential, moderate cap rates.
- Class C: older, functional, lowest rents, highest cap rates, may face financing challenges.

## CALCULATORS AND TOOLS AVAILABLE ON OUR SITE
- DSCR Calculator: calculate your Debt Service Coverage Ratio
- Commercial Mortgage Calculator: estimate monthly payments
- Debt Yield Calculator: NOI divided by loan amount
- LTV Calculator: loan amount divided by property value
- Cap Rate Calculator: NOI divided by property value
- Amortization Schedule Calculator: full payment schedule with balloon
- Defeasance Cost Estimator: estimate CMBS defeasance costs
- SBA 7(a) vs 504 Eligibility Tool: find the right SBA program
- Loan Comparison Tool: compare up to 3 loan offers side by side
- Interest Reserve Calculator: estimate construction loan interest reserve
"""

SYSTEM_PROMPT = """You are the Commercial Loan Help AI Assistant, a knowledgeable and helpful guide for anyone navigating commercial lending.

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
6. If asked about rates, say: "Rates vary based on many factors including your credit profile, property type, LTV, DSCR, and current market conditions. Our ClearPath matching system can connect you with lenders who specialize in your exact scenario."

## WRITING STYLE
- Never use em dashes in your responses. Use colons, periods, commas, semicolons, or parentheses instead.
- Professional but warm tone
- Concise: keep responses under 250 words when possible
- Use bullet points and bold text for readability
- Draw from the knowledge base to give thorough, educational answers

## CONVERSION GUIDANCE
When appropriate, suggest the free ClearPath matching system (takes 60 seconds, no credit pull). Do this naturally, not in every response.
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
                max_tokens=800,
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
