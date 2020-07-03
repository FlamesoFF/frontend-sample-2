import snackbar from '@/utils/snackbar';
import { isElectron } from '@/utils/electron-bridge';

const options = {
  action: { label: 'OK', method: 'dismiss' },
};
if (isElectron())
  options.action = { label: 'Open console', method: 'open_dev_tools' };

export default function(err) {
  if (err.response && err.response.data) {
    const res = err.response;
    const { data } = res;
    const { message, sqlMessage, error } = data;

    if (message) snackbar.error(message, options);
    else if (sqlMessage) snackbar.error(sqlMessage, options);
    else if (error) {
      if (error.status == 401)
        snackbar.error('Session expired', {
          action: { label: 'Re-login', method: 'logout' },
        });
      else snackbar.error(error.message, options);
    } else if (res.status == 403) snackbar.error('Access denied');
    else snackbar.error('Unknown error. Start to panic', options);

    console.error(data);
  } else {
    snackbar.error(err.toString(), options);

    console.error(err);
  }
}
