import { PRODUCTS } from "@/lib/checkout";

export const BOOTCAMP_START_PRICE = 99;
export const BOOTCAMP_NEXT_PRICE = 119;
export const BOOTCAMP_FUTURE_PRICE_STEPS = [189, 229, 319];
// Current price is owned by checkout config so UI, analytics, and Flitt button updates stay in sync.
export const BOOTCAMP_CURRENT_PRICE = PRODUCTS.bootcamp.value;
export const BOOTCAMP_FULL_PRICE = 449;
export const BOOTCAMP_PRICE_STEPS = [
  BOOTCAMP_START_PRICE,
  BOOTCAMP_NEXT_PRICE,
  BOOTCAMP_CURRENT_PRICE,
  ...BOOTCAMP_FUTURE_PRICE_STEPS,
  BOOTCAMP_FULL_PRICE,
];
export const BOOTCAMP_PRICE_INCREASE_DEADLINE = new Date("2026-06-30T23:59:59+04:00").getTime();

export const formatGel = (value: number) => `₾${value}`;

export const BOOTCAMP_CURRENT_PRICE_LABEL = formatGel(BOOTCAMP_CURRENT_PRICE);
export const BOOTCAMP_FULL_PRICE_LABEL = formatGel(BOOTCAMP_FULL_PRICE);
export const BOOTCAMP_SAVINGS = BOOTCAMP_FULL_PRICE - BOOTCAMP_CURRENT_PRICE;
export const BOOTCAMP_SAVINGS_LABEL = formatGel(BOOTCAMP_SAVINGS);
export const BOOTCAMP_CURRENT_PRICE_STEP_INDEX = Math.max(0, BOOTCAMP_PRICE_STEPS.indexOf(BOOTCAMP_CURRENT_PRICE));
export const BOOTCAMP_PRICE_PROGRESS = Math.round(
  (BOOTCAMP_CURRENT_PRICE_STEP_INDEX / (BOOTCAMP_PRICE_STEPS.length - 1)) * 100
);
