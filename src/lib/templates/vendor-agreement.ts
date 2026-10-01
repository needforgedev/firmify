import type { Template } from "../types";

// AUTHORING SOURCE ONLY — seeded into the DB by scripts/seed.ts; the app
// renders questionnaires from template_versions, never from this file.
//
// Demo template for the Company Contracts & Policies category.
// Exercises: variants (term, payment days), conditional clause (SLA),
// repeat group (deliverables).

export const vendorAgreement: Template = {
  slug: "vendor-agreement",
  title: "Vendor Agreement",
  version: 1,
  category: "Business Contracts",
  description:
    "A law-firm drafted vendor agreement covering services, term, fees, payment terms, service levels, confidentiality and termination.",
  price: 999,

  steps: [
    {
      id: "parties",
      title: "The Parties",
      description: "Who is engaging whom?",
      questionIds: ["company_name", "company_address", "vendor_name", "vendor_address"],
    },
    {
      id: "services",
      title: "Services & Term",
      description: "What the vendor will do, and for how long.",
      questionIds: ["services_desc", "deliverables", "start_date", "term_style"],
    },
    {
      id: "payment",
      title: "Fees & Payment",
      description: "How much, and when it is paid.",
      questionIds: ["monthly_fee", "payment_days"],
    },
    {
      id: "protections",
      title: "Service Levels & Protections",
      description: "Performance commitments and legal safeguards.",
      questionIds: ["has_sla", "sla_uptime"],
    },
  ],

  questions: [
    {
      id: "company_name",
      type: "text",
      label: "Your company name",
      placeholder: "e.g. Acme Technologies Pvt. Ltd.",
      required: true,
      tooltip: "The party purchasing the services (the “Company”).",
    },
    { id: "company_address", type: "text", label: "Company registered address", required: true },
    {
      id: "vendor_name",
      type: "text",
      label: "Vendor name",
      placeholder: "e.g. Sharma Facility Services",
      required: true,
    },
    { id: "vendor_address", type: "text", label: "Vendor address", required: true },
    {
      id: "services_desc",
      type: "text",
      label: "Describe the services in one line",
      placeholder: "e.g. housekeeping and facility management services",
      required: true,
      tooltip: "This description is inserted into the Services clause. Keep it specific — vague scopes cause disputes.",
    },
    {
      id: "deliverables",
      type: "repeat_group",
      label: "Key deliverables",
      itemLabel: "Deliverable",
      min: 0,
      max: 5,
      tooltip: "Optional — list specific deliverables to annex to the Services clause.",
      fields: [{ id: "del_name", type: "text", label: "Deliverable", required: true }],
    },
    { id: "start_date", type: "date", label: "Start date", required: true },
    {
      id: "term_style",
      type: "choice",
      label: "Term of the agreement",
      required: true,
      options: [
        { value: "fixed_12", label: "Fixed — 12 months" },
        { value: "fixed_24", label: "Fixed — 24 months" },
        { value: "until_terminated", label: "Ongoing until terminated" },
      ],
      tooltip: "A fixed term gives price certainty; an ongoing term gives flexibility to exit.",
    },
    {
      id: "monthly_fee",
      type: "number",
      label: "Monthly fee (₹, excluding GST)",
      placeholder: "e.g. 85000",
      required: true,
    },
    {
      id: "payment_days",
      type: "choice",
      label: "Payment due within",
      required: true,
      options: [
        { value: "d15", label: "15 days of invoice" },
        { value: "d30", label: "30 days of invoice" },
        { value: "d45", label: "45 days of invoice" },
      ],
      tooltip: "MSME vendors are legally entitled to payment within 45 days under the MSMED Act.",
    },
    {
      id: "has_sla",
      type: "yes_no",
      label: "Include a service-level commitment?",
      required: true,
      tooltip: "Choose Yes to add a measurable service-level clause. Choose No and the clause is removed entirely.",
    },
    {
      id: "sla_uptime",
      type: "number",
      label: "Minimum service level (%)",
      placeholder: "e.g. 98",
      required: true,
      showIf: { questionId: "has_sla", equals: "yes" },
    },
  ],

  clauses: [
    {
      id: "preamble",
      unnumbered: true,
      body:
        "THIS VENDOR AGREEMENT is made on this day between {{company_name}}, having its registered office at {{company_address}} (the “Company”), and {{vendor_name}}, having its address at {{vendor_address}} (the “Vendor”).",
    },
    {
      id: "services",
      heading: "Services",
      body:
        "The Vendor shall provide to the Company {{services_desc}} (the “Services”), with the skill, care and diligence expected of a professional vendor, and in compliance with applicable laws.",
    },
    {
      id: "deliverables",
      heading: "Key Deliverables",
      repeatOver: "deliverables",
      body: "Deliverable {{index}}: {{del_name}}",
    },
    {
      id: "term",
      heading: "Term",
      variantKey: "term_style",
      variants: {
        fixed_12:
          "This Agreement shall commence on {{start_date}} and remain in force for a fixed term of 12 months, unless terminated earlier in accordance with this Agreement.",
        fixed_24:
          "This Agreement shall commence on {{start_date}} and remain in force for a fixed term of 24 months, unless terminated earlier in accordance with this Agreement.",
        until_terminated:
          "This Agreement shall commence on {{start_date}} and continue until terminated by either Party in accordance with this Agreement.",
      },
    },
    {
      id: "fees",
      heading: "Fees",
      body:
        "In consideration of the Services, the Company shall pay the Vendor a monthly fee of ₹ {{monthly_fee}} plus applicable GST, against a valid tax invoice raised at the end of each month.",
    },
    {
      id: "payment",
      heading: "Payment Terms",
      variantKey: "payment_days",
      variants: {
        d15: "Each undisputed invoice shall be paid within 15 days of receipt. Disputed amounts shall be notified in writing within 7 days of receipt of the invoice.",
        d30: "Each undisputed invoice shall be paid within 30 days of receipt. Disputed amounts shall be notified in writing within 7 days of receipt of the invoice.",
        d45: "Each undisputed invoice shall be paid within 45 days of receipt. Disputed amounts shall be notified in writing within 7 days of receipt of the invoice.",
      },
    },
    {
      id: "sla",
      heading: "Service Levels",
      includeIf: { questionId: "has_sla", equals: "yes" },
      body:
        "The Vendor shall maintain a minimum service level of {{sla_uptime}}% measured monthly. Repeated failure to meet the service level in any two consecutive months shall entitle the Company to terminate this Agreement for cause.",
    },
    {
      id: "confidentiality",
      heading: "Confidentiality",
      body:
        "Each Party shall keep confidential all non-public information of the other Party received in connection with this Agreement, including personal data processed under the Digital Personal Data Protection Act, 2023, and shall use it only for performing this Agreement.",
    },
    {
      id: "termination",
      heading: "Termination",
      body:
        "Either Party may terminate this Agreement by 30 days' prior written notice. The Company may terminate immediately for material breach that remains uncured for 15 days after written notice.",
    },
    {
      id: "governing_law",
      heading: "Governing Law",
      body:
        "This Agreement shall be governed by the laws of India, and the courts having jurisdiction over the Company's registered office shall have exclusive jurisdiction.",
    },
    {
      id: "signatures",
      unnumbered: true,
      body:
        "IN WITNESS WHEREOF the Parties have executed this Agreement.\n\nFor {{company_name}} (Authorised Signatory)\n\nFor {{vendor_name}} (Authorised Signatory)",
    },
  ],
};
