// Mock cash-buyer list for dispo. Replace with Supabase-backed data in Phase 1.

import type { Buyer, Lead } from "../types";

export const MOCK_BUYERS: Buyer[] = [
  {
    id: "buyer_1",
    name: "Marcus Reed",
    company: "Reed Capital Homes",
    phone: "4045550101",
    email: "marcus@reedcapital.com",
    buyBox: {
      states: ["GA"],
      cities: ["Atlanta", "Decatur"],
      propertyTypes: ["single_family", "townhouse"],
      minBeds: 3,
      maxPrice: 250_000,
      minRoiPct: 15,
      strategy: ["flip", "brrrr"],
    },
    proofOfFunds: true,
    dealsClosedWithUs: 7,
    reliabilityScore: 92,
    createdAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "buyer_2",
    name: "Priya Shah",
    company: "Evergreen Rentals LLC",
    phone: "4045550102",
    email: "priya@evergreenrentals.com",
    buyBox: {
      states: ["GA"],
      propertyTypes: ["single_family", "multi_family"],
      minBeds: 2,
      maxPrice: 400_000,
      minRoiPct: 10,
      strategy: ["buy_hold", "brrrr"],
    },
    proofOfFunds: true,
    dealsClosedWithUs: 3,
    reliabilityScore: 78,
    createdAt: "2026-03-02T00:00:00.000Z",
  },
  {
    id: "buyer_3",
    name: "Dominic Fisher",
    company: "Flip City Investments",
    phone: "4045550103",
    email: "dom@flipcity.com",
    buyBox: {
      states: ["GA", "AL"],
      cities: ["Atlanta", "Marietta", "College Park"],
      propertyTypes: ["single_family"],
      maxPrice: 200_000,
      minRoiPct: 20,
      strategy: ["flip"],
    },
    proofOfFunds: false,
    dealsClosedWithUs: 1,
    reliabilityScore: 55,
    createdAt: "2026-05-20T00:00:00.000Z",
  },
];

/**
 * Match a lead to buyers whose buy-box fits. Ranked by reliability so we
 * pitch the buyers most likely to actually close first.
 */
export function matchBuyers(lead: Lead, buyers: Buyer[] = MOCK_BUYERS): Buyer[] {
  const { property, analysis } = lead;
  const price = analysis?.mao;
  return buyers
    .filter((b) => {
      if (!b.buyBox.states.includes(property.address.state)) return false;
      if (b.buyBox.cities?.length && !b.buyBox.cities.includes(property.address.city))
        return false;
      if (!b.buyBox.propertyTypes.includes(property.propertyType)) return false;
      if (b.buyBox.minBeds && property.beds < b.buyBox.minBeds) return false;
      if (b.buyBox.maxPrice && typeof price === "number" && price > b.buyBox.maxPrice)
        return false;
      return true;
    })
    .sort((a, b) => b.reliabilityScore - a.reliabilityScore);
}
