// Firmify catalogue + content data. Derived verbatim from the client's
// "Firmify Website Pages and Document Mapping", "Probability list of downloads",
// "Tech developer inputs" and FAQ documents. Ported from the approved
// Firmify.dc.html design project.

export interface Category {
  id: string;
  name: string;
  blurb: string;
  docs: string[];
}

export interface CatalogDocument {
  name: string;
  slug: string;
  cats: string[];
  price: number;
  type: string;
  rank: number;
}

export interface MainPage {
  id: string;
  nav: string;
  name: string;
  kicker: string;
  lede: string;
  subCats: string[];
  pack: string;
  photo: string;
}

export interface Pack {
  id: string;
  name: string;
  price: number;
  was: number;
  cats: string[];
  blurb: string;
  best?: boolean;
}

export const slugify = (s: string): string =>
  s.toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// ---------------------------------------------------------------- categories
export const CATEGORIES: Category[] = [
  {
    id: 'employment-hr',
    name: 'Employment & HR',
    blurb: 'The contracts and policies your HR team needs for seamless operations — hiring, onboarding, policies, communications and exits.',
    docs: ['Employment Offer Letter','Internship Offer Letter','Employee Non-Compete & Confidentiality Agreement','Employee Termination Letter/E-mail with cause','Employee Exit & Full & Final Settlement Form','Employee Confirmation Letter/E-mail','Employment Bond Training Reimbursement','Prevention of Sexual Harassment POSH Policy','Grievance Redressal Policy','Employee Warning Letter/E-mail','Salary Revision Letter/E-mail','Employee Referral Policy','Performance Improvement Plan PIP Policy','Maternity Leave Policy','Paternity Leave Policy','Employee Handbook','Work from Home Policy','Hybrid Work Policy','Employee Indemnity Bond','Group Mediclaim & Personal Accident Policy','Vehicle Loan Policy','Bring Your Own Device BYOD Policy','Employment Contract – India','Employee Code of Conduct','Overtime Policy','Disciplinary Action Policy','Expense Reimbursement Policy','Employee Loan Agreement','Company Employee Leave Policy – India','Non-Compete Agreement','Recognition & Rewards Policy','Anti Drug & Alcohol Policy','Social Media Policy','Professional Growth & Training Policy','Clear Desk and Clear Screen Policy','Gender Equality Policy','Travel Reimbursement Policy','Performance Bonus Policy','Anti-Harassment Policy','Probation & Confirmation Policy','Leave Application Form','Staff Welfare Policy','Employee Activity Waiver Agreement','Absconding Employee Termination Letter/E-mail','Company Letter of Recommendation','Employee Promotion Letter/E-mail','Non-Solicitation Agreement','Equal Remuneration Policy','Anti-Smoking Policy','Job Application Form','Employee Relocation Agreement','Employee Grievance Reporting Form','Exit Interview Policy','Employee Fraternization Policy','Gift & Entertainment Policy','Conflict of Interest Policy','Workplace Safety Policy','Client Interaction Policy','Salary Advance Policy','Employee Expense Reimbursement Form','Travel Policy','Employee Background Verification Consent Form','Asset Recovery Policy','Device Purchase Policy','Visitor Management Policy','Dress Code Policy','Anti-Bullying Policy','Employee Time Sheet Template','Employee Rehire Policy','Training Completion E-mail with Certificate','Employee Exit Interview Form','Return-to-Office Policy','Employee Anti-bribery Policy','Employee Separation Policy','Menstrual Leave Policy'],
  },
  {
    id: 'business-contracts',
    name: 'Business Contracts',
    blurb: 'Commercial agreements for vendors, consultants, contractors, service providers, distributors and partners.',
    docs: ['Service Agreement','Vendor Agreement','Consultancy Agreement','Independent Contractor Agreement','Freelance Services Agreement','Master Services Agreement and Service Level Agreement','Independent Sales Agent Agreement','Statement of Work','Vendor Purchase Order','Distribution Agreement','Product Reseller Agreement','Partnership Deed','Business Transfer Agreement','Affiliate Marketing Agreement','Influencer Collaboration Agreement','Digital Marketing Agreement','Website Development Agreement','Letter of Intent','Event Management Agreement','Subcontractor Agreement','Franchise Agreement','Social Media Management Agreement','Profit Sharing Agreement','Amendment Agreement','LLP Partnership Agreement','Inter-Company Loan Agreement','Escrow Agreement','Interior Design Contract','Videography Contract','Photography Contract','IT Services Agreement','IT Maintenance / AMC Agreement','White Labelling Agreement','Commission Agreement','Sub-Lease Agreement','Property Management Agreement','Settlement Agreement','Power of Attorney for Business Operations','Memorandum of Understanding','Outsourcing Agreement','Channel Partner Agreement','Request for Proposal','Joint Venture Agreement','Real Estate Brokerage Commission Agreement','Brands Collaboration Agreement','Product Manufacturing Agreement OEM'],
  },
  {
    id: 'startup-funding',
    name: 'Startup & Funding',
    blurb: 'Founder, investment, ESOP and shareholding documents for founders and early-stage businesses.',
    docs: ['Founders’ Agreement','Share Subscription & Shareholders’ Agreement','Investor Term Sheet Pro Founder','Investor Term Sheet Pro Investor','Board Resolution','ESOP Policy & ESOP Agreement','Shareholders’ Agreement','Share Purchase Agreement','SAFE Agreement','Partnership Deed','Business Transfer Agreement','Letter of Intent','LLP Partnership Agreement','Escrow Agreement','Memorandum of Understanding','Advisor / Mentor Agreement','Startup Incubation Agreement','Request for Proposal','Joint Venture Agreement','Convertible Debenture Subscription Agreement CDSA','Angel Investment Agreement','Share Transfer Deed'],
  },
  {
    id: 'website-data-ip',
    name: 'Website, Data & IP',
    blurb: 'Website policies, DPDP Act compliance, software, data protection and intellectual property documents.',
    docs: ['Website Privacy Policy DPDPA Compliant','Website Terms and Conditions','Website Cookie Policy','Intellectual Property IP Assignment Agreement','Software Development Agreement','Software as a Service Agreement','AI Usage Policy','Trademark Assignment Agreement','Data Retention & Disposal Policy','Copyright Assignment Agreement','Patent Assignment Agreement','Domain Transfer Agreement','Technology Usage Policy','Internet & Email Use Policy','Data Processing Agreement','Information Security Policy','Cyber Security Policy','Cloud Hosting Agreement','End User License Agreement EULA','DPDP Compliance Policy','Data Privacy DPDP Awareness Training Material','Vendor Audit Checklist','Content Licensing Agreement','Password Management Policy','API Licensing & Usage Agreement','Intellectual Property Cease & Desist Notice','Incident Response Plan','Sensitive Data Handling Policy','Record Retention Policy','IT Asset Lifecycle Policy','Website Username Policy','App Developer Agreement'],
  },
  {
    id: 'property',
    name: 'Property',
    blurb: 'Sale, rent, lease and property transfer documents — including state-specific rent agreements.',
    docs: ['Sale Deed','Agreement to Sell','Eviction Notice Landlord','Residential Rent Agreement – India','Commercial Rent Agreement – India','Sub-Lease Agreement','Property Management Agreement','No Objection Certificate Landlord','Residential Rent Agreement – Delhi','Residential Rent Agreement – Haryana','Residential Rent Agreement – Uttar Pradesh','Residential Rent Agreement – Maharashtra','Residential Rent Agreement – Karnataka','Residential Rent Agreement – Tamil Nadu','Residential Rent Agreement – Telangana','Residential Rent Agreement – Gujarat','Commercial Rent Agreement – Delhi','Commercial Rent Agreement – Haryana','Commercial Rent Agreement – Uttar Pradesh','Commercial Rent Agreement – Maharashtra','Commercial Rent Agreement – Karnataka','Commercial Rent Agreement – Tamil Nadu','Commercial Rent Agreement – Telangana','Commercial Rent Agreement – Gujarat','Real Estate Brokerage Commission Agreement','Relinquishment Deed / Release Deed Property','Partition Deed Family Property Settlement','Special Power of Attorney Immovable Property'],
  },
  {
    id: 'notices-disputes',
    name: 'Notices & Disputes',
    blurb: 'Warning letters, terminations, breach notices, cease & desist and settlement documents.',
    docs: ['Employee Warning Letter/E-mail','Employee Termination Letter/E-mail with cause','Employee Termination Letter/E-mail without cause','Absconding Employee Termination Letter/E-mail','Eviction Notice Landlord','Intellectual Property Cease & Desist Notice','Notice of Contract Breach','Settlement Agreement','No Objection Certificate Landlord'],
  },
  {
    id: 'personal-documents',
    name: 'Personal Documents',
    blurb: 'Wills, trusts, powers of attorney, gift deeds and private loan agreements for individuals and families.',
    docs: ['Special Power of Attorney','General Power of Attorney','Loan Agreement Friends / Family / Private','Will','Gift Deed','Trust Deed India General','Employee Loan Agreement','Charitable Trust Deed','Family / Private Trust Deed','Educational / Religious Trust Deed','Special Power of Attorney Immovable Property','Relinquishment Deed / Release Deed Property','Partition Deed Family Property Settlement'],
  },
  {
    id: 'company-policies',
    name: 'Company Policies',
    blurb: 'The full internal policy library — leave, conduct, data, security, wellbeing and governance.',
    docs: ['Maternity Leave Policy','Paternity Leave Policy','Employee Handbook','Prevention of Sexual Harassment POSH Policy','Grievance Redressal Policy','Employee Referral Policy','Performance Improvement Plan PIP Policy','CSR Policy','Whistleblower Policy','AI Usage Policy','Diversity, Equity & Inclusion DEI Policy','Work from Home Policy','Hybrid Work Policy','Data Retention & Disposal Policy','Group Mediclaim & Personal Accident Policy','Vehicle Loan Policy','Bring Your Own Device BYOD Policy','Employee Code of Conduct','Overtime Policy','Disciplinary Action Policy','Expense Reimbursement Policy','Company Employee Leave Policy – India','Technology Usage Policy','Internet & Email Use Policy','Recognition & Rewards Policy','Anti Drug & Alcohol Policy','Social Media Policy','Professional Growth & Training Policy','Clear Desk and Clear Screen Policy','Gender Equality Policy','Information Security Policy','Cyber Security Policy','Travel Reimbursement Policy','Performance Bonus Policy','DPDP Compliance Policy','Data Privacy DPDP Awareness Training Material','Password Management Policy','Anti-Harassment Policy','Probation & Confirmation Policy','Staff Welfare Policy','Incident Response Plan','Equal Remuneration Policy','Anti-Smoking Policy','Exit Interview Policy','Employee Fraternization Policy','Gift & Entertainment Policy','Conflict of Interest Policy','Workplace Safety Policy','Business Continuity Policy','Client Interaction Policy','Salary Advance Policy','Travel Policy','Asset Recovery Policy','Device Purchase Policy','Visitor Management Policy','Dress Code Policy','Sensitive Data Handling Policy','Record Retention Policy','Anti-Bullying Policy','Employee Rehire Policy','IT Asset Lifecycle Policy','Return-to-Office Policy','Employee Anti-bribery Policy','Employee Separation Policy','Menstrual Leave Policy'],
  },
  {
    id: 'state-specific',
    name: 'State-Specific Documents',
    blurb: 'Employment contracts, rent agreements and leave policies drafted for individual Indian states.',
    docs: ['Employment Contract – Delhi','Employment Contract – Haryana','Employment Contract – Uttar Pradesh','Employment Contract – Maharashtra','Employment Contract – Karnataka','Employment Contract – Tamil Nadu','Employment Contract – Telangana','Employment Contract – Gujarat','Residential Rent Agreement – Delhi','Residential Rent Agreement – Haryana','Residential Rent Agreement – Uttar Pradesh','Residential Rent Agreement – Maharashtra','Residential Rent Agreement – Karnataka','Residential Rent Agreement – Tamil Nadu','Residential Rent Agreement – Telangana','Residential Rent Agreement – Gujarat','Commercial Rent Agreement – Delhi','Commercial Rent Agreement – Haryana','Commercial Rent Agreement – Uttar Pradesh','Commercial Rent Agreement – Maharashtra','Commercial Rent Agreement – Karnataka','Commercial Rent Agreement – Tamil Nadu','Commercial Rent Agreement – Telangana','Commercial Rent Agreement – Gujarat','Company Employee Leave Policy – Delhi','Company Employee Leave Policy – Haryana','Company Employee Leave Policy – Uttar Pradesh','Company Employee Leave Policy – Maharashtra','Company Employee Leave Policy – Karnataka','Company Employee Leave Policy – Tamil Nadu','Company Employee Leave Policy – Telangana','Company Employee Leave Policy – Gujarat'],
  },
  {
    id: 'free-resources',
    name: 'Free Resources',
    blurb: 'Free to fill and download — no payment, no subscription required.',
    docs: ['NDA','Rent Receipt','Affidavit for Address Proof','Affidavit for Name Change','Affidavit for Date of Birth'],
  },
];

// Download-probability ranking (client's "Probability list of downloads", top 32)
export const TOP_RANKED: string[] = ['Internship Offer Letter','Prevention of Sexual Harassment POSH Policy','Grievance Redressal Policy','Freelance Services Agreement','Software Development Agreement','Software as a Service Agreement','Intellectual Property IP Assignment Agreement','Trademark Assignment Agreement','Asset Recovery Policy','Device Purchase Policy','Visitor Management Policy','Dress Code Policy','Performance Bonus Policy','Anti-Harassment Policy','Employee Non-Compete & Confidentiality Agreement','Employment Offer Letter','Employment Contract – India','Website Privacy Policy DPDPA Compliant','Employee Handbook','DPDP Compliance Policy','Residential Rent Agreement – India','Commercial Rent Agreement – India','Independent Contractor Agreement','Master Services Agreement and Service Level Agreement','Work from Home Policy','Hybrid Work Policy','Vendor Agreement','Service Agreement','Investor Term Sheet Pro Founder','Founders’ Agreement','ESOP Policy & ESOP Agreement','Website Terms and Conditions'];

// The eight documents shown as "Popular documents" under the hero search bar,
// per the client's above-the-fold sample image.
export const HERO_POPULAR: string[] = ['Employment Offer Letter','Residential Rent Agreement – India','Website Privacy Policy DPDPA Compliant','Vendor Agreement','Service Agreement','Employment Contract – India','Website Terms and Conditions','Consultancy Agreement'];

// ------------------------------------------------------------------- pricing
// NOTE FOR CLIENT: individual document prices were not supplied in the brief.
// These are placeholders derived from the homepage claim "save Rs 9,000 for
// every Rs 1,000 you spend" (i.e. ~Rs 999 per document).
const priceFor = (name: string): number => {
  if (/^NDA$|Rent Receipt|^Affidavit/.test(name)) return 0;
  if (/Deed|Shareholders|Subscription & |Term Sheet|ESOP|Will$|Trust Deed|Joint Venture|Franchise|Business Transfer|SAFE|Debenture/.test(name)) return 1499;
  if (/Letter\/E-mail|Form$|Template$|Application Form|Purchase Order|Receipt|Board Resolution|Checklist/.test(name)) return 499;
  return 999;
};

const typeFor = (name: string): string => {
  if (/Policy$|Policy \(|Handbook|Plan$|Material$|Code of Conduct/.test(name)) return 'Policy';
  if (/Letter|E-mail|Notice/.test(name)) return 'Letter / Notice';
  if (/Form$|Template$|Checklist|Purchase Order/.test(name)) return 'Form';
  if (/Deed|Will$/.test(name)) return 'Deed';
  return 'Contract';
};

// Build one flat, de-duplicated document catalogue.
const byName = new Map<string, CatalogDocument>();
CATEGORIES.forEach((cat) => {
  cat.docs.forEach((name) => {
    const existing = byName.get(name);
    if (!existing) {
      byName.set(name, {
        name,
        slug: slugify(name),
        cats: [cat.id],
        price: priceFor(name),
        type: typeFor(name),
        rank: TOP_RANKED.indexOf(name) === -1 ? 999 : TOP_RANKED.indexOf(name),
      });
    } else {
      existing.cats.push(cat.id);
    }
  });
});
export const DOCUMENTS: CatalogDocument[] = [...byName.values()];
export const DOC_BY_SLUG: Record<string, CatalogDocument> = Object.fromEntries(DOCUMENTS.map((d) => [d.slug, d]));
export const TOTAL_DOCS = 224;

// ---------------------------------------------------------------- main pages
// Documents under each main page mirror the matching subscription pack.
export const MAIN_PAGES: MainPage[] = [
  {
    id: 'hr-employment-documents',
    nav: 'HR & Employment\nDocuments',
    name: 'HR & Employment Documents',
    kicker: 'For employers, founders and HR teams',
    lede: 'Hiring, onboarding, policies, employee communications and exits — drafted by Indian lawyers in compliance with the four new labour codes rolled out on 21 November 2025.',
    subCats: ['employment-hr', 'company-policies', 'notices-disputes'],
    pack: 'hr-employment-pack',
    photo: '/assets/photo-desk.png',
  },
  {
    id: 'company-contracts-policies',
    nav: 'Company Contracts\n& Policies',
    name: 'Company Contracts & Policies',
    kicker: 'For businesses working with vendors and clients',
    lede: 'Commercial contracts, vendor and consultancy documents, website terms, privacy documents, notices and the full internal policy library.',
    subCats: ['business-contracts', 'company-policies', 'website-data-ip'],
    pack: 'company-contracts-policies-pack',
    photo: '/assets/photo-laptop.png',
  },
  {
    id: 'startup-fundraising-documents',
    nav: 'Startup & Fundraising\nDocuments',
    name: 'Startup & Fundraising Documents',
    kicker: 'For founders and early-stage businesses',
    lede: 'Founders’ agreements, term sheets, ESOP, SAFE, share subscription and the employment and website documents every new company needs on day one.',
    subCats: ['startup-funding', 'website-data-ip', 'employment-hr'],
    pack: 'startup-fundraising-pack',
    photo: '/assets/photo-standing.png',
  },
  {
    id: 'property-personal-documents',
    nav: 'Property &\nPersonal Documents',
    name: 'Property & Personal Documents',
    kicker: 'For individuals, landlords and families',
    lede: 'Sale deeds, rent agreements for eight states, powers of attorney, wills, trust deeds and family settlement documents.',
    subCats: ['property', 'personal-documents', 'state-specific'],
    pack: 'property-personal-pack',
    photo: '/assets/photo-primary.png',
  },
];

// --------------------------------------------------------- subscription packs
export const PACKS: Pack[] = [
  { id: 'all-documents-pack', name: 'All Documents Pack', price: 9999, was: 19999, cats: CATEGORIES.map((c) => c.id), blurb: 'Every contract and policy on Firmify, across all ten categories.', best: true },
  { id: 'hr-employment-pack', name: 'HR & Employment Pack', price: 4999, was: 9999, cats: ['employment-hr', 'company-policies', 'notices-disputes'], blurb: 'Everything an HR team needs, from offer letter to full and final settlement.' },
  { id: 'company-contracts-policies-pack', name: 'Company Contracts & Policies Pack', price: 5999, was: 9999, cats: ['business-contracts', 'company-policies', 'website-data-ip'], blurb: 'Commercial contracts, website and data documents, and the policy library.' },
  { id: 'startup-fundraising-pack', name: 'Startup & Fundraising Pack', price: 3999, was: 9999, cats: ['startup-funding', 'website-data-ip'], blurb: 'Founder, investment and ESOP documents plus website essentials.' },
  { id: 'property-personal-pack', name: 'Property & Personal Pack', price: 2999, was: 7999, cats: ['property', 'personal-documents', 'state-specific'], blurb: 'Rent, sale, POA, will, trust and family settlement documents.' },
];

export const PACK_TERMS: string[] = ['Valid for 6 months or 1 year', 'Up to 50 downloads', 'Word and PDF download', 'E-sign included', 'Documents updated as laws change', 'No hidden charges'];

// ------------------------------------------------------------- help centres
export const HELP_CENTRES = [
  { id: 'firmify-basics-general-faqs', name: 'Firmify Basics & General FAQs' },
  { id: 'startup-founder-help-centre', name: 'Startup & Founder Help Center' },
  { id: 'company-contracts-policies-help-centre', name: 'Company Contracts & Policies Help Center' },
  { id: 'hr-employment-help-centre', name: 'HR & Employment Help Center' },
  { id: 'individual-users-help-centre', name: 'Individual Users Help Center' },
  { id: 'subscriptions-payments-downloads', name: 'Subscription Packs, Payments & Downloads Explained' },
];

export const CITIES: string[] = ['Pune','New Delhi','Mumbai','Bengaluru','Hyderabad','Chennai','Ahmedabad','Kolkata','Gurugram','Noida','Indore','Nagpur','Faridabad','Surat','Lucknow','Coimbatore','Visakhapatnam','Jaipur','Bhopal','Bhubaneswar'];

export const LEGAL_PAGES = [
  { id: 'terms-of-use', name: 'Terms of Use' },
  { id: 'privacy-policy', name: 'Privacy Policy' },
  { id: 'bci-compliance-note', name: 'BCI Compliance Note' },
  { id: 'contact-support', name: 'Contact / Support' },
];

export const docsFor = (catId: string): CatalogDocument[] =>
  DOCUMENTS.filter((d) => d.cats.includes(catId));

export const packDocCount = (pack: Pack | { cats: string[] }): number => {
  const set = new Set<string>();
  pack.cats.forEach((c) => docsFor(c).forEach((d) => set.add(d.slug)));
  return set.size;
};

export const money = (n: number): string =>
  n === 0 ? 'Free' : 'Rs. ' + n.toLocaleString('en-IN') + '/-';
