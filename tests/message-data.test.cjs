const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { runInNewContext } = require("node:vm");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "script.js"), "utf8");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const dataEnd = source.indexOf("const textEl =");
assert.ok(dataEnd > 0, "Message data must precede the browser code");
const messages = runInNewContext(`${source.slice(0, dataEnd)}; messages;`);
const curatedCount = 2182;
const normalize = (text) => text
  .normalize("NFKD")
  .toLocaleLowerCase("en")
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();

test("keeps the original 182 reflections within the expanded collection", () => {
  assert.equal(messages.length, curatedCount + 552);
  const originals = messages.slice(0, 182);
  const fingerprint = crypto.createHash("sha256").update(JSON.stringify(originals)).digest("hex");
  assert.equal(fingerprint, "993abb4442e5fce407576b533d16bbe25e3977152dbe39d399a740d2a3908267");
});

test("preserves all 2,182 curated reflections unchanged and in order", () => {
  const fingerprint = crypto.createHash("sha256")
    .update(JSON.stringify(messages.slice(0, curatedCount))).digest("hex");
  assert.equal(fingerprint, "306d4b2cc85b09673fbcc185c73c62becb03a78f7887f63bc76ea7aeafce21cf");
});

test("reflection texts are unique after case, punctuation, and whitespace normalization", () => {
  const normalized = messages.map(({ text }) => normalize(text));
  assert.equal(new Set(normalized).size, messages.length);
});

test("no repeated wrapper or closing-line templates remain", () => {
  const wrappers = /^(?:For this moment, remember|A gentle reminder|If you need a thought to carry today|Pause for a moment and remember|Let this be a small invitation|When you are ready, consider this|Perhaps today you can remember|Take a breath and hold this thought|A little room for reflection|As you continue your journey, remember|When the day feels uncertain, remember|Before you move on, consider|Here is something worth remembering|Give yourself a moment to consider|If these words meet you at the right time|For the road ahead|A thought to return to|In the middle of an ordinary day|When you need a little perspective|Let a little gentleness begin here):/i;
  const repeatedClosings = /(?:Choose the next step with care|Let kindness be part of your answer)\.?$/i;
  assert.equal(messages.filter(({ text }) => wrappers.test(text) || repeatedClosings.test(text)).length, 0);
});

test("new entries use only the established reflection categories", () => {
  const established = new Set(messages.slice(0, 182).map(({ category }) => category));
  assert.ok(messages.every(({ category }) => established.has(category)));
  assert.equal(established.size, 46);
});

test("every reflection has nonempty text and only the expected fields", () => {
  for (const [index, message] of messages.entries()) {
    assert.deepEqual(Object.keys(message).sort(), ["category", "text"]);
    assert.equal(typeof message.text, "string", `Text type at ${index}`);
    assert.ok(message.text.trim(), `Empty text at ${index}`);
  }
});

test("all 46 existing themes receive exactly 12 new reflections", () => {
  const established = new Set(messages.slice(0, 182).map(({ category }) => category));
  const counts = new Map();
  for (const { category } of messages.slice(curatedCount)) {
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  for (const category of established) {
    assert.equal(counts.get(category), 12, `New reflections for ${category}`);
  }
});

test("README avoids a fixed message/reflection count and keeps the non-revelation framing", () => {
  assert.doesNotMatch(readme, /\b\d[\d,]*\s+(?:inspirational\s+)?(?:messages?|reflections?)\b/i);
  assert.match(readme, /not claims of literal divine revelation/i);
});
