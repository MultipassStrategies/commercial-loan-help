/* ==========================================================================
   CLH Hybrid Chatbot Widget v5
   AI-first with client-side keyword fallback.
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
  // CLIENT-SIDE KEYWORD FALLBACK KNOWLEDGE BASE
  // ===========================================================================
  var RESPONSES = [
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'sup', 'yo', 'howdy'],
      answer: 'Welcome to Commercial Loan Help! I can help you understand:<br><br><ul><li><strong>Commercial loan types</strong> (SBA, bridge, CMBS, mezzanine, and more)</li><li><strong>The 2026 maturity wall</strong> and your refinancing options</li><li><strong>Key lending metrics</strong> like DSCR, LTV, and cap rates</li><li><strong>How our free ClearPath matching</strong> connects you with the right lender</li></ul><br>What would you like to know more about?'
    },
    {
      keywords: ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'perfect', 'helpful'],
      answer: 'You\'re welcome! If you have any other questions about commercial lending, I\'m here to help.<br><br>When you\'re ready, our free <strong>ClearPath matching</strong> can connect you with the right lender in about 60 seconds. No credit pull required.'
    },
    {
      keywords: ['maturity wall', 'maturing', '2026 wall', 'maturity', 'refinanc'],
      answer: '<strong>The 2026 Commercial Loan Maturity Wall</strong><br><br>Approximately <strong>$875 billion</strong> in commercial and multifamily mortgage debt is set to mature in 2026. This is the largest single-year maturity event in commercial real estate history.<br><br><strong>Why it matters:</strong><ul><li>Most loans originated 2019 to 2022 at historically low rates</li><li>Today\'s refinancing rates are significantly higher</li><li>Property values compressed 15 to 30%</li><li>Tighter DSCRs make traditional refinancing difficult</li><li>Some lenders have reduced CRE exposure</li></ul><br><strong>Five main options:</strong><ul><li><strong>Traditional Refinance</strong> if DSCR and LTV still qualify</li><li><strong>Bridge Loan</strong> (12 to 36 months) to buy time</li><li><strong>Mezzanine Debt</strong> to fill the gap between senior debt and equity</li><li><strong>Preferred Equity</strong> for leverage without adding to the debt stack</li><li><strong>Private Credit</strong> for flexible, non-bank solutions</li></ul><br>Some lenders also offer "extend and pretend" extensions of 1 to 3 years, but this delays rather than solves the challenge.<br><br>Our free ClearPath matching can connect you with lenders who specialize in your exact situation. It only takes 60 seconds and requires no credit pull.'
    },
    {
      keywords: ['sba', '7a', '7(a)', '504', 'small business admin'],
      answer: '<strong>SBA Loan Programs</strong><br><br><strong>SBA 7(a) Loans:</strong><ul><li>Up to $5 million</li><li>Flexible use: real estate, working capital, equipment, acquisitions, partner buyouts</li><li>SBA guarantees up to 85% (loans up to $150K) or 75% (loans over $150K)</li><li>Terms up to 25 years for real estate, 10 years for equipment</li><li>Down payment: typically 10 to 20%</li><li>Credit score: generally 680+ preferred</li></ul><br><strong>SBA 504 Loans:</strong><ul><li>Long-term, fixed-rate financing for owner-occupied commercial real estate</li><li>Structure: bank (50%), CDC (40%), borrower (10% down)</li><li>Below-market fixed rates on the CDC portion</li><li>Must be owner-occupied (51% for existing, 60% for new construction)</li><li>Job creation or public policy requirements apply</li></ul><br><strong>Quick comparison:</strong> Choose 7(a) for flexibility (working capital, acquisitions). Choose 504 for the lowest fixed rate on owner-occupied real estate.<br><br>Want to find the best SBA lender for your situation? Our free ClearPath matching takes just 60 seconds.'
    },
    {
      keywords: ['bridge', 'short term', 'short-term', 'quick close'],
      answer: '<strong>Commercial Bridge Loans</strong><br><br><ul><li>Short-term: 6 to 36 months typically</li><li>Quick closing: 2 to 4 weeks possible, sometimes faster</li><li>Higher leverage available (up to 75 to 80% LTV)</li><li>Interest-only payments during the loan term</li><li>Exit strategy required (refinance to permanent or sale)</li></ul><br><strong>Best for:</strong> Acquisitions, repositioning, value-add projects, or buying time before permanent financing. Bridge loans are one of the most common solutions for borrowers facing the 2026 maturity wall.<br><br><strong>Bridge vs. Permanent:</strong> Bridge is temporary and for transitional situations. Permanent loans are long-term for stabilized properties.<br><br>Our ClearPath matching can connect you with bridge lenders in about 60 seconds.'
    },
    {
      keywords: ['hard money', 'asset based', 'asset-based'],
      answer: '<strong>Hard Money Loans</strong><br><br><ul><li>Asset-based lending focused primarily on property value, not borrower credit</li><li>Very fast closing: 1 to 2 weeks possible</li><li>Higher cost than conventional options</li><li>Typically 65 to 75% LTV</li><li>Terms: 6 to 24 months</li></ul><br><strong>Best for:</strong> Time-sensitive deals, distressed properties, borrowers with credit challenges, or situations where traditional lenders cannot move fast enough.<br><br>Hard money is a short-term solution. Most borrowers refinance into conventional financing once the property is stabilized.<br><br>Our ClearPath matching includes hard money and private credit lenders. Try it free in 60 seconds.'
    },
    {
      keywords: ['cmbs', 'mortgage-backed', 'securit', 'conduit'],
      answer: '<strong>CMBS Loans (Commercial Mortgage-Backed Securities)</strong><br><br><ul><li>Non-recourse financing (with standard bad boy carve-outs)</li><li>For stabilized commercial real estate</li><li>Competitive fixed rates</li><li>Terms: 5, 7, or 10 years typically</li><li>Amortization: 25 to 30 years</li><li>Minimum loan size: usually $2 to 3 million</li><li>Prepayment via defeasance or yield maintenance (can be costly)</li></ul><br><strong>Best for:</strong> Larger stabilized properties where non-recourse and competitive fixed rates are priorities.<br><br><strong>CMBS vs. Bank:</strong> CMBS offers non-recourse but less flexibility. Bank loans are more flexible but usually require recourse.<br><br>Our ClearPath matching can connect you with CMBS conduits. Free, no credit pull, 60 seconds.'
    },
    {
      keywords: ['construction', 'build', 'develop', 'ground up', 'renovation', 'ground-up'],
      answer: '<strong>Construction Loans</strong><br><br><ul><li>For ground-up development or major renovation</li><li>Interest-only during construction period</li><li>Typically 12 to 24 months (plus extensions)</li><li>Loan-to-Cost (LTC) typically 65 to 80%</li><li>Interest reserve built into loan to cover payments during construction</li><li>Funds disbursed on a draw schedule as construction progresses</li><li>Requires strong sponsor experience, detailed budget, and timeline</li></ul><br><strong>Construction-to-Permanent:</strong> Single-close products that convert from construction to permanent financing upon completion. Saves time and closing costs.<br><br><strong>For multifamily:</strong> HUD 221(d)(4) offers the longest terms and lowest rates but requires patience (process takes 6 to 12 months).<br><br>Our ClearPath matching can connect you with experienced construction lenders in about 60 seconds.'
    },
    {
      keywords: ['mezzanine', 'mezz', 'subordinate', 'gap financing'],
      answer: '<strong>Mezzanine Debt</strong><br><br><ul><li>Subordinate financing between senior debt and equity in the capital stack</li><li>Secured by a pledge of ownership interests (not a mortgage lien)</li><li>Terms: 2 to 7 years</li><li>Can push total leverage to 80 to 90% of value</li><li>UCC foreclosure process (faster than mortgage foreclosure)</li></ul><br><strong>Best for:</strong> Filling the gap when senior financing falls short of total capital needed. Increasingly popular in 2026 as property values have compressed and senior lenders have reduced leverage.<br><br><strong>Mezzanine vs. Preferred Equity:</strong> Mezzanine is debt (sits above equity). Preferred equity is an equity position with a priority return. Some senior lenders restrict mezzanine but allow preferred equity.<br><br>Our ClearPath matching can help you find the right mezzanine provider.'
    },
    {
      keywords: ['preferred equity', 'pref equity'],
      answer: '<strong>Preferred Equity</strong><br><br><ul><li>Equity investment with a preferred return, positioned above common equity</li><li>Not technically debt, so it does not add to the property\'s debt stack</li><li>Investor receives a preferred return before common equity holders</li><li>Can be structured as current-pay or accruing</li></ul><br><strong>Best for:</strong> Situations where additional debt would violate loan covenants or DSCR requirements. Preferred equity allows sponsors to increase leverage without triggering restrictions in their senior loan documents.<br><br>Our ClearPath matching includes preferred equity providers. Try it free in 60 seconds.'
    },
    {
      keywords: ['private credit', 'non-bank', 'alternative lend', 'debt fund'],
      answer: '<strong>Private Credit and Debt Funds</strong><br><br><ul><li>Non-bank lenders with over $200 billion in dry powder as of 2026</li><li>More flexible underwriting than traditional banks</li><li>Can move quickly on complex deals</li><li>Filling the gap left by bank lending pullback</li><li>Terms and structures vary widely</li></ul><br><strong>Best for:</strong> Deals that do not fit traditional bank criteria, complex capital structures, and time-sensitive opportunities.<br><br><strong>Bank vs. Non-Bank:</strong> Banks offer lower cost but stricter underwriting. Non-bank lenders provide speed and flexibility at higher cost.<br><br>Our ClearPath matching has relationships with hundreds of private credit funds. Free, 60 seconds, no credit pull.'
    },
    {
      keywords: ['fannie mae', 'fannie', 'dus', 'agency lending', 'agency loan'],
      answer: '<strong>Fannie Mae DUS Multifamily Loans</strong><br><br><ul><li>Delegated Underwriting and Servicing program for multifamily (5+ units)</li><li>Non-recourse with standard carve-outs</li><li>Fixed and floating rate options</li><li>Terms: 5, 7, 10, 12, 15 years</li><li>Amortization: up to 30 years</li><li>Minimum loan: typically $1 million</li><li>Supplemental loans available for additional capital</li></ul><br><strong>Best for:</strong> Stabilized multifamily properties seeking competitive non-recourse terms. Fannie Mae is one of the largest sources of multifamily financing in the United States.<br><br>Our ClearPath matching can connect you with Fannie Mae DUS lenders in 60 seconds.'
    },
    {
      keywords: ['freddie mac', 'freddie', 'optigo', 'sbl', 'small balance loan'],
      answer: '<strong>Freddie Mac Optigo Multifamily Loans</strong><br><br><ul><li>Small Balance Loan (SBL) program for $1 to $7.5 million multifamily</li><li>Conventional program for larger multifamily</li><li>Non-recourse, fixed and floating rates</li><li>Streamlined process for SBL</li></ul><br><strong>Best for:</strong> Multifamily of all sizes, particularly small balance deals where the streamlined SBL process saves time and cost.<br><br>Our ClearPath matching includes Freddie Mac Optigo lenders. Try it free in 60 seconds.'
    },
    {
      keywords: ['hud', '223', '221', 'fha loan', '232'],
      answer: '<strong>HUD/FHA Multifamily Loan Programs</strong><br><br><strong>HUD 223(f):</strong> Acquisition or refinance of existing multifamily (5+ units)<ul><li>Up to 85% LTV (87% for affordable housing)</li><li>Fully non-recourse</li><li>35-year fully amortizing term (no balloon payment)</li><li>Lowest rates in multifamily lending</li><li>Process: 90 to 180 days</li></ul><br><strong>HUD 221(d)(4):</strong> New construction or substantial rehab<ul><li>Up to 85% LTC</li><li>40-year term plus construction period</li><li>Longest term and lowest rate for multifamily construction</li><li>Davis-Bacon wage requirements apply</li></ul><br><strong>HUD 232:</strong> Senior housing and skilled nursing<ul><li>Assisted living, memory care, board and care</li><li>Fully non-recourse, long-term, low rates</li></ul><br>HUD loans offer the best terms but require patience. Our ClearPath matching can connect you with experienced HUD lenders.'
    },
    {
      keywords: ['usda', 'rural', 'b&i', 'business and industry'],
      answer: '<strong>USDA Business and Industry (B&I) Loans</strong><br><br><ul><li>For businesses in rural areas (populations under 50,000)</li><li>Government guarantee: up to 80% for loans up to $5M, 70% for $5 to $10M, 60% for $10 to $25M</li><li>Terms up to 30 years for real estate</li><li>Maximum: $25 million</li></ul><br><strong>Best for:</strong> Businesses in rural communities seeking favorable terms with a government guarantee. USDA B&I is often overlooked but offers excellent terms for qualifying borrowers.<br><br>Our ClearPath matching can help you find USDA B&I lenders. Free, 60 seconds.'
    },
    {
      keywords: ['dscr', 'debt service', 'coverage ratio'],
      answer: '<strong>DSCR (Debt Service Coverage Ratio)</strong><br><br><ul><li><strong>Formula:</strong> Net Operating Income / Annual Debt Service</li><li>Most lenders require a minimum of 1.20 to 1.25x</li><li>DSCR has become the most critical underwriting metric in 2026</li><li>Higher DSCR = more lender comfort = better terms</li><li>A DSCR below 1.0x means the property cannot cover its debt payments from operations</li></ul><br>Many maturing loans are facing DSCR challenges because higher refinancing rates increase debt service while property income has not grown proportionally.<br><br>Not sure where you stand? Our free ClearPath matching can help you explore your options in 60 seconds.'
    },
    {
      keywords: ['ltv', 'loan to value', 'loan-to-value', 'down payment', 'how much down'],
      answer: '<strong>LTV (Loan-to-Value Ratio)</strong><br><br><ul><li><strong>Formula:</strong> Loan Amount / Property Value</li><li>Typical maximums: 65 to 75% for conventional, up to 80% for SBA, 85% for HUD</li><li>Lower LTV = lower risk for lender = better rates and terms</li></ul><br><strong>Typical down payments by loan type:</strong><ul><li>Conventional bank: 25 to 35%</li><li>SBA 504: 10%</li><li>SBA 7(a): 10 to 20%</li><li>CMBS: 25 to 35%</li><li>Bridge: 20 to 30%</li></ul><br>Many properties facing 2026 maturities have seen values compress, which pushes LTV higher and makes refinancing more difficult.<br><br>Our ClearPath matching can connect you with lenders who work within your LTV range. Free, 60 seconds.'
    },
    {
      keywords: ['cap rate', 'capitalization rate'],
      answer: '<strong>Cap Rate (Capitalization Rate)</strong><br><br><ul><li><strong>Formula:</strong> Net Operating Income / Property Value</li><li>Measures the unlevered return on a property investment</li><li>Lower cap rate = higher value relative to income (more expensive market)</li><li>Varies significantly by property type, location, and quality</li></ul><br>Cap rates are an important metric for property valuation. Lenders use cap rates alongside DSCR, LTV, and debt yield to size loans and assess risk.<br><br>Have questions about how cap rates affect your financing options? Our ClearPath matching can connect you with the right lender in 60 seconds.'
    },
    {
      keywords: ['noi', 'net operating income', 'operating income'],
      answer: '<strong>NOI (Net Operating Income)</strong><br><br><ul><li>Revenue minus operating expenses (excluding debt service, depreciation, and capital expenditures)</li><li>The foundation for property valuation and loan sizing</li><li>Lenders prefer T12 (trailing 12 months) actuals over pro forma projections</li><li>NOI drives DSCR, debt yield, and property valuation</li></ul><br><strong>What is included in operating expenses:</strong> property management, insurance, taxes, utilities, maintenance, and repairs.<br><br><strong>What is excluded:</strong> debt service (mortgage payments), depreciation, capital expenditures, and income taxes.<br><br>Understanding your NOI is the first step in evaluating your financing options.'
    },
    {
      keywords: ['amortization', 'balloon', 'term length', 'loan term'],
      answer: '<strong>Amortization vs. Term</strong><br><br><ul><li><strong>Amortization:</strong> the repayment schedule, usually 25 to 30 years</li><li><strong>Term:</strong> the actual loan duration, typically 5 to 10 years for commercial</li><li>At the end of the term, the remaining balance is due as a <strong>balloon payment</strong></li><li>Fully amortizing loans (like HUD) have no balloon</li></ul><br>This mismatch between amortization and term is why the maturity wall exists. Borrowers must refinance or pay off the balloon when the term expires, even though the loan was not fully repaid.<br><br>Need help planning for a balloon payment? Our ClearPath matching can connect you with refinance options in 60 seconds.'
    },
    {
      keywords: ['recourse', 'non-recourse', 'personal guarantee', 'guaranty', 'bad boy'],
      answer: '<strong>Recourse vs. Non-Recourse Loans</strong><br><br><ul><li><strong>Recourse:</strong> borrower personally liable for the full loan balance</li><li><strong>Non-recourse:</strong> lender\'s remedy limited to the property (with carve-out exceptions)</li><li>CMBS, agency (Fannie/Freddie), and HUD loans are typically non-recourse</li><li>Bank loans are usually recourse</li></ul><br><strong>Bad Boy Carve-Outs:</strong> Exceptions to non-recourse that trigger personal liability. Common triggers include fraud, misrepresentation, environmental contamination, voluntary bankruptcy filing, and misapplication of rents or insurance proceeds.<br><br>Non-recourse protection is a major consideration for many borrowers. Our ClearPath matching can identify non-recourse options for your deal.'
    },
    {
      keywords: ['prepayment', 'yield maintenance', 'defeasance', 'step-down', 'penalty'],
      answer: '<strong>Prepayment Penalties in Commercial Lending</strong><br><br>Three common types:<br><br><ul><li><strong>Yield Maintenance:</strong> Make-whole penalty ensuring the lender receives the same yield as if the loan ran to maturity. Usually the most expensive option.</li><li><strong>Defeasance:</strong> Borrower purchases government securities that replicate remaining loan payments. Common in CMBS. Property is released from the lien.</li><li><strong>Step-Down:</strong> Declining percentage over time (e.g., 5%, 4%, 3%, 2%, 1%). Most borrower-friendly option.</li></ul><br>Understanding your prepayment terms is critical before refinancing. Some loans have a lockout period where no prepayment is allowed at all.<br><br>Need help evaluating your options? ClearPath matching takes 60 seconds.'
    },
    {
      keywords: ['underwriting', 'application', 'process', 'how long', 'timeline', 'how does lending'],
      answer: '<strong>Commercial Loan Process and Timeline</strong><br><br><strong>Steps:</strong><ol><li>Pre-qualification: initial conversation about your deal</li><li>Term Sheet / Letter of Intent from lender</li><li>Formal Application with full documentation</li><li>Underwriting: lender analyzes property, borrower, and market</li><li>Approval and Commitment</li><li>Closing: legal documents executed, funds disbursed</li></ol><br><strong>Typical timelines:</strong><ul><li>Bridge Loans: 2 to 4 weeks</li><li>Bank Loans: 30 to 60 days</li><li>CMBS: 45 to 90 days</li><li>Agency (Fannie/Freddie): 45 to 60 days</li><li>HUD/FHA: 90 to 180 days</li></ul><br>Want to get started? Our ClearPath matching can connect you with the right lender in 60 seconds.'
    },
    {
      keywords: ['appraisal', 'valuation', 'property value'],
      answer: '<strong>Commercial Property Appraisal</strong><br><br><ul><li>Required for virtually all commercial loans</li><li>Three approaches: Income (most common for investment property), Sales Comparison, and Cost</li><li>Ordered by the lender, paid by the borrower</li><li>Must be performed by a licensed MAI appraiser for most commercial transactions</li></ul><br>The income approach is most critical for investment properties. It uses the property\'s Net Operating Income and market cap rates to determine value. Appraisal results directly affect your LTV and the loan amount you can qualify for.'
    },
    {
      keywords: ['phase i', 'environmental', 'esa', 'contamination', 'phase 1'],
      answer: '<strong>Phase I Environmental Site Assessment (ESA)</strong><br><br><ul><li>Standard requirement for commercial real estate loans</li><li>Identifies potential environmental contamination risks</li><li>Includes site inspection, historical records review, and interviews</li><li>If concerns are found, a Phase II (soil and water testing) may be required</li><li>Lender will not close without satisfactory environmental clearance</li></ul><br>Phase I ESAs are especially important for gas stations, industrial properties, dry cleaners, and any property with a history of chemical use. The assessment protects both the lender and the borrower from unknown environmental liability.'
    },
    {
      keywords: ['document', 'paperwork', 'what do i need', 'what do you need', 'required doc'],
      answer: '<strong>Documents Typically Required for a Commercial Loan</strong><br><br><ul><li>Personal Financial Statement (PFS)</li><li>Tax returns (2 to 3 years, personal and business)</li><li>Rent roll (current and historical)</li><li>Operating statements / T12 (trailing 12 months)</li><li>Property photos and description</li><li>Business plan or executive summary</li><li>Entity documents (operating agreement, articles of organization)</li><li>Schedule of real estate owned</li></ul><br>Having these documents organized in advance significantly speeds up the process. Your lender match through ClearPath can tell you exactly what they need for your specific loan type.'
    },
    {
      keywords: ['credit score', 'credit requirement', 'credit rating', 'fico'],
      answer: '<strong>Credit Score Requirements for Commercial Loans</strong><br><br><ul><li>Most commercial lenders: 660+ minimum</li><li>SBA loans: typically 680+ preferred</li><li>Hard money and private credit: more flexible, may accept 600+</li><li>Strong deal fundamentals can sometimes offset lower credit scores</li></ul><br>Credit is just one factor in commercial lending. Lenders also weigh property cash flow, experience, net worth, and the overall deal structure.<br><br>Not sure where you qualify? Our free ClearPath matching evaluates your full profile and connects you with the right lender in 60 seconds. No credit pull required for matching.'
    },
    {
      keywords: ['loan type', 'types of loan', 'what loan', 'which loan', 'commercial loan', 'options', 'what kind', 'what are'],
      answer: '<strong>Commercial Loan Types We Match</strong><br><br><ul><li><strong>SBA 7(a):</strong> Up to $5M, flexible use</li><li><strong>SBA 504:</strong> Fixed-rate, owner-occupied real estate</li><li><strong>Bridge Loans:</strong> Short-term, quick close</li><li><strong>Hard Money:</strong> Asset-based, fast closing</li><li><strong>CMBS:</strong> Non-recourse, stabilized properties</li><li><strong>Construction:</strong> Ground-up or renovation</li><li><strong>Mezzanine Debt:</strong> Gap financing</li><li><strong>Preferred Equity:</strong> Leverage without debt</li><li><strong>Private Credit:</strong> Flexible, non-bank</li><li><strong>Fannie Mae / Freddie Mac:</strong> Agency multifamily</li><li><strong>HUD/FHA:</strong> Lowest rates, longest terms (multifamily)</li><li><strong>USDA B&I:</strong> Rural commercial, up to $25M</li><li><strong>Portfolio Loans:</strong> Flexible bank-held</li><li><strong>Equipment Financing:</strong> Business equipment purchases</li></ul><br>Not sure which is right for you? Our free ClearPath matching evaluates your situation and connects you with the right lender in 60 seconds.'
    },
    {
      keywords: ['rate', 'interest', 'percent', 'apr', 'how much', 'cost', 'pricing'],
      answer: 'Great question. Rates vary based on many factors including your credit profile, property type, LTV, DSCR, and current market conditions. I\'m not able to quote specific rates as they change frequently and depend on your unique situation.<br><br>What I can tell you is that different loan types have very different rate structures:<ul><li><strong>SBA 504:</strong> Fixed rate on the CDC portion (typically the lowest for owner-occupied)</li><li><strong>HUD/FHA:</strong> Lowest rates for multifamily</li><li><strong>CMBS:</strong> Competitive fixed rates for stabilized properties</li><li><strong>Bridge and Hard Money:</strong> Higher rates but faster execution</li></ul><br>The best way to get accurate rate information is through our <strong>free ClearPath matching</strong> system. It connects you with lenders who specialize in your exact scenario. Takes about 60 seconds, no credit pull.'
    },
    {
      keywords: ['clearpath', 'matching', 'how does it work', 'how it work', 'your service', 'your process', 'how do you', 'how does your'],
      answer: '<strong>How ClearPath Matching Works</strong><br><br>Our proprietary ClearPath system evaluates your loan type, asset class, credit profile, and timeline, then connects you with the best lender from our network of hundreds of relationships.<br><br><strong>The process:</strong><ol><li>Answer 7 quick questions (about 60 seconds)</li><li>ClearPath searches hundreds of lender relationships</li><li>We present your best matching options</li><li>You connect directly with matched lenders</li><li>No obligation; move forward only when you\'re ready</li></ol><br><strong>Key facts:</strong><ul><li>Licensed in all 50 states</li><li>No minimum loan size</li><li>$0 cost to use</li><li>No credit pull required</li><li>Lender-agnostic: we work for the borrower</li></ul><br>Ready to find your match? It only takes 60 seconds.'
    },
    {
      keywords: ['who', 'about', 'company', 'what is commercial loan help'],
      answer: '<strong>About Commercial Loan Help</strong><br><br>We are a commercial loan marketplace and advisory service, <strong>not a lender</strong>. Our proprietary ClearPath matching system connects borrowers with the best lender from our network of hundreds of established relationships.<br><br><strong>Key facts:</strong><ul><li>Licensed in all 50 states</li><li>No minimum loan size</li><li>$0 cost to use the matching service</li><li>No credit pull required</li><li>Lender-agnostic: we work for the borrower</li><li>SBA lenders, bridge lenders, CMBS conduits, private credit funds, and more</li></ul><br>Ready to find your match? ClearPath takes just 60 seconds.'
    },
    {
      keywords: ['multifamily', 'apartment', 'residential rental'],
      answer: '<strong>Multifamily / Apartment Financing</strong><br><br>Multifamily is the strongest asset class for lender appetite, with the most financing options available.<br><br><strong>Loan options include:</strong><ul><li><strong>Fannie Mae DUS:</strong> Non-recourse, competitive rates, 5 to 15 year terms</li><li><strong>Freddie Mac Optigo:</strong> SBL program for $1 to $7.5M</li><li><strong>HUD 223(f):</strong> 35-year fully amortizing, lowest rates</li><li><strong>HUD 221(d)(4):</strong> New construction, 40-year term</li><li><strong>CMBS:</strong> Non-recourse for larger stabilized properties</li><li><strong>Bridge:</strong> For value-add or repositioning</li><li><strong>Bank:</strong> Relationship lending, flexible terms</li></ul><br>DSCR requirements: typically 1.20 to 1.25x. LTV: up to 80% agency, 85% HUD.<br><br>Our ClearPath matching can connect you with the right multifamily lender. Free, 60 seconds, no credit pull.'
    },
    {
      keywords: ['office', 'office building', 'office space'],
      answer: '<strong>Office Building Financing</strong><br><br>The office sector faces challenges following the remote work shift, but financing is still available for the right properties.<br><br><strong>Key considerations:</strong><ul><li>Lenders are cautious; expect lower LTV (60 to 65%) and higher DSCR requirements</li><li>Suburban and medical office performing better than urban CBD</li><li>Class A properties with strong tenants still financeable</li><li>Class B and C facing significant headwinds and value declines of 20 to 40%</li><li>Long-term leases with creditworthy tenants are critical</li></ul><br>For office properties, having strong occupancy, quality tenants, and long lease terms is more important than ever.<br><br>Our ClearPath matching can connect you with lenders experienced in office financing. Try it free in 60 seconds.'
    },
    {
      keywords: ['retail', 'shopping', 'strip center', 'strip mall', 'storefront'],
      answer: '<strong>Retail Property Financing</strong><br><br><ul><li>Recovery underway; anchored centers and necessity-based retail performing well</li><li>High-street and experiential retail gaining lender interest</li><li>Single-tenant net lease (NNN) popular with lenders due to credit tenants</li><li>Unanchored strip centers face more scrutiny</li><li>Grocery-anchored centers remain a lender favorite</li></ul><br>Lenders focus on tenant mix, lease terms, anchor tenants, and foot traffic when underwriting retail. Properties with strong anchors and long-term leases are well-positioned for financing.<br><br>Our ClearPath matching can connect you with retail property lenders in 60 seconds.'
    },
    {
      keywords: ['industrial', 'warehouse', 'logistics', 'distribution'],
      answer: '<strong>Industrial / Warehouse Financing</strong><br><br><ul><li>Lender favorite due to strong fundamentals</li><li>E-commerce, nearshoring, and supply chain reconfiguration driving demand</li><li>Lower vacancy rates nationally</li><li>Competitive terms available; LTV up to 75%</li><li>Data center demand adding a new growth driver</li></ul><br>Industrial is one of the strongest commercial real estate sectors, with most lenders eager to finance quality industrial assets. Competitive terms are available across bank, CMBS, and agency (for some industrial) platforms.<br><br>Our ClearPath matching can connect you with industrial lenders in 60 seconds.'
    },
    {
      keywords: ['hospitality', 'hotel', 'motel', 'lodging', 'resort'],
      answer: '<strong>Hospitality / Hotel Financing</strong><br><br><ul><li>Specialized lenders required; understanding of RevPAR, ADR, and occupancy is critical</li><li>Flagged (branded) properties generally easier to finance than independent</li><li>SBA 504 popular for owner-operated hotels</li><li>Bridge loans common for repositioning or renovation</li><li>Seasonal cash flow requires careful underwriting</li></ul><br>RevPAR recovery is continuing in 2026. Business travel is normalizing and leisure demand remains stable. Hotels with strong brands, good locations, and consistent performance have solid financing options.<br><br>Our network includes lenders who specialize specifically in hospitality. Try our free ClearPath matching to find the right fit in 60 seconds.'
    },
    {
      keywords: ['self-storage', 'self storage', 'storage facility'],
      answer: '<strong>Self-Storage Financing</strong><br><br><ul><li>Growing asset class with attractive cash flow characteristics</li><li>Relatively recession-resistant</li><li>SBA and conventional financing available</li><li>Self-service model reduces operating complexity</li><li>Strong investor interest driving development and acquisition activity</li></ul><br>Self-storage benefits from a diversified tenant base and low operating costs. Lenders view it favorably, and competitive terms are available for stabilized facilities.<br><br>Our ClearPath matching can connect you with self-storage lenders. Free, 60 seconds.'
    },
    {
      keywords: ['medical', 'healthcare', 'dental', 'doctor', 'clinic'],
      answer: '<strong>Medical Office and Healthcare Financing</strong><br><br><ul><li>Recession-resistant tenancy with stable, long-term leases</li><li>Specialized build-out requirements may affect valuation</li><li>Lender favorable due to tenant quality and lease stability</li><li>Practice financing (business) differs from real estate financing</li></ul><br>For <strong>dental and medical practices:</strong> SBA 7(a) and 504 loans are popular for acquisition and expansion. Practice financing covers equipment, buildout, and working capital in addition to real estate.<br><br>Our ClearPath matching can connect you with healthcare-specialized lenders in 60 seconds.'
    },
    {
      keywords: ['senior', 'assisted living', 'nursing', 'memory care', 'skilled nursing'],
      answer: '<strong>Senior Housing / Assisted Living Financing</strong><br><br><ul><li><strong>HUD 232:</strong> Excellent terms for qualified operators (fully non-recourse, long-term, low rates)</li><li>Operating complexity increases underwriting scrutiny</li><li>Experienced operators have significant financing advantages</li><li>Growing demand driven by aging demographics</li><li>Includes assisted living, skilled nursing, memory care, and board and care</li></ul><br>HUD 232 is the gold standard for senior housing financing, but it requires experienced operators and a lengthy application process. Bridge and conventional options are also available for the right deals.<br><br>Our ClearPath matching can connect you with senior housing lenders in 60 seconds.'
    },
    {
      keywords: ['gas station', 'c-store', 'convenience store', 'fuel', 'petroleum'],
      answer: '<strong>Gas Station / Convenience Store Financing</strong><br><br><ul><li>SBA loans popular (both 7(a) and 504)</li><li>Environmental concerns require Phase I and often Phase II ESA</li><li>Underground storage tank compliance is critical</li><li>Specialized underwriting based on fuel volume and store revenue</li><li>Branded stations generally easier to finance</li></ul><br>Gas station financing has unique considerations around environmental liability. Lenders want to see clean environmental reports, strong fuel and convenience store sales, and proper tank compliance.<br><br>Our ClearPath matching includes lenders who specialize in gas station and C-store financing. Try it free in 60 seconds.'
    },
    {
      keywords: ['restaurant', 'food service', 'dining', 'eatery'],
      answer: '<strong>Restaurant Property Financing</strong><br><br><ul><li>Higher perceived risk due to restaurant failure rates</li><li>Owner-occupied SBA loans are the most common path</li><li>Lenders prefer franchise or flag concepts over independent</li><li>Strong personal guarantee typically required</li><li>Track record and experience in the restaurant industry matter</li></ul><br>For restaurant owners, SBA 7(a) and 504 loans offer the most accessible financing. A strong business plan, proven concept, and management experience are critical for approval.<br><br>Our ClearPath matching can connect you with lenders experienced in restaurant financing in 60 seconds.'
    },
    {
      keywords: ['car wash', 'carwash', 'auto wash'],
      answer: '<strong>Car Wash Financing</strong><br><br><ul><li>Growing investor interest in the car wash sector</li><li>SBA loans (7(a) and 504) are popular for owner-operated car washes</li><li>Conventional financing available for stabilized operations</li><li>Lenders evaluate water reclamation systems, equipment condition, and location</li><li>Express tunnel washes with subscription models are particularly attractive to lenders</li></ul><br>The car wash industry has seen significant consolidation and investor interest. Both new construction and acquisition financing are available.<br><br>Our ClearPath matching can connect you with car wash lenders. Free, 60 seconds.'
    },
    {
      keywords: ['first time', 'new to', 'beginner', 'never bought', 'first deal', 'getting started'],
      answer: '<strong>First-Time Commercial Real Estate Borrower</strong><br><br>Welcome! Here are some tips for getting started:<br><br><ul><li><strong>Start with SBA or local bank loans:</strong> These are the most accessible for first-time borrowers</li><li><strong>Owner-occupied is easier:</strong> Properties where you operate your business are simpler to finance</li><li><strong>Build a strong application:</strong> Personal financial statement, tax returns, and a solid business plan are critical</li><li><strong>Consider a smaller deal first:</strong> Build a track record before scaling up</li><li><strong>Credit score matters:</strong> Most lenders want 660+, SBA typically 680+</li></ul><br>Do not be intimidated by the process. Many successful commercial real estate investors started exactly where you are.<br><br>Our free ClearPath matching can help you find a lender who works with first-time borrowers. It takes just 60 seconds and requires no credit pull.'
    },
    {
      keywords: ['1031', 'exchange', 'tax defer', 'like-kind'],
      answer: '<strong>1031 Exchange Financing</strong><br><br><ul><li>Must identify replacement property within <strong>45 days</strong> of sale</li><li>Must close replacement property within <strong>180 days</strong></li><li>Debt on replacement must be equal to or greater than debt on relinquished property</li><li>Qualified Intermediary required to hold funds</li><li>Pre-approval and fast closing capability are critical</li></ul><br>The tight timelines make it essential to have financing lined up before or immediately after selling your relinquished property. Bridge loans can provide fast closing for 1031 exchange acquisitions.<br><br>Our ClearPath matching can quickly connect you with lenders experienced in 1031 exchange transactions. Try it free in 60 seconds.'
    },
    {
      keywords: ['partner buyout', 'buy out partner', 'partner exit'],
      answer: '<strong>Partner Buyout Financing</strong><br><br><ul><li>SBA 7(a) loans can finance partner buyouts</li><li>A valuation of the business and/or property is required</li><li>May need a combination of debt sources</li><li>Operating agreement buy-sell provisions matter for structuring</li><li>The buyout must make financial sense (DSCR must support the new debt)</li></ul><br>Partner buyouts can be complex, involving both business valuation and real estate financing. Having the right lender who understands these transactions is important.<br><br>Our ClearPath matching can connect you with lenders experienced in partner buyout financing. Free, 60 seconds.'
    },
    {
      keywords: ['cash out', 'cash-out', 'equity', 'pull equity', 'access equity'],
      answer: '<strong>Cash-Out Refinance</strong><br><br><ul><li>Access equity in a stabilized, cash-flowing property</li><li>Typically limited to 70 to 75% LTV for commercial cash-out</li><li>Proceeds can be used for any purpose: new acquisitions, capital improvements, debt repayment</li><li>Property must demonstrate strong DSCR at the higher loan amount</li></ul><br>Cash-out refinancing is a popular strategy for investors looking to recycle capital from stabilized properties into new acquisitions or improvements.<br><br>Our ClearPath matching can help you find the right lender for your cash-out refinance in 60 seconds.'
    },
    {
      keywords: ['value add', 'value-add', 'repositioning', 'renovation', 'rehab'],
      answer: '<strong>Value-Add / Repositioning Financing</strong><br><br><ul><li><strong>Bridge loan</strong> for acquisition plus renovation capital</li><li>Business plan should detail renovation scope, budget, and projected stabilized value</li><li>Refinance to permanent financing once property is stabilized</li><li>Lenders focus on sponsor experience and feasibility of the value-add plan</li><li>LTC (Loan-to-Cost) typically 75 to 85%</li></ul><br>The typical strategy is: acquire with bridge financing, complete renovations, stabilize the property (increase occupancy and rents), then refinance into a long-term permanent loan at the improved value.<br><br>Our ClearPath matching can connect you with bridge lenders experienced in value-add deals. Try it free in 60 seconds.'
    },
    {
      keywords: ['investor', 'invest', 'marketplace', 'return', 'yield'],
      answer: '<strong>For Investors</strong><br><br>Commercial Loan Help operates as a marketplace connecting borrowers with our network of lender relationships. We are lender-agnostic and work for the borrower, not any single bank.<br><br>Our ClearPath matching system has relationships with hundreds of lenders, including SBA lenders, bridge lenders, CMBS conduits, private credit funds, agency lenders, and more.<br><br>For more information about our business model and marketplace approach, visit our <strong>Investors</strong> page or reach out directly.<br><br>If you are a borrower looking for financing, our free ClearPath matching takes just 60 seconds.'
    },
    {
      keywords: ['mixed-use', 'mixed use', 'live work'],
      answer: '<strong>Mixed-Use Property Financing</strong><br><br><ul><li>Treated as most restrictive use by lenders (e.g., if 40% retail and 60% residential, may be underwritten as retail)</li><li>Residential component generally helps with financing</li><li>SBA available if owner-occupied commercial portion qualifies</li><li>Bank and CMBS options for larger stabilized mixed-use</li></ul><br>Mixed-use properties can be more complex to finance because lenders must evaluate multiple income streams. The key is demonstrating stable cash flow across all uses.<br><br>Our ClearPath matching can connect you with lenders experienced in mixed-use financing in 60 seconds.'
    },
    {
      keywords: ['student housing', 'student apartment', 'university housing'],
      answer: '<strong>Student Housing Financing</strong><br><br><ul><li>University proximity is the most critical factor</li><li>Seasonal cash flow with lease-up periods each year</li><li>Purpose-built student housing is preferred by lenders over converted properties</li><li>Fannie Mae and Freddie Mac have student housing programs</li><li>Bridge financing available for repositioning or lease-up</li></ul><br>Strong enrollment trends at the nearby university, bed-to-enrollment ratios, and proximity to campus are the key factors lenders evaluate.<br><br>Our ClearPath matching can connect you with student housing lenders in 60 seconds.'
    },
    {
      keywords: ['manufactured', 'mobile home', 'mhc', 'trailer park'],
      answer: '<strong>Manufactured Housing Community Financing</strong><br><br><ul><li>Fannie Mae and Freddie Mac programs available for MHCs</li><li>Stable returns with low turnover</li><li>Land-lease model (tenants own homes, community owns land) preferred by lenders</li><li>Growing institutional investor interest</li></ul><br>Manufactured housing communities benefit from affordable housing demand and high tenant retention. Agency financing (Fannie/Freddie) offers competitive non-recourse terms.<br><br>Our ClearPath matching can help you find MHC-experienced lenders in 60 seconds.'
    },
    {
      keywords: ['sofr', 'libor', 'benchmark', 'index rate', 'floating rate', 'variable rate'],
      answer: '<strong>SOFR and Interest Rate Benchmarks</strong><br><br><ul><li><strong>SOFR</strong> (Secured Overnight Financing Rate) replaced LIBOR as the benchmark for floating-rate commercial loans</li><li>Based on overnight repurchase agreement transactions</li><li>Floating rate loans are typically priced as SOFR plus a spread</li></ul><br><strong>Fixed vs. Floating:</strong><ul><li><strong>Fixed:</strong> Rate certainty, protection from rising rates, may have yield maintenance or defeasance prepayment</li><li><strong>Floating:</strong> Lower initial rate, risk of rate increases, typically easier prepayment</li></ul><br>Choose fixed for stability and long-term hold. Choose floating for short-term hold or if you expect rates to decline.'
    },
    {
      keywords: ['capital stack', 'senior debt', 'equity structure', 'leverage'],
      answer: '<strong>The Capital Stack</strong><br><br>From top (lowest risk, first repaid) to bottom (highest risk, last repaid):<br><br><ol><li><strong>Senior Debt</strong> (first mortgage): 50 to 75% of value</li><li><strong>Mezzanine Debt:</strong> 75 to 85% of value</li><li><strong>Preferred Equity:</strong> 85 to 90% of value</li><li><strong>Common Equity:</strong> remaining capital from sponsors and investors</li></ol><br>Understanding the capital stack helps you evaluate how to structure your deal. Each layer has different risk, return, and cost characteristics. In 2026, creative capital stack solutions are critical for many deals where senior debt alone falls short.<br><br>Our ClearPath matching can help you find lenders and capital providers across the entire stack.'
    },
    {
      keywords: ['ltc', 'loan to cost', 'loan-to-cost'],
      answer: '<strong>LTC (Loan-to-Cost Ratio)</strong><br><br><ul><li><strong>Formula:</strong> Loan Amount / Total Project Cost</li><li>Used primarily for construction and value-add deals</li><li>Typical maximum: 75 to 85%</li><li>Includes acquisition cost, construction costs, and soft costs</li></ul><br>LTC is the key sizing metric for construction loans and value-add bridge loans. Unlike LTV (which uses appraised value), LTC is based on your actual total project cost. Lenders want to see that you have enough equity in the deal relative to total cost.'
    },
    {
      keywords: ['debt yield', 'dy '],
      answer: '<strong>Debt Yield</strong><br><br><ul><li><strong>Formula:</strong> NOI / Loan Amount</li><li>Minimum usually 8 to 10% depending on property type</li><li>Increasingly used alongside DSCR and LTV as a loan sizing constraint</li><li>Measures the lender\'s return independent of interest rate and amortization</li></ul><br>Debt yield has become more important in 2026 because it removes interest rate assumptions from the equation. A higher debt yield gives the lender more comfort that the property generates sufficient income relative to the loan amount.'
    },
    {
      keywords: ['entity', 'llc', 'spe', 'structure', 'corporation'],
      answer: '<strong>Entity Structure for Commercial Real Estate</strong><br><br><ul><li><strong>LLC</strong> is the most common structure for CRE ownership</li><li><strong>Single-Purpose Entity (SPE)</strong> required for CMBS loans</li><li>Protects personal assets and provides liability separation</li><li>Operating agreement should match loan requirements</li><li>Most lenders require borrowing through an entity, not personally</li></ul><br>Setting up the right entity structure before approaching lenders is important. Consult with your attorney and CPA to determine the best structure for your situation.'
    },
    {
      keywords: ['permanent loan', 'long-term loan', 'stabilized', 'long term financing'],
      answer: '<strong>Permanent / Long-Term Commercial Loans</strong><br><br><ul><li>For stabilized, cash-flowing commercial properties</li><li>Fixed or variable rates available</li><li>Terms: 5 to 30 years depending on lender type</li><li>Amortization: 20 to 30 years typical</li><li>Sources: banks, life companies, CMBS, agency (Fannie/Freddie for multifamily)</li></ul><br>Permanent loans are the end goal for most commercial real estate transactions. They offer the lowest cost of capital for stabilized properties with proven cash flow.<br><br>Our ClearPath matching can connect you with permanent lenders in 60 seconds.'
    },
    {
      keywords: ['portfolio loan', 'bank portfolio', 'held on book'],
      answer: '<strong>Portfolio Loans</strong><br><br><ul><li>Held by originating bank (not sold on secondary market)</li><li>More flexible underwriting and terms</li><li>May accept non-standard properties or borrower situations</li><li>Terms negotiable; the bank has full discretion</li></ul><br>Portfolio loans are ideal for unique situations that do not fit into agency, CMBS, or standard lending programs. Community banks and regional banks are the primary sources. The relationship with your banker matters more with portfolio lending than any other loan type.'
    },
    {
      keywords: ['equipment', 'machinery', 'vehicle financing'],
      answer: '<strong>Equipment Financing</strong><br><br><ul><li>For purchase of business equipment, machinery, vehicles, or technology</li><li>Equipment serves as collateral</li><li>Terms match useful life of equipment (3 to 10 years typical)</li><li>Up to 100% financing available</li><li>SBA 7(a) and 504 can also be used for equipment</li></ul><br>Equipment financing is straightforward because the equipment itself secures the loan. Many lenders offer dedicated equipment financing programs with fast approval.'
    },
    {
      keywords: ['land loan', 'land acquisition', 'raw land', 'vacant land'],
      answer: '<strong>Land Loans</strong><br><br><ul><li>For acquisition of commercial or development land</li><li>Higher down payment required: typically 30 to 50%</li><li>Shorter terms: 1 to 5 years</li><li>Higher rates than improved property loans</li></ul><br>Land is considered the riskiest type of commercial real estate collateral because it generates no income. Most borrowers acquire land with the intention of developing it and refinancing into a construction loan. Having entitlements and a clear development plan strengthens your application.'
    },
    {
      keywords: ['line of credit', 'revolving', 'working capital'],
      answer: '<strong>Business Lines of Credit</strong><br><br><ul><li>Revolving credit facility: draw as needed</li><li>Pay interest only on the outstanding balance</li><li>Annual renewal typical</li><li>Secured or unsecured options available</li></ul><br>Lines of credit are best for working capital, inventory, seasonal needs, and operating expenses. They provide flexibility to access capital when you need it without taking on a term loan for the full amount.'
    },
    {
      keywords: ['market', 'economy', 'outlook', '2026 market', 'current market'],
      answer: '<strong>2026 Commercial Lending Market Overview</strong><br><br><ul><li><strong>Bank lending:</strong> Regional banks reducing CRE exposure due to regulatory pressure. Tighter underwriting standards.</li><li><strong>Private credit:</strong> Debt funds have $200B+ in dry powder, filling the gap left by banks.</li><li><strong>CMBS market:</strong> Recovery underway after the 2023 to 2024 slowdown.</li><li><strong>Multifamily:</strong> Fundamentals normalizing. Rent growth moderating but long-term demand strong.</li><li><strong>Office:</strong> Bifurcation between Class A (performing) and B/C (struggling).</li><li><strong>Industrial:</strong> Continued strength driven by e-commerce and nearshoring.</li><li><strong>Retail:</strong> Selective recovery. Grocery-anchored performing well.</li></ul><br>Despite headwinds, capital is available for well-structured deals. Our ClearPath matching can connect you with active lenders in 60 seconds.'
    }
  ];

  var DEFAULT_ANSWER = 'That\'s a great question! While I may not have specific details on that topic, here are the main areas I can help with:<br><br><ul><li><strong>Commercial loan types:</strong> SBA, bridge, CMBS, mezzanine, construction, HUD, agency, and more</li><li><strong>The 2026 maturity wall:</strong> Understanding your refinancing options</li><li><strong>Property-specific financing:</strong> Multifamily, office, retail, industrial, hospitality, and others</li><li><strong>Key metrics:</strong> DSCR, LTV, cap rate, NOI, and debt yield</li><li><strong>The lending process:</strong> Applications, documents, timelines, and credit requirements</li><li><strong>ClearPath matching:</strong> Our free service to find the right lender</li></ul><br>You can also try our free <strong>ClearPath matching</strong> system to connect directly with a lender who specializes in your situation. It only takes 60 seconds and requires no credit pull.<br><br>Try asking about any of these topics!';

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
    win.innerHTML = '<div class="clh-chat-header"><div class="clh-chat-header-title">Commercial Loan Help</div><div class="clh-chat-header-sub">AI-Powered Lending Assistant</div><div class="clh-chat-header-status"><span class="clh-chat-header-dot"></span>Online</div></div><div class="clh-chat-messages" id="clh-chat-messages"></div><div class="clh-chat-input-area"><textarea class="clh-chat-input" id="clh-chat-input" placeholder="Ask about commercial loans..." rows="1" maxlength="500"></textarea><button class="clh-chat-send" id="clh-chat-send" aria-label="Send message"><svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></div><div class="clh-chat-disclaimer">AI assistant for educational purposes only. Not a loan officer. No rate guarantees.</div>';

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

  // ---- Append CTA button if response mentions ClearPath ----
  function maybeAppendCTA(parentEl, html) {
    if (html.indexOf('ClearPath') !== -1 || html.indexOf('60 seconds') !== -1) {
      var cta = document.createElement('a');
      cta.className = 'clh-msg-cta';
      cta.href = 'match.html';
      cta.textContent = 'Start Free Matching \u2192';
      parentEl.appendChild(cta);
    }
  }

  // ---- Show fallback response with typing delay ----
  function showFallbackResponse(text, container, input, sendBtn) {
    var responseHTML = findResponse(text);
    var delay = 600 + Math.random() * 600;

    setTimeout(function() {
      var dots = document.getElementById('clh-typing');
      if (dots) dots.remove();

      var assistEl = document.createElement('div');
      assistEl.className = 'clh-msg clh-msg-assistant';
      assistEl.innerHTML = responseHTML;
      maybeAppendCTA(assistEl, responseHTML);
      container.appendChild(assistEl);
      scrollToBottom();

      messages.push({ role: 'user', content: text });
      messages.push({ role: 'assistant', content: responseHTML });

      isResponding = false;
      sendBtn.disabled = false;
      input.focus();
    }, delay);
  }

  // ---- Attempt AI response via SSE, fall back to keywords on failure ----
  function getAIResponse(text, container, input, sendBtn) {
    var controller = new AbortController();
    var timeoutId = setTimeout(function() { controller.abort(); }, 12000);
    var assistEl = null;
    var fullText = '';
    var streamStarted = false;

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messages.concat([{ role: 'user', content: text }]) }),
      signal: controller.signal
    })
    .then(function(response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      if (!response.body) throw new Error('No response body');

      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';

      function processStream() {
        return reader.read().then(function(result) {
          if (result.done) {
            clearTimeout(timeoutId);
            if (!streamStarted || !fullText.trim()) {
              throw new Error('Empty response');
            }
            // Stream complete: finalize
            maybeAppendCTA(assistEl, fullText);
            messages.push({ role: 'user', content: text });
            messages.push({ role: 'assistant', content: fullText });
            isResponding = false;
            sendBtn.disabled = false;
            input.focus();
            return;
          }

          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line.indexOf('data: ') !== 0) continue;
            var jsonStr = line.substring(6);
            try {
              var data = JSON.parse(jsonStr);
              if (data.error) throw new Error(data.error);
              if (data.done) {
                clearTimeout(timeoutId);
                if (!streamStarted || !fullText.trim()) {
                  throw new Error('Empty response');
                }
                maybeAppendCTA(assistEl, fullText);
                messages.push({ role: 'user', content: text });
                messages.push({ role: 'assistant', content: fullText });
                isResponding = false;
                sendBtn.disabled = false;
                input.focus();
                return;
              }
              if (data.text) {
                if (!streamStarted) {
                  streamStarted = true;
                  var dots = document.getElementById('clh-typing');
                  if (dots) dots.remove();
                  assistEl = document.createElement('div');
                  assistEl.className = 'clh-msg clh-msg-assistant';
                  container.appendChild(assistEl);
                }
                fullText += data.text;
                assistEl.innerHTML = formatMarkdown(fullText);
                scrollToBottom();
              }
            } catch (parseErr) {
              if (parseErr.message !== 'Empty response') {
                // Skip unparseable lines, continue stream
              } else {
                throw parseErr;
              }
            }
          }

          return processStream();
        });
      }

      return processStream();
    })
    .catch(function() {
      // Any failure: clean up partial AI response if any, fall back to keywords
      clearTimeout(timeoutId);
      if (assistEl && assistEl.parentNode) {
        assistEl.parentNode.removeChild(assistEl);
      }
      showFallbackResponse(text, container, input, sendBtn);
    });
  }

  // ---- Simple markdown-to-HTML formatter for AI responses ----
  function formatMarkdown(text) {
    var html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Bullet lists: consecutive lines starting with - or *
    html = html.replace(/((?:^|\n)[*\-] .+(?:\n[*\-] .+)*)/g, function(match) {
      var items = match.trim().split('\n').map(function(line) {
        return '<li>' + line.replace(/^[*\-] /, '') + '</li>';
      }).join('');
      return '<ul>' + items + '</ul>';
    });

    // Numbered lists: consecutive lines starting with digits.
    html = html.replace(/((?:^|\n)\d+\. .+(?:\n\d+\. .+)*)/g, function(match) {
      var items = match.trim().split('\n').map(function(line) {
        return '<li>' + line.replace(/^\d+\. /, '') + '</li>';
      }).join('');
      return '<ol>' + items + '</ol>';
    });

    // Paragraphs
    html = html.replace(/\n\n/g, '<br><br>');
    html = html.replace(/\n/g, '<br>');

    return html;
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

    // Try AI first, fall back to keywords on any failure
    getAIResponse(text, container, input, sendBtn);
  }

  // ---- Initialize ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }

})();
