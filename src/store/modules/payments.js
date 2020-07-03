import moment from 'moment';
import { PaymentsAPI } from '@/api/payments';
import ReceiptsAPI from '@/api/allocator';
import errorHandler from '@/utils/error-handler';
import snackbar from '@/utils/snackbar';

export default {
  namespaced: true,

  state: {
    accounts: [],
    receipts: [],
    autoselectAccountId: undefined,
    autoselectReceiptId: undefined,
    submitting: false,
    querying: false,

    invoices: [],
    client: '',
    comments: '',
    date: moment().format('YYYY-MM-DD'),
    amount: 0,
    reference: 0,
    accountId: 0,
  },

  mutations: {
    setAccounts(state, accounts) {
      state.accounts = accounts;
    },
    setReceipts(state, receipts) {
      state.receipts = receipts;
    },
    setAutoselectAccount(state, id) {
      state.autoselectAccountId = id;
    },
    setAutoselectReceipt(state, id) {
      state.autoselectReceiptId = id;
    },
    setSubmit(state, status) {
      state.submitting = status;
    },
    setQuery(state, status) {
      state.querying = status;
    },

    account(state, payload) {
      state.account = payload;
    },
    invoices(state, payload) {
      state.invoices = payload;
    },
    client(state, payload) {
      state.client = payload;
    },
    comments(state, payload) {
      state.comments = payload;
    },
    date(state, payload) {
      state.date = payload;
    },
    surcharge(state, payload) {
      state.surcharge = payload;
    },
    accountId(state, payload) {
      state.accountId = payload;
    },
  },

  actions: {
    fetchAccounts({ commit }) {
      commit('setQuery', true);
      PaymentsAPI.getAccounts()
        .then(response => {
          let accounts = response.data;

          // Mock longer list
          // for (let i = 0; i < 40; i++) {
          //   accounts.push({ id: i, name: 'Account ' + i });
          // }

          commit('setAccounts', accounts);
          commit('setQuery', false);
        })
        .catch(error => {
          commit('setQuery', false);
          errorHandler(error);
        });
    },

    fetchReceipts({ commit }, accountId) {
      if (accountId !== undefined) {
        commit('setQuery', true);
        commit('setAutoselectAccount', accountId);

        ReceiptsAPI.getReceipts(accountId)
          .then(response => {
            const receipts = response.data.items;
            commit('setReceipts', receipts);
            commit('setQuery', false);
          })
          .catch(error => {
            commit('setQuery', false);
            errorHandler(error);
          });
      } else commit('setReceipts', []);
    },

    importFile({ commit, dispatch }, file) {
      commit('setSubmit', true);
      PaymentsAPI.importFile(file)
        .then(data => {
          // Mock data
          // data.account_id = 2;
          // data.id = 3;

          console.log(data);
          commit('setSubmit', false);

          commit('setAutoselectAccount', data.account_id);
          commit('setAutoselectReceipt', data.id);
          dispatch('fetchAccounts');

          // TODO: autoselect account & receipt
        })
        .catch(error => {
          commit('setSubmit', false);
          errorHandler(error);
        });
    },

    submit({ state, commit, dispatch }, receipt) {
      commit('setSubmit', true);
      const { receiptId } = receipt;
      delete receipt.receiptId;
      commit('setAutoselectReceipt', receiptId);

      return PaymentsAPI.postReceiptCash(receipt)
        .then(response => {
          console.log(response.data);
          const { warnings } = response.data;

          if (warnings) snackbar.warn(warnings);
          else snackbar.success('Allocation successful');

          dispatch('fetchReceipts', state.autoselectAccountId);
          commit('setSubmit', false);
        })
        .catch(error => {
          commit('setSubmit', false);
          errorHandler(error);
        });
    },
  },
};
