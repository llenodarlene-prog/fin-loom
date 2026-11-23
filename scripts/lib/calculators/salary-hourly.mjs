// Salary to hourly calculator markup.
export default function render(e, ui) {
  const o = { salary: 60000, hours: 40, days: 5, weeks: 52, pto: 15 };
  const r = e.convert(o); const v = e.outputs(o, r);
  const form = `${ui.field('sh-salary', 'Annual salary ($)', 'min="1" max="100000000" step="0.01" value="60000" required')}
${ui.field('sh-hours', 'Paid hours per week', 'min="1" max="100" step="0.5" value="40" required')}
${ui.field('sh-days', 'Workdays per week', 'min="1" max="7" step="1" value="5" required')}
${ui.field('sh-weeks', 'Paid weeks per year', 'min="1" max="52" step="1" value="52" required', 'Use 52 for a salaried job that pays every week of the year.')}
${ui.field('sh-pto', 'Paid days off per year', 'min="0" max="260" step="1" value="15"', 'Vacation, holidays and sick days that are paid but not worked.')}`;
  const results = `${ui.row('Daily pay', 'daily', v.daily)}${ui.row('Weekly pay', 'weekly', v.weekly)}${ui.row('Biweekly pay', 'biweekly', v.biweekly)}${ui.row('Monthly pay', 'monthly', v.monthly)}${ui.row('Paid hours per year', 'paidHours', v.paidHours)}${ui.row('Pay per hour actually worked', 'effective', v.effective)}`;
  const wide = `${ui.table('Hourly Pay for Common Salaries', ['Annual Salary', 'Hourly Pay', 'Monthly Pay'], e.tableRows(o))}
${ui.assumptions(['Hourly pay = annual salary ÷ (paid hours per week × paid weeks per year).', 'Pay per hour actually worked divides the salary by paid hours minus paid days off.', 'All figures are before taxes, retirement contributions and other payroll deductions.', 'Overtime, bonuses and benefits are not included.'])}
${ui.disclaimer()}`;
  return ui.layout({ type: 'salary-hourly', title: 'Salary to Hourly Calculator', legend: 'Your Pay', form, label: 'Hourly pay (before tax)', big: v.big, results, summary: e.summary(o, r), wide });
}
