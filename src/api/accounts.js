import BaseAPI from '@/api/base';
import { API } from '@/env';

export default class AccountsAPI {
  static getAccounts() {
    return BaseAPI.http.get(API.endpoints.account);
  }

  static getStatements(accountId) {
    const url = API.endpoints.statement + '?account-id=' + accountId;
    return BaseAPI.http.get(url);
  }

  static createReceipt(statementId, receipt) {
    const url = API.endpoints.receipt.replace('$id', statementId);
    // console.log(receipt, JSON.stringify(receipt));
    return BaseAPI.http.post(url, receipt);
  }

  static importFile(file, account_id) {
    const url = API.endpoints.statement;

    const { name } = file;
    let xApollo = { name };
    if (account_id) xApollo = { ...xApollo, account_id };
    const headers = {
      'x-apollo': JSON.stringify(xApollo),
      'Content-Type': 'application/octet-stream',
    };

    return BaseAPI.http.post(url, file, { headers });
  }

  static createStatement(statement) {
    const url = API.endpoints.statement;
    return BaseAPI.http.post(url, statement);
  }

  static getInvoicesDetails(currency, invoices) {
    //ByCurrencyAndInvoices
    const endpoint = API.endpoints.invoice;
    const url = `${endpoint}/unallocated?currency=${currency}&invoices=${invoices}`;
    return BaseAPI.http.get(url);
  }
}
