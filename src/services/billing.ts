export type BillingPlan = "monthly" | "annual";
export const PLANS = {
  monthly: { label: "Aylık", amount: 3.99, price: "$3,99", period: "/ ay" },
  annual: { label: "Yıllık", amount: 29.99, price: "$29,99", period: "/ yıl" },
};
export interface BillingProvider {
  activate(plan: BillingPlan): Promise<{ demo: true }>;
}
export const demoBilling: BillingProvider = {
  async activate(_plan) {
    return { demo: true };
  },
};
