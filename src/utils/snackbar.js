import store from '@/store';

function show(message, options = {}) {
  if (message) {
    options = { message, ...options };
    store.dispatch('snackbar/show', options);
  } else {
    console.warn('Snackbar was called without a message.');
  }
}

export default class Snackbar {
  static show(message, options) {
    show(message, options);
  }

  static success(message, options) {
    options = { ...options, color: 'success' };
    show(message, options);
  }

  static warn(message, options) {
    options = { ...options, color: 'warning' };
    show(message, options);
  }

  static error(message, options) {
    options = { ...options, color: 'error' };
    show(message, options);
  }

  static hide() {
    store.dispatch('snackbar/hide');
  }
}
