import * as moment from 'moment';
import { LocalStorage as LS, Token } from '@apollo4u/auxiliary';

const getToken = () => LS.getItem('token');

const getTokenValidity = () => Token.checkExpiration(getToken());

const getUser = () => Token.parseJwt(getToken());

const getExpirationDate = () => (getUser() ? getUser().exp : 0);

const getRemainder = (expirationDate = getExpirationDate()) => {
  const difference = moment().diff(expirationDate * 1000) * -1;
  const remainder = moment.duration(difference).asMilliseconds();

  // prevent negative values, would be accepted as truthy
  if (difference <= 0) return 0;
  return remainder;
};

const formatRemainder = remainder =>
  remainder ? moment.utc(remainder).format('HH:mm:ss') : 'EXPIRED';

export { getToken, getUser, getTokenValidity, getRemainder, formatRemainder };
