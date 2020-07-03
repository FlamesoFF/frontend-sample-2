import store from '@/store';

const getPatterns = () => ({
  // invoices: /((\d{6}(?![\d\w]{1}))|(([,;\/\\ ])([\d]{6})[,;\/\\ ]))/g,
  invoices: {
    separator: /[;,/\\ ]/,
    string: new RegExp(`^\\d{${store.state.settings.invoiceLength}}(:\\d+)?$`),
    // pattern: /^\d{6}(:\d+)?$/,
  },
  // invoices: /((\d{6})|(\d{6}:\d+))([,;\/\\ ])/g,
  amount: /\((\d+\.\d+)\//,
});

const extractInvoices = (input = '') => {
  if (!input) return [];
  const { invoiceLength } = store.state.settings;
  const regex = new RegExp(`^\\d{${invoiceLength}}$`);
  const str = input.replace(/[,:;\n]/g, ' ');
  const parts = str.split(' ');

  const results = parts.filter(part => regex.test(part));
  return results;
};

const parseInvoiceString = (input = '') => {
  let invoices = [];
  const { separator, string } = getPatterns().invoices;

  invoices = input.split(separator);

  // Filtering null strings
  invoices = invoices.filter(item => item.length > 0);

  //  Filtering correct invoices
  invoices = invoices
    .filter(item => string.test(item))
    .map(item => item.trim());

  return invoices;
};

const cleanInvoices = (invoices = []) => { // '123123,321321,567567'
  invoices.forEach(item => {
    const arr = parseInvoiceString(item);

    invoices.splice(invoices.indexOf(item), 1, ...arr);
  });

  return invoices;
};

export { extractInvoices, parseInvoiceString, cleanInvoices };
