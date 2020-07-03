import store from '../store';

interface SnackbarOptions {
  message?: String;
  duration?: Number;
  color?: String;
  action?: {
    label: String;
    method: String;
  }
}

function show(message: string, options: SnackbarOptions = {}): void {
  if (message) {
    options = { message, ...options };
    store.dispatch('snackbar/show', options);
  } else {
    console.warn('Snackbar was called without a message.');
  }
}

export default class Snackbar {
  static show(message, options: SnackbarOptions = {}): void {
    show(message, options);
  }

  static success(message, options: SnackbarOptions = {}): void {
    options = { ...options, color: 'success' };
    show(message, options);
  }

  static warn(message, options: SnackbarOptions = {}): void {
    options = { ...options, color: 'warning' };
    show(message, options);
  }

  static error(message, options: SnackbarOptions = {}): void {
    options = { ...options, color: 'error' };
    show(message, options);
  }

  static hide(): void {
    store.dispatch('snackbar/hide');
  }
}
