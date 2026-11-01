import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_REMINDERS,
  OWN_PREFIX,
  decodeReminderRecord,
  validateReminderSettings,
  makeMorningContent,
  saveReminders,
  cancelOwned,
  sendReminderTest,
  isMorningNotification,
  type ReminderAdapter,
  type ReminderRecord,
} from "./core";
import { DEFAULT_PREFERENCES, garmentFor, SCENARIOS } from "../domain/catalog";
const content = { title: "WearWeather · Demo", body: "Demo clothing plan" };
function fake() {
  const ids = new Set<string>([OWN_PREFIX + "old", "other-feature"]);
  let requests = 0;
  let scheduled = 0;
  let permission = "granted";
  let failAt = 0;
  const calls: number[] = [];
  const adapter: ReminderAdapter = {
    supported: true,
    async getPermission() {
      return permission as "granted" | "denied";
    },
    async requestPermission() {
      requests++;
      return permission as "granted" | "denied";
    },
    async list() {
      return [...ids];
    },
    async cancel(id) {
      ids.delete(id);
    },
    async scheduleWeekly(day, _hour, _minute, _content) {
      calls.push(day);
      scheduled++;
      if (scheduled === failAt) throw Error("schedule");
      const id = OWN_PREFIX + "new" + scheduled;
      ids.add(id);
      return id;
    },
    async scheduleTest() {
      const id = OWN_PREFIX + "test";
      ids.add(id);
      return id;
    },
  };
  const writes: ReminderRecord[] = [];
  return {
    adapter,
    ids,
    calls,
    writes,
    get requests() {
      return requests;
    },
    deny() {
      permission = "denied";
    },
    failAt(n: number) {
      failAt = n;
    },
    repo: {
      async write(record: ReminderRecord) {
        writes.push(record);
      },
    },
  };
}
test("settings validate hour/minute and unique Sunday-based weekdays", () => {
  assert.equal(
    validateReminderSettings({ ...DEFAULT_REMINDERS, enabled: true }),
    true,
  );
  for (const time of ["24:00", "7:30", "08:60"])
    assert.equal(
      validateReminderSettings({ ...DEFAULT_REMINDERS, time }),
      false,
    );
  assert.equal(
    validateReminderSettings({
      ...DEFAULT_REMINDERS,
      enabled: true,
      weekdays: [],
    }),
    false,
  );
  assert.equal(
    validateReminderSettings({ ...DEFAULT_REMINDERS, weekdays: [2, 2] }),
    false,
  );
  assert.equal(
    validateReminderSettings({ ...DEFAULT_REMINDERS, weekdays: [0, 8] }),
    false,
  );
});
test("corrupt or future reminder records are not treated as valid active plans", () => {
  assert.equal(decodeReminderRecord(null).settings.enabled, false);
  assert.throws(() => decodeReminderRecord("bad"));
  assert.throws(() => decodeReminderRecord(JSON.stringify({ version: 2 })));
});
test("demo content contains owned custom names, demo label and translated weather", () => {
  const clothes = [
    garmentFor("tee"),
    {
      ...garmentFor("knit"),
      name: "Lacivert kazağım",
      nameSource: "custom" as const,
    },
    garmentFor("jacket"),
  ];
  const en = makeMorningContent(
    clothes,
    DEFAULT_PREFERENCES,
    SCENARIOS[0],
    "en",
  );
  assert.ok(en.title.includes("DEMO"));
  assert.ok(en.body.includes("Lacivert kazağım"));
  assert.ok(en.body.includes("London"));
  assert.ok(!en.body.includes("Yağmurluk"));
  const tr = makeMorningContent(
    clothes,
    DEFAULT_PREFERENCES,
    SCENARIOS[0],
    "tr",
  );
  assert.ok(tr.body.includes("Londra"));
  assert.throws(() =>
    makeMorningContent([], DEFAULT_PREFERENCES, SCENARIOS[0], "en"),
  );
});
test("save replaces only owned requests and uses selected weekday/hour/minute", async () => {
  const f = fake();
  const settings = {
    ...DEFAULT_REMINDERS,
    enabled: true,
    weekdays: [2, 6],
    time: "07:45",
  };
  const record = await saveReminders(f.adapter, f.repo, settings, content);
  assert.deepEqual(f.calls, [2, 6]);
  assert.ok(f.ids.has("other-feature"));
  assert.ok(!f.ids.has(OWN_PREFIX + "old"));
  assert.equal(record.settings.enabled, true);
  assert.equal(f.writes[0].settings.enabled, false);
  assert.equal(f.writes.at(-1)?.settings.enabled, true);
});
test("permission denial never cancels or pretends to save an active schedule", async () => {
  const f = fake();
  f.deny();
  await assert.rejects(
    saveReminders(
      f.adapter,
      f.repo,
      { ...DEFAULT_REMINDERS, enabled: true },
      content,
    ),
    /permission_denied/,
  );
  assert.ok(f.ids.has(OWN_PREFIX + "old"));
  assert.equal(f.writes.length, 0);
});
test("partial scheduling failure rolls back new reminders and persists disabled state", async () => {
  const f = fake();
  f.failAt(2);
  await assert.rejects(
    saveReminders(
      f.adapter,
      f.repo,
      { ...DEFAULT_REMINDERS, enabled: true },
      content,
    ),
  );
  assert.deepEqual([...f.ids], ["other-feature"]);
  assert.equal(f.writes.at(-1)?.settings.enabled, false);
});
test("turning off cancels owned schedules and tests without requesting permission", async () => {
  const f = fake();
  f.ids.add(OWN_PREFIX + "test");
  await saveReminders(f.adapter, f.repo, DEFAULT_REMINDERS, null);
  assert.equal(f.requests, 0);
  assert.deepEqual([...f.ids], ["other-feature"]);
});
test("web cannot enable a real reminder or send a test", async () => {
  const f = fake();
  f.adapter.supported = false;
  await assert.rejects(
    saveReminders(
      f.adapter,
      f.repo,
      { ...DEFAULT_REMINDERS, enabled: true },
      content,
    ),
    /unsupported/,
  );
  await assert.rejects(sendReminderTest(f.adapter, content), /unsupported/);
  assert.equal(f.writes.length, 0);
});
test("storage failure before scheduling preserves existing reminders", async () => {
  const f = fake();
  await assert.rejects(
    saveReminders(
      f.adapter,
      {
        async write() {
          throw Error("storage");
        },
      },
      { ...DEFAULT_REMINDERS, enabled: true },
      content,
    ),
    /storage_failed/,
  );
  assert.ok(f.ids.has(OWN_PREFIX + "old"));
});
test("a failed final persistence rolls back the newly scheduled reminders", async () => {
  const f = fake();
  let count = 0;
  await assert.rejects(
    saveReminders(
      f.adapter,
      {
        async write() {
          if (++count === 2) throw Error("disk");
        },
      },
      { ...DEFAULT_REMINDERS, enabled: true },
      content,
    ),
    /storage_failed/,
  );
  assert.deepEqual([...f.ids], ["other-feature"]);
});
test("notification taps accept only our known marker and internal Today route", () => {
  assert.equal(
    isMorningNotification({ kind: "wearweather-morning-demo", url: "/" }),
    true,
  );
  assert.equal(
    isMorningNotification({
      kind: "wearweather-morning-demo",
      url: "https://evil.test",
    }),
    false,
  );
  assert.equal(isMorningNotification({ kind: "other", url: "/" }), false);
});
test("cancel helper does not touch unrelated notification identifiers", async () => {
  const f = fake();
  await cancelOwned(f.adapter);
  assert.deepEqual([...f.ids], ["other-feature"]);
});

test("turning off still cancels device reminders when storage is unavailable", async () => {
  const f = fake();
  await assert.rejects(
    saveReminders(
      f.adapter,
      {
        async write() {
          throw Error("disk");
        },
      },
      DEFAULT_REMINDERS,
      null,
    ),
    /storage_failed/,
  );
  assert.deepEqual([...f.ids], ["other-feature"]);
});
