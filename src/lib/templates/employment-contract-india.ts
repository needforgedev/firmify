import type { Template } from "../types";

// AUTHORING SOURCE ONLY — seeded into the DB by scripts/seed.ts; the app
// renders questionnaires from template_versions, never from this file.
//
// Demo template for the HR & Employment category. Real clause text will come
// from the client's law-firm drafts; this content exists to exercise every
// mechanism of the engine: placeholders, conditional questions, conditional
// clauses, variants, repeats.

export const employmentContractIndia: Template = {
  slug: "employment-contract-india",
  title: "Employment Contract – India",
  version: 1,
  category: "HR & Employment",
  description:
    "A law-firm drafted employment agreement compliant with Indian law, covering appointment, compensation, probation, place of work, termination and confidentiality.",
  price: 499,
  strikePrice: 999,

  steps: [
    {
      id: "parties",
      title: "The Parties",
      description: "Who is entering into this agreement?",
      questionIds: ["company_name", "company_address", "employee_name", "employee_address"],
    },
    {
      id: "role",
      title: "Role & Compensation",
      description: "The position, start date and pay.",
      questionIds: ["job_title", "start_date", "salary_annual"],
    },
    {
      id: "probation",
      title: "Probation",
      description: "Whether a probation period applies.",
      questionIds: ["has_probation", "probation_months", "probation_style"],
    },
    {
      id: "work-termination",
      title: "Work & Termination",
      description: "Where the employee works and how the contract can end.",
      questionIds: ["work_mode", "notice_style"],
    },
    {
      id: "witnesses",
      title: "Witnesses",
      description: "Optional witnesses to the signing.",
      questionIds: ["witnesses"],
    },
  ],

  questions: [
    {
      id: "company_name",
      type: "text",
      label: "Company / employer name",
      placeholder: "e.g. Acme Technologies Pvt. Ltd.",
      required: true,
      tooltip: "Use the full registered name of the company as per its incorporation documents.",
    },
    {
      id: "company_address",
      type: "text",
      label: "Company registered address",
      placeholder: "e.g. 12, MG Road, Bengaluru, Karnataka 560001",
      required: true,
    },
    {
      id: "employee_name",
      type: "text",
      label: "Employee's full name",
      placeholder: "e.g. Priya Sharma",
      required: true,
      tooltip: "As per the employee's government-issued ID.",
    },
    {
      id: "employee_address",
      type: "text",
      label: "Employee's residential address",
      required: true,
    },
    {
      id: "job_title",
      type: "text",
      label: "Job title / designation",
      placeholder: "e.g. Senior Software Engineer",
      required: true,
    },
    {
      id: "start_date",
      type: "date",
      label: "Employment start date",
      required: true,
    },
    {
      id: "salary_annual",
      type: "number",
      label: "Annual salary (CTC, in ₹)",
      placeholder: "e.g. 1200000",
      required: true,
      tooltip:
        "Total annual cost-to-company in rupees. The agreement inserts this as the gross annual compensation.",
    },
    {
      id: "has_probation",
      type: "yes_no",
      label: "Is there a probation period?",
      required: true,
      tooltip:
        "Probation lets the employer assess the employee before confirmation. If you choose No, the probation clause is removed from the agreement entirely.",
    },
    {
      id: "probation_months",
      type: "number",
      label: "Probation length (months)",
      placeholder: "e.g. 6",
      required: true,
      showIf: { questionId: "has_probation", equals: "yes" },
      tooltip: "3 to 6 months is typical in India.",
    },
    {
      id: "probation_style",
      type: "choice",
      label: "Probation clause style",
      required: true,
      showIf: { questionId: "has_probation", equals: "yes" },
      options: [
        { value: "simple", label: "Simple — fixed probation period" },
        { value: "extendable", label: "Extendable — employer may extend once" },
      ],
      tooltip:
        "The extendable option lets the employer extend probation once by the same length if performance is not yet confirmed.",
    },
    {
      id: "work_mode",
      type: "choice",
      label: "Place of work",
      required: true,
      options: [
        { value: "office", label: "Office-based" },
        { value: "hybrid", label: "Hybrid" },
        { value: "remote", label: "Fully remote" },
      ],
      tooltip: "This selects between three different wordings of the Place of Work clause.",
    },
    {
      id: "notice_style",
      type: "choice",
      label: "Termination notice period",
      required: true,
      options: [
        { value: "30_days", label: "30 days' notice" },
        { value: "60_days", label: "60 days' notice" },
        { value: "as_per_law", label: "As per applicable law" },
      ],
      tooltip:
        "Shorter notice favours flexibility; longer notice favours stability. Statutory minimums under applicable Shops & Establishments law still apply.",
    },
    {
      id: "witnesses",
      type: "repeat_group",
      label: "Witnesses",
      itemLabel: "Witness",
      min: 0,
      max: 3,
      tooltip:
        "Witnesses are optional for an employment agreement but add evidentiary weight. You can add up to three.",
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
        "THIS EMPLOYMENT AGREEMENT is made on this day between {{company_name}}, a company having its registered office at {{company_address}} (the “Company”), and {{employee_name}}, residing at {{employee_address}} (the “Employee”). The Company and the Employee are together referred to as the “Parties”.",
    },
    {
      id: "appointment",
      heading: "Appointment",
      body:
        "The Company appoints the Employee as {{job_title}}, and the Employee accepts the appointment, on the terms set out in this Agreement. The Employee shall report to such person as the Company may notify from time to time and shall perform the duties reasonably associated with the role.",
    },
    {
      id: "commencement",
      heading: "Commencement",
      body:
        "The Employee's employment shall commence on {{start_date}} and shall continue unless terminated in accordance with this Agreement.",
    },
    {
      id: "compensation",
      heading: "Compensation",
      body:
        "The Company shall pay the Employee a gross annual compensation of ₹ {{salary_annual}} (cost to company), payable in equal monthly instalments after applicable statutory deductions including provident fund, professional tax and income tax withholding.",
    },
    {
      id: "probation",
      heading: "Probation",
      includeIf: { questionId: "has_probation", equals: "yes" },
      variantKey: "probation_style",
      variants: {
        simple:
          "The Employee shall be on probation for a period of {{probation_months}} months from the commencement date. On successful completion of probation, the Employee shall stand confirmed in the services of the Company.",
        extendable:
          "The Employee shall be on probation for a period of {{probation_months}} months from the commencement date. The Company may, at its sole discretion, extend the probation once by a further period not exceeding {{probation_months}} months if the Employee's performance is not found satisfactory. On successful completion of probation, the Employee shall stand confirmed in the services of the Company.",
      },
    },
    {
      id: "place_of_work",
      heading: "Place of Work",
      variantKey: "work_mode",
      variants: {
        office:
          "The Employee's primary place of work shall be the Company's offices at {{company_address}}, or such other office as the Company may reasonably designate.",
        hybrid:
          "The Employee shall work on a hybrid basis, dividing working time between the Company's offices at {{company_address}} and the Employee's residence, in accordance with the Company's hybrid working policy as amended from time to time.",
        remote:
          "The Employee shall work remotely from the Employee's residence. The Employee shall ensure a secure and productive working environment and shall attend the Company's offices when reasonably required for meetings or business needs.",
      },
    },
    {
      id: "termination",
      heading: "Termination",
      variantKey: "notice_style",
      variants: {
        "30_days":
          "Either Party may terminate this Agreement by giving the other Party 30 days' prior written notice, or salary in lieu thereof. The Company may terminate without notice for cause, including misconduct or breach of this Agreement.",
        "60_days":
          "Either Party may terminate this Agreement by giving the other Party 60 days' prior written notice, or salary in lieu thereof. The Company may terminate without notice for cause, including misconduct or breach of this Agreement.",
        as_per_law:
          "Either Party may terminate this Agreement by giving notice as required under applicable law, including the Shops and Establishments legislation applicable to the Employee's place of work. The Company may terminate without notice for cause, including misconduct or breach of this Agreement.",
      },
    },
    {
      id: "confidentiality",
      heading: "Confidentiality",
      body:
        "The Employee shall not, during employment or at any time thereafter, disclose to any person any confidential information of the Company, including business plans, client information, technical data, personal data processed under the Digital Personal Data Protection Act, 2023, and trade secrets, except as required in the proper performance of duties or by law.",
    },
    {
      id: "governing_law",
      heading: "Governing Law",
      body:
        "This Agreement shall be governed by and construed in accordance with the laws of India, and the courts having jurisdiction over the Company's registered office shall have exclusive jurisdiction.",
    },
    {
      id: "signatures",
      unnumbered: true,
      body:
        "IN WITNESS WHEREOF the Parties have executed this Agreement.\n\nFor {{company_name}} (Authorised Signatory)\n\n{{employee_name}} (Employee)",
    },
    {
      id: "witness_block",
      unnumbered: true,
      repeatOver: "witnesses",
      body: "Witness {{index}}: {{w_name}}, residing at {{w_address}}",
    },
  ],
};
