import { LocalStorage as LS } from '@apollo4u/auxiliary';
import axios from 'axios';
import store from '@/store';

export default class BaseAPI {
  static get httpHeaders() {
    return {
      Authorization: 'Bearer ' + LS.getItem('token'),
      'Content-Type': 'application/json',
    };
  }

  static get http() {
    const { apiIp, apiPort, apiTimeout } = store.state.settings;
    return axios.create({
      baseURL: `http://${apiIp}${apiPort}`,
      timeout: apiTimeout,
      headers: BaseAPI.httpHeaders,
    });
  }
}
