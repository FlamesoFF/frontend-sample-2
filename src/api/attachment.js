// import axios from 'axios';
import store from '@/store';
// import { isDev } from '@/env';
import { ATTACHMENT } from '@/env';

const { endpoints } = ATTACHMENT;

export default class Attachment {
  // static get http() {
  //
  //   return axios.create({
  //     baseURL: `http://${authIp}${authPort}v2/users/`,
  //     timeout: apiTimeout,
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  // }

  static getAvatarUrl(fileID) {
    const { attachmentIp, attachmentPort } = store.state.settings;
    return `http://${attachmentIp}${attachmentPort}${endpoints.file}/${fileID}`;
  }
}
