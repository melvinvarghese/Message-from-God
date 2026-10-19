const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');

// Evaluate only the real message data; browser behavior is unchanged by this task.
const source = readFileSync(join(__dirname, '..', 'script.js'), 'utf8');
const dataEnd = source.indexOf('const textEl =');
assert.ok(dataEnd > 0, 'Message data must precede the browser code');
const messages = runInNewContext(`${source.slice(0, dataEnd)}; messages;`);
const originalCount = 10000;
const categories = new Set([
  'COURAGE & NEW BEGINNINGS', 'WISDOM & ACCEPTANCE', 'SELF-WORTH & REST',
  'KINDNESS & CONNECTION', 'HEALING & HOPE', 'PRESENCE & PEACE',
  'TRUST & UNCERTAINTY', 'COMPASSION & SELF-CARE', 'GOODNESS & PURPOSE',
  'REST & RENEWAL', 'COURAGE & SUPPORT', 'RELEASE & CLARITY',
  'RESILIENCE & HOPE', 'UNDERSTANDING & RESPECT', 'GROWTH & CHANGE',
  'GRATITUDE & HONESTY', 'PEACE IN THE EVERYDAY', 'LOVE & ACCEPTANCE',
  'FORGIVENESS & REPAIR', 'PATIENCE & GROWTH', 'COURAGE & BOUNDARIES',
  'RESILIENCE & CARE', 'PURPOSE & COURAGE', 'EMPATHY & KINDNESS',
  'HEALING & PATIENCE', 'BELONGING & ACCEPTANCE', 'PROGRESS & PURPOSE',
  'WONDER & OPENNESS', 'HARD DAYS & SUPPORT', 'HOPE & POSSIBILITY',
  'HONESTY & GRACE', 'GRATITUDE & GROWTH', 'FRESH STARTS',
  'FRIENDSHIP & CARE', 'PRESENCE & GROWTH', 'PATIENCE & PEACE',
  'PEACE & PRESENCE', 'KINDNESS & COMPASSION', 'HOPE & RESILIENCE',
  'REST & SELF-WORTH', 'WISDOM & CLARITY', 'GRATITUDE & WONDER',
  'PURPOSE & SERVICE', 'BELONGING & CONNECTION', 'PATIENCE & CHANGE',
  'UNCERTAINTY & TRUST',
]);

const normalize = (text) => text.normalize('NFKC').toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

test('adds at least 500 reflections to the original collection', () => {
  assert.ok(messages.length >= originalCount + 500,
    `Expected at least ${originalCount + 500} reflections, found ${messages.length}`);
});

test('every reflection has nonempty text and an existing category label', () => {
  for (const [index, message] of messages.entries()) {
    assert.deepEqual(Object.keys(message).sort(), ['category', 'text']);
    assert.equal(typeof message.text, 'string', `Text type at ${index}`);
    assert.ok(message.text.trim(), `Empty text at ${index}`);
    assert.ok(categories.has(message.category), `Invalid category at ${index}: ${message.category}`);
  }
});

test('the entire collection contains no duplicate text', () => {
  const seen = new Set();
  for (const message of messages) {
    assert.ok(!seen.has(message.text), `Duplicate text: ${message.text}`);
    seen.add(message.text);
  }
});

test('new reflections remain unique after case, punctuation and spacing normalization', () => {
  const seen = new Set(messages.slice(0, originalCount).map(({ text }) => normalize(text)));
  for (const { text } of messages.slice(originalCount)) {
    const key = normalize(text);
    assert.ok(!seen.has(key), `Repeated normalized text: ${text}`);
    seen.add(key);
  }
});

test('all 46 existing themes receive at least 12 new reflections', () => {
  const counts = new Map();
  for (const { category } of messages.slice(originalCount)) {
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  for (const category of categories) {
    assert.ok(counts.get(category) >= 12, `Missing new reflections for ${category}`);
  }
});
