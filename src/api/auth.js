import axios from 'axios';
import store from '@/store';
import { isDev } from '@/env';
import { AUTH } from '@/env';

export default class Auth {
  static get authHttp() {
    const { authIp, authPort, authTimeout } = store.state.settings;
    return axios.create({
      baseURL: `http://${authIp}${authPort}${AUTH.endpoints.user}/`,
      timeout: authTimeout,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  static signIn(credentials) {
    const { username, password } = credentials;

    if (isDev)
      console.log(
        `%cSigning in: %c${username} | ${password}`,
        'color: #000',
        'color: #888'
      );

    return Auth.authHttp.post(`${username}/sign-in`, { password });
  }
}
