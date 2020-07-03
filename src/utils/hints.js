import store from '@/store';

function getHints() {
  const { invoiceLength } = store.state.settings;
  const templ = {
    invoices: `Invoices must contain exactly ${invoiceLength} digits, separated by spaces or commas`,
    readonly: 'Field is read-only',
  };

  const hints = {};
  for (const hintName of arguments) {
    if (typeof hintName == 'string') {
      if (templ.hasOwnProperty(hintName)) hints[hintName] = templ[hintName];
      else console.warn(`Hint '${hintName}' not supported.`);
    } else
      console.warn(`Expected hint typeof string, but got ${typeof hintName}.`);
  }
  return { hints };
}

export default getHints;
