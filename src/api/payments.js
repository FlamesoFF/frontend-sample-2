import axios from 'axios';
import { CP_API as API } from '../env';
import { CommonApi } from './common';

// async function readBinaryString(file) {
//   const reader = new FileReader();

//   return new Promise((resolve, reject) => {
//     reader.onerror = () => {
//       reader.abort();
//       reject(new DOMException('Problem parsing input file.'));
//     };

//     reader.onload = () => {
//       resolve(reader.result);
//     };
//     reader.readAsBinaryString(file);
//   });
// }

export class PaymentsAPI {
  static get http() {
    return axios.create({
      baseURL: `http://${API.ip}${API.port}`,
      timeout: 5000,
      headers: CommonApi.httpHeaders,
    });
  }

  static getAccounts() {
    return PaymentsAPI.http.get(API.endpoints.account);
  }

  static getReceiptsByCurrencyAndInvoices(currency, invoices) {
    const url = `${API.endpoints.receipt}/cash/unallocated?currency=${currency}&invoices=${invoices}`;
    return PaymentsAPI.http.get(url);
  }

  static postReceipt(receiptId, receipt) {
    const url = `${API.endpoints.receipt}/cash`;
    return PaymentsAPI.http.post(url, receipt);
  }

  static importFile(file, account_id) {
    const url = API.endpoints.import;

    const { name } = file;
    let xApollo = { name };
    if (account_id) xApollo = { ...xApollo, account_id };
    const headers = {
      'x-apollo': JSON.stringify(xApollo),
      'Content-Type': 'application/octet-stream',
    };

    return PaymentsAPI.http.post(url, file, { headers });
  }
}
