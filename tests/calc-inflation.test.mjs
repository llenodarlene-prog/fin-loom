import test from 'node:test';
import assert from 'node:assert/strict';
import { tools } from '../scripts/lib/calculators.mjs';

const e = tools.inflation;
const near = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);

test('inflation: annual averages match published BLS CPI-U values', () => {
  assert.equal(e.annual[1913].cpi, 9.9);
  assert.equal(e.annual[2023].cpi, 304.702);
  assert.equal(e.annual[2023].months, 12);
  assert.equal(e.annual[2025].months, 11, 'October 2025 was not published');
  assert.equal(e.cpiAt({ year: 2025, month: 10 }), null);
});

test('inflation: adjusted value is amount times the CPI ratio', () => {
  const r = e.inflate(100, { year: 2000 }, { year: 2023 });
  near(r.value, 100 * e.annual[2023].cpi / e.annual[2000].cpi);
  near(r.cumulative, r.value / 100 - 1);
  near(r.purchasingPower, e.annual[2000].cpi / e.annual[2023].cpi - 1);
  near(Math.pow(1 + r.averageAnnual, r.years), 1 + r.cumulative, 1e-9);
  const same = e.inflate(50, { year: 2010, month: 3 }, { year: 2010, month: 3 });
  near(same.value, 50); assert.equal(same.averageAnnual, 0);
});

test('inflation: input checks reject out-of-range and unpublished months', () => {
  assert.match(e.checkPoint({ year: 1900 }), /Enter a year/);
  assert.match(e.checkPoint({ year: 2025, month: 10 }), /did not publish/);
  assert.match(e.checkPoint({ year: e.LAST.year, month: e.LAST.month + 1 > 12 ? 12 : e.LAST.month + 1 }), e.LAST.month === 12 ? /^$/ : /latest published/);
  assert.equal(e.checkPoint({ year: 2020, month: 5 }), '');
});
