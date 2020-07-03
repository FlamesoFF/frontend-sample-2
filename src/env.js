const env = process.env;

export const isDev = env.NODE_ENV == 'development';

export const API = {
  ip: env.VUE_APP_API_IP,
  port: env.VUE_APP_API_PORT,
  endpoints: {
    account: env.VUE_APP_ACCOUNT,
    statement: env.VUE_APP_STATEMENT,
    invoice: env.VUE_APP_INVOICE,
    receipt: env.VUE_APP_RECEIPT,
  },
};

export const AUTH = {
  ip: env.VUE_APP_API_IP,
  port: env.VUE_APP_AUTH_PORT,
  endpoints: {
    user: env.VUE_APP_USER,
  },
};

export const ATTACHMENT = {
  ip: env.VUE_APP_API_IP,
  port: env.VUE_APP_ATTACHMENT_PORT,
  endpoints: {
    file: env.VUE_APP_FILE,
  },
};

// ~~ ~~ ~~ deprecated ~~ ~~ ~~
// export const CONFIG = {
//   invoiceLength: env.VUE_APP_INVOICE_LENGTH,
//   importFileSizeLimit: env.VUE_APP_IMPORT_SIZE_LIMIT,
//   requestTimeout: '5000',
// };
