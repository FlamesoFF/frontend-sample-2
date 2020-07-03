import { LocalStorage as LS } from '@apollo4u/auxiliary';
import axios from 'axios';
import { RA_API as API } from '@/env';

export class CommonApi {
  static get http() {
    return axios.create({
      baseURL: `http://${API.ip}${API.port}`,
      timeout: 5000,
      headers: CommonApi.httpHeaders,
    });
  }

  static get httpHeaders() {
    return {
      Authorization: 'Bearer ' + LS.getItem('token'),
      'Content-Type': 'application/json',
    };
  }

  static getAccounts() {
    //: Observable<Account[]>
    return CommonApi.http.get(API.endpoints.account);
  }

  static getReceipts(accountId) {
    //: Observable<Receipt[]>
    const url = API.endpoints.receipt + accountId;
    return CommonApi.http.get(url);
  }

  static postReceipt(receiptId, receipt) {
    const url = API.endpoints.invoice.replace('$id', receiptId);
    return CommonApi.http.post(url, receipt);
  }
}
