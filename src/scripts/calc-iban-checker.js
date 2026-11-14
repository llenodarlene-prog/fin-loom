// Fin Loom IBAN format checker. Checks the structure (two-letter country code, two check digits, then
// letters and digits) and the ISO 7064 MOD 97-10 check: move the first four characters to the end,
// replace letters with numbers (A = 10 … Z = 35) and confirm the remainder after dividing by 97 is 1.
// A valid result does not show that the account exists or who owns it. Nothing is stored or sent.
(function (root) {
  'use strict';

  const kit = root.FinLoomCalc;

  const clean = s => String(s || '').replace(/[\s-]/g, '').toUpperCase();
  function mod97(digits) { let r = 0; for (const ch of digits) r = (r * 10 + Number(ch)) % 97; return r; }
  const numeric = s => s.replace(/[A-Z]/g, ch => String(ch.charCodeAt(0) - 55));

  function check(raw) {
    const iban = clean(raw);
    const steps = [];
    const structure = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(iban);
    steps.push(['Starts with a two-letter country code and two check digits', /^[A-Z]{2}[0-9]{2}/.test(iban)]);
    steps.push(['Contains only letters and digits, 5 to 34 characters', /^[A-Z0-9]{5,34}$/.test(iban)]);
    let remainder = null;
    if (structure) { remainder = mod97(numeric(iban.slice(4) + iban.slice(0, 4))); }
    steps.push(['MOD 97-10 check digits are correct (remainder is 1)', remainder === 1]);
    const valid = structure && remainder === 1;
    const expected = structure ? String(98 - mod97(numeric(iban.slice(4) + iban.slice(0, 2) + '00'))).padStart(2, '0') : null;
    return { iban, valid, steps, remainder, country: iban.slice(0, 2), checkDigits: iban.slice(2, 4), expected, bban: iban.slice(4), grouped: iban.replace(/(.{4})/g, '$1 ').trim() };
  }

  function summary(r) {
    if (!r.iban) return 'Enter an IBAN to check its format.';
    if (r.valid) return `${r.grouped} passes the format and MOD 97 check-digit test. That means it is correctly formed, not that the account exists or belongs to a particular person.`;
    if (r.expected && r.expected !== r.checkDigits) return `${r.grouped} fails the check-digit test. For the rest of this number, the check digits would need to be ${r.expected}, not ${r.checkDigits}. Check for a typing error.`;
    return `${r.grouped || r.iban} is not a correctly formed IBAN. Check that it starts with a country code and contains only letters and digits.`;
  }

  function outputs(r) {
    return { big: !r.iban ? 'Enter an IBAN' : r.valid ? 'Valid format' : 'Not valid', country: r.country || '—', checkDigits: r.checkDigits || '—', length: String(r.iban.length), grouped: r.grouped || '—' };
  }

  function tableRows(r) { return r.steps.map(([label, ok]) => `<tr><th scope="row">${label}</th><td class="num">${ok ? 'Pass' : 'Fail'}</td></tr>`).join(''); }

  const engine = { clean, mod97, numeric, check, summary, outputs, tableRows };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (typeof document === 'undefined') return;

  kit.register('iban-checker', box => {
    const form = box.querySelector('form');
    const run = () => {
      const r = check(form.elements.iban.value); const values = outputs(r);
      box.querySelectorAll('[data-out]').forEach(el => { el.textContent = values[el.dataset.out]; });
      box.querySelector('[data-summary]').textContent = summary(r);
      box.querySelector('tbody').innerHTML = tableRows(r);
    };
    kit.live(form, run);
  });
})(typeof window === 'undefined' ? globalThis : window);
