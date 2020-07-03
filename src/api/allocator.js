import axios from 'axios';
import { RA_API as API } from '@/env';
import { CommonApi } from '@/api/common';

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

export default class StatementsAPI {
  static get http() {
    return axios.create({
      baseURL: `http://${API.ip}${API.port}`,
      timeout: 5000,
      headers: CommonApi.httpHeaders,
    });
  }

  static getAccounts() {
    //: Observable<Account[]>
    return StatementsAPI.http.get(API.endpoints.account);
  }

  static getStatements(accountId) {
    //: Observable<Receipt[]>
    const url = API.endpoints.statement + '?account-id=' + accountId;
    return StatementsAPI.http.get(url);
  }

  static postReceipt(receiptId, receipt) {
    const url = API.endpoints.receipt.replace('$id', receiptId);
    return StatementsAPI.http.post(url, receipt);
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

    return StatementsAPI.http.post(url, file, { headers });
  }
}
