import type { Template } from "../types";

// Demo template for the Property & Personal category.
// Exercises: conditional lock-in clause, maintenance + notice variants,
// witness repeat group.

export const rentAgreement: Template = {
  slug: "residential-rent-agreement-india",
  title: "Residential Rent Agreement – India",
  version: 1,
  category: "Property",
  description:
    "A law-firm drafted residential rent agreement covering rent, deposit, lock-in, maintenance, notice and termination.",
  price: 999,

  steps: [
    {
      id: "parties",
      title: "The Parties",
      description: "Landlord and tenant details.",
      questionIds: ["landlord_name", "landlord_address", "tenant_name", "tenant_address"],
    },
    {
      id: "premises",
      title: "The Premises",
      description: "The property being rented.",
      questionIds: ["property_address", "start_date", "term_months"],
    },
    {
      id: "rent",
      title: "Rent & Deposit",
      description: "The money terms.",
      questionIds: ["rent_monthly", "rent_due_day", "deposit"],
    },
    {
      id: "terms",
      title: "Lock-in, Maintenance & Notice",
      description: "The terms people argue about later.",
      questionIds: ["has_lock_in", "lock_in_months", "maintenance_by", "notice_months"],
    },
    {
      id: "witnesses",
      title: "Witnesses",
      description: "Optional witnesses to the signing.",
      questionIds: ["witnesses"],
    },
  ],

  questions: [
    { id: "landlord_name", type: "text", label: "Landlord's full name", placeholder: "e.g. Suresh Kumar", required: true },
    { id: "landlord_address", type: "text", label: "Landlord's address", required: true },
    { id: "tenant_name", type: "text", label: "Tenant's full name", placeholder: "e.g. Ananya Iyer", required: true },
    { id: "tenant_address", type: "text", label: "Tenant's permanent address", required: true },
    {
      id: "property_address",
      type: "text",
      label: "Full address of the rented premises",
      placeholder: "e.g. Flat 402, Green Meadows, Whitefield, Bengaluru 560066",
      required: true,
    },
    { id: "start_date", type: "date", label: "Tenancy start date", required: true },
    {
      id: "term_months",
      type: "number",
      label: "Term (months)",
      placeholder: "e.g. 11",
      required: true,
      tooltip:
        "11 months is common in India because agreements of 12 months or more generally require registration.",
    },
    { id: "rent_monthly", type: "number", label: "Monthly rent (₹)", placeholder: "e.g. 35000", required: true },
    {
      id: "rent_due_day",
      type: "number",
      label: "Rent due by which day of the month?",
      placeholder: "e.g. 5",
      required: true,
    },
    {
      id: "deposit",
      type: "number",
      label: "Security deposit (₹)",
      placeholder: "e.g. 105000",
      required: true,
      tooltip: "Commonly 2–3 months' rent in most cities; up to 10 months in Bengaluru.",
    },
    {
      id: "has_lock_in",
      type: "yes_no",
      label: "Is there a lock-in period?",
      required: true,
      tooltip:
        "During lock-in, neither party can terminate — the tenant remains liable for rent for the full lock-in even if they leave. Choose No and the clause is removed.",
    },
    {
      id: "lock_in_months",
      type: "number",
      label: "Lock-in period (months)",
      placeholder: "e.g. 6",
      required: true,
      showIf: { questionId: "has_lock_in", equals: "yes" },
    },
    {
      id: "maintenance_by",
      type: "choice",
      label: "Who pays the society maintenance charges?",
      required: true,
      options: [
        { value: "landlord", label: "Landlord" },
        { value: "tenant", label: "Tenant" },
        { value: "shared", label: "Shared equally" },
      ],
      tooltip: "This selects between three wordings of the Maintenance clause.",
    },
    {
      id: "notice_months",
      type: "choice",
      label: "Notice period to end the tenancy",
      required: true,
      options: [
        { value: "m1", label: "1 month" },
        { value: "m2", label: "2 months" },
        { value: "m3", label: "3 months" },
      ],
    },
    {
      id: "witnesses",
      type: "repeat_group",
      label: "Witnesses",
      itemLabel: "Witness",
      min: 0,
      max: 2,
      tooltip: "Two witnesses are customary for rent agreements.",
      fields: [
        { id: "w_name", type: "text", label: "Witness name", required: true },
        { id: "w_address", type: "text", label: "Witness address", required: true },
      ],
    },
  ],

  clauses: [
    {
      id: "preamble",
      unnumbered: true,
      body:
        "THIS RENT AGREEMENT is made on this day between {{landlord_name}}, residing at {{landlord_address}} (the “Landlord”), and {{tenant_name}}, permanently residing at {{tenant_address}} (the “Tenant”).",
    },
    {
      id: "premises",
      heading: "The Premises",
      body:
        "The Landlord lets to the Tenant the residential premises at {{property_address}} (the “Premises”), together with fittings and fixtures as recorded in the handover checklist, for residential use only.",
    },
    {
      id: "term",
      heading: "Term",
      body:
        "The tenancy shall commence on {{start_date}} and continue for a period of {{term_months}} months, renewable on such terms as the parties may mutually agree in writing.",
    },
    {
      id: "rent",
      heading: "Rent",
      body:
        "The Tenant shall pay a monthly rent of ₹ {{rent_monthly}}, payable in advance on or before the {{rent_due_day}} day of each English calendar month.",
    },
    {
      id: "deposit",
      heading: "Security Deposit",
      body:
        "The Tenant has paid the Landlord an interest-free refundable security deposit of ₹ {{deposit}}. The deposit shall be refunded on vacation of the Premises after deducting unpaid rent, unpaid utilities and the reasonable cost of repairing damage beyond normal wear and tear.",
    },
    {
      id: "lock_in",
      heading: "Lock-in Period",
      includeIf: { questionId: "has_lock_in", equals: "yes" },
      body:
        "The first {{lock_in_months}} months of the term shall be a lock-in period during which neither party may terminate the tenancy. If the Tenant vacates during the lock-in, the Tenant shall remain liable for rent for the unexpired lock-in period.",
    },
    {
      id: "maintenance",
      heading: "Maintenance & Utilities",
      variantKey: "maintenance_by",
      variants: {
        landlord:
          "The Landlord shall bear the society maintenance charges. The Tenant shall pay for electricity, water, gas and other utilities consumed at the Premises.",
        tenant:
          "The Tenant shall bear the society maintenance charges, in addition to electricity, water, gas and other utilities consumed at the Premises.",
        shared:
          "The society maintenance charges shall be shared equally between the Landlord and the Tenant. The Tenant shall pay for electricity, water, gas and other utilities consumed at the Premises.",
      },
    },
    {
      id: "notice",
      heading: "Termination & Notice",
      variantKey: "notice_months",
      variants: {
        m1: "After any lock-in period, either party may terminate the tenancy by giving 1 month's prior written notice, or rent in lieu of notice.",
        m2: "After any lock-in period, either party may terminate the tenancy by giving 2 months' prior written notice, or rent in lieu of notice.",
        m3: "After any lock-in period, either party may terminate the tenancy by giving 3 months' prior written notice, or rent in lieu of notice.",
      },
    },
    {
      id: "obligations",
      heading: "Tenant's Obligations",
      body:
        "The Tenant shall use the Premises only for residential purposes, shall not sublet or part with possession, shall not make structural alterations without written consent, and shall permit the Landlord to inspect the Premises at reasonable times with prior notice.",
    },
    {
      id: "governing_law",
      heading: "Governing Law",
      body:
        "This Agreement shall be governed by the laws of India, including the applicable state Rent Control legislation, and the courts of the city where the Premises are situated shall have jurisdiction.",
    },
    {
      id: "signatures",
      unnumbered: true,
      body:
        "IN WITNESS WHEREOF the parties have executed this Agreement.\n\n{{landlord_name}} (Landlord)\n\n{{tenant_name}} (Tenant)",
    },
    {
      id: "witness_block",
      unnumbered: true,
      repeatOver: "witnesses",
      body: "Witness {{index}}: {{w_name}}, residing at {{w_address}}",
    },
  ],
};
