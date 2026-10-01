import type { Template } from "../types";

// AUTHORING SOURCE ONLY — seeded into the DB by scripts/seed.ts; the app
// renders questionnaires from template_versions, never from this file.
//
// Demo template for the Startup & Fundraising category.
// Exercises: repeat group as the core of the document (founders), conditional
// vesting block, IP variants, conditional non-compete.

export const foundersAgreement: Template = {
  slug: "founders-agreement",
  title: "Founders’ Agreement",
  version: 1,
  category: "Startup & Funding",
  description:
    "A law-firm drafted founders’ agreement covering equity split, roles, vesting, IP assignment and founder protections.",
  price: 1499,

  steps: [
    {
      id: "company",
      title: "The Company",
      description: "The venture this agreement is for.",
      questionIds: ["company_name", "business_desc"],
    },
    {
      id: "founders",
      title: "The Founders",
      description: "Add each founder with their shareholding and role.",
      questionIds: ["founders"],
    },
    {
      id: "vesting",
      title: "Vesting",
      description: "Whether founder equity vests over time.",
      questionIds: ["has_vesting", "vesting_years", "cliff_months"],
    },
    {
      id: "protections",
      title: "IP & Protections",
      description: "Intellectual property and non-compete terms.",
      questionIds: ["ip_style", "has_non_compete"],
    },
  ],

  questions: [
    {
      id: "company_name",
      type: "text",
      label: "Company / proposed company name",
      placeholder: "e.g. Lumina Health Technologies Pvt. Ltd.",
      required: true,
    },
    {
      id: "business_desc",
      type: "text",
      label: "Describe the business in one line",
      placeholder: "e.g. an AI-assisted diagnostics platform for Indian clinics",
      required: true,
      tooltip: "This becomes the Business clause. Keep it broad enough to cover pivots.",
    },
    {
      id: "founders",
      type: "repeat_group",
      label: "Founders",
      itemLabel: "Founder",
      min: 2,
      max: 5,
      required: true,
      tooltip: "Add at least two founders. Equity percentages should total 100.",
      fields: [
        { id: "f_name", type: "text", label: "Full name", required: true },
        { id: "f_role", type: "text", label: "Role (e.g. CEO, CTO)", required: true },
        { id: "f_equity", type: "text", label: "Equity %", required: true },
      ],
    },
    {
      id: "has_vesting",
      type: "yes_no",
      label: "Should founder equity vest over time?",
      required: true,
      tooltip:
        "Vesting protects the remaining founders if someone leaves early — unvested shares return to the company. Investors will expect this. If you choose No, the vesting clause is removed.",
    },
    {
      id: "vesting_years",
      type: "number",
      label: "Vesting period (years)",
      placeholder: "e.g. 4",
      required: true,
      showIf: { questionId: "has_vesting", equals: "yes" },
      tooltip: "4 years is the market standard.",
    },
    {
      id: "cliff_months",
      type: "number",
      label: "Cliff (months)",
      placeholder: "e.g. 12",
      required: true,
      showIf: { questionId: "has_vesting", equals: "yes" },
      tooltip: "No equity vests until the cliff is served; a 12-month cliff is standard.",
    },
    {
      id: "ip_style",
      type: "choice",
      label: "Intellectual property assignment",
      required: true,
      options: [
        { value: "assign_all", label: "Assign all founder IP related to the venture" },
        { value: "assign_business", label: "Assign only IP created for the business going forward" },
      ],
      tooltip:
        "Investors expect all venture-related IP — including pre-incorporation work — to belong to the company.",
    },
    {
      id: "has_non_compete",
      type: "yes_no",
      label: "Include a founder non-compete?",
      required: true,
      tooltip:
        "Restricts a departing founder from starting or joining a competing business for a period. Choose No and the clause is removed.",
    },
  ],

  clauses: [
    {
      id: "preamble",
      unnumbered: true,
      body:
        "THIS FOUNDERS’ AGREEMENT is made on this day between the founders listed below (each a “Founder”, together the “Founders”) in relation to {{company_name}} (the “Company”).",
    },
    {
      id: "business",
      heading: "The Business",
      body:
        "The Founders have agreed to establish and operate the Company to carry on the business of {{business_desc}}, and such other business as the Founders may unanimously agree (the “Business”).",
    },
    {
      id: "shareholding",
      heading: "Founders & Shareholding",
      repeatOver: "founders",
      body: "Founder {{index}}: {{f_name}}, serving as {{f_role}}, holding {{f_equity}}% of the equity share capital.",
    },
    {
      id: "roles",
      heading: "Roles & Commitment",
      body:
        "Each Founder shall devote their full working time and attention to the Business and shall not, without the written consent of the other Founders, engage in any other business activity that conflicts with the interests of the Company.",
    },
    {
      id: "vesting",
      heading: "Vesting",
      includeIf: { questionId: "has_vesting", equals: "yes" },
      body:
        "Each Founder's shares shall vest over a period of {{vesting_years}} years, subject to a cliff of {{cliff_months}} months from the date of this Agreement. No shares shall vest before the cliff is served; thereafter, shares shall vest in equal monthly instalments. If a Founder ceases to be engaged with the Company, all unvested shares shall be transferred as the remaining Founders direct, at the lower of fair value and face value.",
    },
    {
      id: "ip",
      heading: "Intellectual Property",
      variantKey: "ip_style",
      variants: {
        assign_all:
          "Each Founder hereby assigns to the Company all intellectual property created by that Founder that relates to the Business, whether created before or after the date of this Agreement, and shall execute all documents required to perfect such assignment.",
        assign_business:
          "Each Founder hereby assigns to the Company all intellectual property created by that Founder in the course of the Business from the date of this Agreement, and shall execute all documents required to perfect such assignment.",
      },
    },
    {
      id: "non_compete",
      heading: "Non-Compete & Non-Solicitation",
      includeIf: { questionId: "has_non_compete", equals: "yes" },
      body:
        "During their engagement with the Company and for a period of 12 months thereafter, a Founder shall not carry on or be engaged in any business competing with the Business in India, and shall not solicit the Company's employees, customers or suppliers.",
    },
    {
      id: "decisions",
      heading: "Decision Making",
      body:
        "Day-to-day decisions shall be taken by the Founders in their respective roles. The following matters shall require the consent of Founders holding at least 75% of the founder equity: issue or transfer of shares, borrowing above limits set by the board, changes to the Business, admission of a new founder, and winding up.",
    },
    {
      id: "governing_law",
      heading: "Governing Law",
      body:
        "This Agreement shall be governed by the laws of India. Disputes shall first be referred to good-faith discussions between the Founders, failing which to arbitration under the Arbitration and Conciliation Act, 1996.",
    },
    {
      id: "signatures",
      unnumbered: true,
      body: "IN WITNESS WHEREOF the Founders have executed this Agreement.",
    },
    {
      id: "signature_block",
      unnumbered: true,
      repeatOver: "founders",
      body: "{{f_name}} ({{f_role}})",
    },
  ],
};
