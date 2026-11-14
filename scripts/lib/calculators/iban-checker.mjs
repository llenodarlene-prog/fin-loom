// IBAN format checker markup.
export default function render(e, ui) {
  const r = e.check('XK05 1212 0123 4567 8906'); const v = e.outputs(r);
  const form = `<div class="finloom-calc-field"><label for="ib-iban">IBAN</label><input id="ib-iban" name="iban" type="text" autocomplete="off" spellcheck="false" maxlength="42" value="XK05 1212 0123 4567 8906" aria-describedby="ib-iban-hint"><span class="finloom-calc-hint" id="ib-iban-hint">Spaces and hyphens are ignored. The example is the Central Bank of Kosovo's published sample. Nothing you type is stored or sent.</span></div>`;
  const results = `${ui.row('Country code', 'country', v.country)}${ui.row('Check digits', 'checkDigits', v.checkDigits)}${ui.row('Length', 'length', v.length)}${ui.row('Grouped for reading', 'grouped', v.grouped)}`;
  const wide = `${ui.table('Checks Performed', ['Check', 'Result'], e.tableRows(r))}
${ui.assumptions(['MOD 97-10 (ISO 7064): move the first four characters to the end, replace each letter with two digits (A = 10 to Z = 35), divide by 97 and confirm the remainder is 1.', 'Country-specific lengths and bank code formats are not checked. Each country sets its own IBAN length.', 'A valid format does not prove the account exists, is open, or belongs to the person you expect. Confirm payment details with the recipient through a trusted channel.', 'The check runs in your browser. The IBAN is not stored or sent anywhere.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'iban-checker', title: 'IBAN Format Checker', legend: 'Check an IBAN', form, label: 'Result', big: v.big, results, summary: e.summary(r), wide });
}
