import test from "node:test";
import assert from "node:assert/strict";
import en from "./en.json";
import tr from "./tr.json";
import {
  resolveLocale,
  translate,
  translateText,
  garmentName,
  formatDate,
  decodeLanguageChoice,
} from "./core";
import { garmentFor } from "../domain/catalog";
test("launch dictionaries have identical keys and interpolation placeholders", () => {
  assert.deepEqual(Object.keys(tr).sort(), Object.keys(en).sort());
  for (const key of Object.keys(en)) {
    const k = key as keyof typeof en;
    assert.ok(en[k].trim());
    assert.ok(tr[k].trim());
    assert.deepEqual(en[k].match(/\{\w+\}/g), tr[k].match(/\{\w+\}/g));
  }
});
test("system language follows supported preferences and falls back to English", () => {
  assert.equal(resolveLocale("system", ["de-DE", "tr-TR"]), "tr");
  assert.equal(resolveLocale("system", ["fr-FR"]), "en");
  assert.equal(resolveLocale("system", ["tr_TR"]), "tr");
  assert.equal(resolveLocale("en", ["tr-TR"]), "en");
  assert.equal(resolveLocale("tr", ["en-US"]), "tr");
});
test("legacy default names translate but custom names never do", () => {
  const original = garmentFor("knit");
  assert.equal(garmentName(original, "en"), "Light sweater");
  const custom = {
    ...original,
    name: "Lacivert kazağım",
    nameSource: "custom" as const,
  };
  assert.equal(garmentName(custom, "en"), "Lacivert kazağım");
  assert.equal(
    garmentName({ ...original, nameSource: "custom" }, "en"),
    "İnce kazak",
  );
  assert.equal(
    garmentName({ ...original, name: "My sweater" }, "tr"),
    "My sweater",
  );
});
test("engine messages and city names use the active locale", () => {
  assert.equal(
    translateText("en", "Su geçirmez yağmur koruması eksik."),
    "Waterproof rain protection is missing.",
  );
  assert.equal(translateText("en", "Londra"), "London");
  assert.equal(translateText("tr", "Londra"), "Londra");
});
test("invalid saved language choices recover to system without accepting arbitrary locales", () => {
  assert.equal(decodeLanguageChoice(null), "system");
  assert.equal(decodeLanguageChoice('"tr"'), "tr");
  assert.equal(decodeLanguageChoice('"en"'), "en");
  assert.equal(decodeLanguageChoice('"de"'), "system");
  assert.equal(decodeLanguageChoice("garbage"), "system");
});
test("interpolation and dates follow the selected language", () => {
  assert.equal(
    translate("en", "journey_departure", { time: "08:15" }),
    "08:15 outbound",
  );
  assert.equal(
    translate("tr", "journey_departure", { time: "08:15" }),
    "08:15 gidiş",
  );
  assert.notEqual(
    formatDate("2026-10-28", "en"),
    formatDate("2026-10-28", "tr"),
  );
});
