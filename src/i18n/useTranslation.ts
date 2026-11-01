import { useLanguage } from "./useLanguage";
import {
  translate,
  translateText,
  garmentName,
  formatDate,
  formatPrice,
  type TranslationKey,
} from "./core";
export function useTranslation() {
  const locale = useLanguage((s) => s.locale);
  return {
    locale,
    t: (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(locale, key, params),
    text: (value: string) => translateText(locale, value),
    garmentName: (g: Parameters<typeof garmentName>[0]) =>
      garmentName(g, locale),
    date: (value: string) => formatDate(value, locale),
    price: (value: number) => formatPrice(value, locale),
  };
}
