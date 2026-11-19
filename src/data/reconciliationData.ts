export type LedgerCategory = 'fixed-asset' | 'vendor-master';

export type MismatchSeverity = 'High Impact' | 'Compliance Risk' | 'Record Hygiene';

export interface SampleMismatchRow {
  id: string;
  category: LedgerCategory;
  recordCode: string;
  itemName: string;
  erpSystem: 'SAP' | 'Tally Prime' | 'SAP + Excel';
  issueType: string;
  severity: MismatchSeverity;
  bookValueInr: string;
  exposureInr: string;
  rootCause: string;
  recommendedFix: string;
}

export interface CompetitorRow {
  dimension: string;
  inHouse: string;
  localCa: string;
  bigFour: string;
  sahiKhata: string;
}

export const SAMPLE_MISMATCHES: SampleMismatchRow[] = [
  {
    id: 'fa-1',
    category: 'fixed-asset',
    recordCode: 'FA-1042',
    itemName: 'CNC Turning Centre — Unit 2',
    erpSystem: 'SAP',
    issueType: 'Wrong Depreciation Key',
    severity: 'High Impact',
    bookValueInr: '₹28,40,000',
    exposureInr: '₹2,14,000 / yr',
    rootCause:
      'Asset capitalised under generic Plant & Machinery key (SLM 5%) instead of multi-shift CNC useful-life policy (WDV 15%).',
    recommendedFix:
      'Re-assign depreciation key to match company schedule II useful life and post prior-period adjustment note before statutory audit.',
  },
  {
    id: 'fa-2',
    category: 'fixed-asset',
    recordCode: 'FA-1088',
    itemName: 'Cooling Tower Circulating Pump',
    erpSystem: 'Tally Prime',
    issueType: 'Ghost / Disposed Asset on Books',
    severity: 'Compliance Risk',
    bookValueInr: '₹4,95,000',
    exposureInr: '₹4,95,000',
    rootCause:
      'Scrapped during FY24 plant maintenance; scrap sale receipt booked under miscellaneous income without retiring the fixed asset card.',
    recommendedFix:
      'Issue asset retirement memo signed by plant head, reverse accumulated depreciation, and record gain/loss on disposal.',
  },
  {
    id: 'fa-3',
    category: 'fixed-asset',
    recordCode: 'FA-1127',
    itemName: '30 kVA Voltage Stabilizer',
    erpSystem: 'SAP + Excel',
    issueType: 'Physical Location Mismatch',
    severity: 'Record Hygiene',
    bookValueInr: '₹3,20,000',
    exposureInr: 'Audit Remark',
    rootCause:
      'Transferred from Selaqui Shed A to Haridwar Assembly Bay in Q2 without updating cost-centre and physical verification tag.',
    recommendedFix:
      'Update asset cost-centre master and affix QR/metal verification tag matching the reconciled register.',
  },
  {
    id: 'fa-4',
    category: 'fixed-asset',
    recordCode: 'FA-1194',
    itemName: 'Hydraulic Press Frame & Die Set',
    erpSystem: 'SAP',
    issueType: 'Useful-Life Mismatch',
    severity: 'High Impact',
    bookValueInr: '₹16,80,000',
    exposureInr: '₹1,68,000 / yr',
    rootCause:
      'Consumable dies bundled with heavy press capitalization under a 15-year useful life instead of separate 3-year tooling classification.',
    recommendedFix:
      'Split sub-asset lines for dies and tooling so depreciation reflects actual wear and avoids audit qualification.',
  },
  {
    id: 'vm-1',
    category: 'vendor-master',
    recordCode: 'V-2091 / V-2144',
    itemName: 'Shivalik Corrugated Packaging',
    erpSystem: 'SAP',
    issueType: 'Duplicate Vendor Master',
    severity: 'High Impact',
    bookValueInr: '₹14,20,000',
    exposureInr: '₹1,85,000 risk',
    rootCause:
      'Created twice—once by purchasing (MM) using trade name and once by accounts (FI) using legal GST name—splitting open advances and payables.',
    recommendedFix:
      'Block V-2144 for posting, merge open line items onto primary GSTIN-verified code V-2091, and enforce PAN check on onboarding.',
  },
  {
    id: 'vm-2',
    category: 'vendor-master',
    recordCode: 'V-2038',
    itemName: 'Doon Precision Tooling Pvt Ltd',
    erpSystem: 'Tally Prime',
    issueType: 'Payment Terms Conflict',
    severity: 'Compliance Risk',
    bookValueInr: '₹9,60,000',
    exposureInr: 'MSME 43B(h)',
    rootCause:
      'Purchase order agreed on 45-day MSME terms, while Tally ledger remained at 90 days—risking Section 43B(h) tax disallowance.',
    recommendedFix:
      'Tag MSME Udyam category in vendor master, align credit period to 45 days, and flag aging invoices in monthly payable sheet.',
  },
  {
    id: 'vm-3',
    category: 'vendor-master',
    recordCode: 'V-2219',
    itemName: 'Kumaon Industrial Lubricants',
    erpSystem: 'SAP + Excel',
    issueType: 'FI / MM Mapping & TDS Error',
    severity: 'Compliance Risk',
    bookValueInr: '₹6,45,000',
    exposureInr: 'TDS Shortfall',
    rootCause:
      'Freight and supply bills mapped to wrong reconciliation GL and missing 194C/194Q threshold flag in vendor withholding tab.',
    recommendedFix:
      'Correct reconciliation account mapping and update withholding tax type before quarterly TDS return filing.',
  },
];

export const COMPETITOR_MATRIX: CompetitorRow[] = [
  {
    dimension: 'Primary Focus',
    inHouse: 'Daily invoicing, GST, TDS, and vendor bills',
    localCa: 'Bookkeeping, tax returns, and statutory audit',
    bigFour: 'Large enterprise advisory & ERP transformations',
    sahiKhata: 'Fixed asset & vendor master reconciliation only',
  },
  {
    dimension: 'Typical Engagement Fee',
    inHouse: '₹0 upfront (hidden rework & penalty cost)',
    localCa: '₹10,000–40,000 (rushed pre-audit clean-up)',
    bigFour: '₹2,00,000+ per engagement',
    sahiKhata: '₹15,000–30,000 fixed fee (₹10–15k pilot)',
  },
  {
    dimension: 'Root-Cause Analysis',
    inHouse: 'Reactive patch in Excel when error surfaces',
    localCa: 'Rarely documented; done under audit deadline',
    bigFour: 'Comprehensive, built for ₹250 Cr+ teams',
    sahiKhata: 'Line-by-line mismatch log, cause & fix list',
  },
  {
    dimension: 'Tools & Output',
    inHouse: 'Manual Tally / Excel edits from memory',
    localCa: 'Year-end adjustment entries without dashboards',
    bigFour: 'Heavy enterprise reporting suites',
    sahiKhata: 'SAP / Tally native review + Excel & Power BI brief',
  },
  {
    dimension: 'Fit for ₹10–50 Cr MSMEs',
    inHouse: 'Overloaded 1–2 person accounts team',
    localCa: 'Treats reconciliation as low-priority side work',
    bigFour: 'Overpriced and distant from local industrial belts',
    sahiKhata: 'Built specifically for Haridwar, Selaqui & Rudrapur',
  },
];

export interface PricingTierResult {
  feeInr: number;
  turnaroundDays: string;
  deliverables: string[];
  monthlyRetainerOption: string;
}

export function calculateHealthCheckEstimate(params: {
  erp: 'tally' | 'sap' | 'excel';
  assetBand: 'small' | 'medium' | 'large';
  vendorAddon: boolean;
  isPilot: boolean;
}): PricingTierResult {
  const baseByAsset: Record<'small' | 'medium' | 'large', number> = {
    small: 15000, // 50-200 assets
    medium: 25000, // 200-500 assets
    large: 35000, // 500+ assets
  };

  let fee = baseByAsset[params.assetBand];
  if (params.erp === 'sap') {
    fee += 5000;
  }
  if (params.vendorAddon) {
    fee += 10000;
  }

  if (params.isPilot) {
    fee = Math.min(15000, Math.max(10000, Math.round(fee * 0.45 / 1000) * 1000));
  } else {
    fee = Math.min(50000, fee);
  }

  const daysMap: Record<'small' | 'medium' | 'large', string> = {
    small: params.vendorAddon ? '5–7 business days' : '4–5 business days',
    medium: params.vendorAddon ? '8–10 business days' : '6–8 business days',
    large: params.vendorAddon ? '12–14 business days' : '9–11 business days',
  };

  const deliverables = [
    'Fixed Asset Register vs Physical Verification Diff Sheet',
    'Depreciation Key & Useful-Life Mismatch Audit Log',
    'Root-Cause & Actionable Fix List for Accounts Team',
    '1-Page Plain-Language Summary for Promoter-Owner',
    'Signed Confidentiality & Data Handling Note',
  ];

  if (params.vendorAddon) {
    deliverables.push('Vendor Master Duplicate, Payment-Term & FI/MM Mapping Review');
  }

  return {
    feeInr: fee,
    turnaroundDays: daysMap[params.assetBand],
    deliverables,
    monthlyRetainerOption: 'Optional ₹10,000–25,000/mo Power BI & monthly clean-up retainer after pilot',
  };
}
