// import store from '@/store';

function getRules() {
  // const { invoiceLength } = store.state.settings;
  const templ = {
    required: [v => !!v || `Can't be empty`],
    requiredSelect: [v => (v && v > 0) || 'Please select an item'],
    integersOnly: [v => !v || /^\d+$/.test(v) || 'Integers only'],
    numbersOnly: [v => !v || /[0-9]*\.?[0-9]*/.test(v) || 'Numbers only'],
    invoices: [v => (v && v.length > 0) || 'Enter at least 1 invoice'],
    noZero: [v => parseFloat(v) > 0 || "Can't be 0"],
  };

  const rules = {};
  for (const ruleName of arguments) {
    if (typeof ruleName == 'string') {
      if (templ.hasOwnProperty(ruleName)) rules[ruleName] = templ[ruleName];
      else console.warn(`Rule '${ruleName}' not supported.`);
    } else
      console.warn(`Expected rule typeof string, but got ${typeof ruleName}.`);
  }
  return { rules };
}

export default getRules;
