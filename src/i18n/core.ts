import en from "./en.json";
import tr from "./tr.json";
import sourceKeys from "./sourceKeys.json";
import { CATALOG } from "../domain/catalog";
import type { Garment } from "../domain/types";
export type Locale = "tr" | "en";
export type LanguageChoice = Locale | "system";
export type TranslationKey = keyof typeof en;
const messages: Record<Locale, Record<TranslationKey, string>> = { en, tr };
export const LANGUAGE_STORAGE_KEY = "wearweather.language.v1";
export function resolveLocale(
  choice: LanguageChoice,
  languages: readonly string[],
): Locale {
  if (choice !== "system") return choice;
  for (const tag of languages) {
    const language = tag.toLowerCase().replace(/_/g, "-").split("-")[0];
    if (language === "tr" || language === "en") return language;
  }
  return "en";
}
export function decodeLanguageChoice(raw: string | null): LanguageChoice {
  try {
    const value: unknown = raw ? JSON.parse(raw) : "system";
    return value === "en" || value === "tr" ? value : "system";
  } catch {
    return "system";
  }
}
export function translate(
  locale: Locale,
  key: TranslationKey,
  params: Record<string, string | number> = {},
): string {
  return (messages[locale][key] ?? en[key]).replace(
    /\{(\w+)\}/g,
    (match, name) =>
      params[name] !== undefined ? String(params[name]) : match,
  );
}
// Compatibility for the original local catalog and deterministic engine outputs.
// Screen copy uses stable dictionary keys. User-authored names never go through this adapter.
export function translateText(locale: Locale, source: string): string {
  const key = (sourceKeys as Record<string, TranslationKey>)[source];
  return key ? translate(locale, key) : source;
}
export function garmentName(garment: Garment, locale: Locale): string {
  const original = CATALOG.find((c) => c.category === garment.category)?.label;
  if (garment.nameSource === "custom" || garment.name !== original)
    return garment.name;
  return translateText(locale, original ?? garment.name);
}
export function catalogName(
  category: Garment["category"],
  locale: Locale,
): string {
  return translateText(
    locale,
    CATALOG.find((c) => c.category === category)!.label,
  );
}
export function formatDate(date: string, locale: Locale): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
}
export function formatPrice(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "tr" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  }).format(value);
}
