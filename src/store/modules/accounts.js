import accounts from '@/api/accounts';
import errorHandler from '@/utils/error-handler';
import snackbar from '@/utils/snackbar';
import {
  calcDeposit,
  calcDepositStatic,
  roundUpUnallocated,
} from '@/utils/formulas';

const defaults = {
  querying: false,
  submitting: false,

  accounts: [],
  statements: [],
  autoselectAccountId: null,
  autoselectStatementId: null,

  results: [], // of submission
  invoicesDetails: [],

  allocated: null,
  received: null,
  date: null,
  reference: '',
  client: '',

  charges: null,
  waived: false,
};

export default {
  namespaced: true,

  state: {
    ...defaults,
  },

  getters: {
    deposit({ received, allocated, charges, waived }) {
      if (waived) charges = 0;
      return Math.ceil((calcDeposit(received, allocated, charges) * 100) / 100);
    },
    depositStatic({ received, allocated, charges, waived }) {
      if (waived) charges = 0;
      const result = calcDepositStatic(received, allocated, charges);
      return result == 0 ? 0 : result.toFixed(2);
    },
  },

  mutations: {
    setAccounts(state, accounts) {
      state.accounts = accounts;
    },
    setStatements(state, statements) {
      state.statements = statements;
    },
    setAutoselectAccount(state, id) {
      state.autoselectAccountId = id;
    },
    setAutoselectStatement(state, id) {
      state.autoselectStatementId = id;
    },
    setResults(state, results) {
      state.results = results;
    },
    setSubmit(state, status) {
      state.submitting = status;
    },
    setQuery(state, status) {
      state.querying = status;
    },

    setInvoices(state, invoices) {
      state.invoicesDetails = invoices;
    },
    setAllocated(state, value) {
      state.allocated = value;
    },
    setReceived(state, value) {
      state.received = value;
    },
    setReference(state, reference) {
      state.reference = reference;
    },
    setClient(state, client) {
      state.client = client;
    },
    setDate(state, date) {
      state.date = date;
    },

    setCharges(state, value) {
      state.charges = value;
    },
    setWaived(state, status) {
      state.waived = status;
    },

    resetState(state, object = defaults) {
      Object.assign(state, object);
    },
  },

  actions: {
    fetchAccounts({ state, commit }) {
      if (state.querying) return;
      commit('setQuery', true);
      commit('setStatements', []);
      commit('setResults', []);
      accounts
        .getAccounts()
        .then(response => {
          let accounts = response.data.items;

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

    fetchStatements({ commit }, accountId) {
      if (accountId !== null) {
        commit('setQuery', true);
        commit('setAutoselectAccount', accountId);
        accounts
          .getStatements(accountId)
          .then(response => {
            const statements = response.data.items;
            commit('setStatements', statements);
            commit('setQuery', false);
            if (!statements.length)
              snackbar.warn('No statements for this account');
          })
          .catch(error => {
            commit('setQuery', false);
            errorHandler(error);
          });
      } else commit('setStatements', []);
    },

    getInvoicesDetails({ commit }, { currency, invoices }) {
      if (!invoices.length) return;
      commit('setQuery', true);
      accounts
        .getInvoicesDetails(currency, invoices.join(', '))
        .then(response => {
          commit('setQuery', false);
          if (!response.data) return;
          const { invoices, allocated, client } = response.data;
          commit('setInvoices', invoices);
          commit('setAllocated', roundUpUnallocated(allocated));
          commit('setClient', client);
        })
        .catch(error => {
          commit('setQuery', false);
          errorHandler(error);
        });
    },

    importFile({ commit, dispatch }, { file, account_id }) {
      commit('setSubmit', true);

      accounts
        .importFile(file, account_id)
        .then(response => {
          const { data } = response;
          // Mock data
          // data.account_id = 60;
          // data.id = 1;

          console.log(data);
          commit('setSubmit', false);

          if (data.account_id) commit('setAutoselectAccount', data.account_id);
          if (data.id) commit('setAutoselectStatement', data.id);

          if (response.status == 201) snackbar.success('Import successful');

          dispatch('fetchAccounts');
        })
        .catch(error => {
          commit('setSubmit', false);
          errorHandler(error);

          /* For testing without proper receipt and getting error */
          /* START */

          /* Mock data */
          // const data = {};
          // data.account_id = 63;
          // data.id = 4692;

          // if (data.account_id) commit('setAutoselectAccount', data.account_id);
          // if (data.id) commit('setAutoselectStatement', data.id);
          // dispatch('fetchAccounts');
          /* END */
        });
    },

    submitReceipt({ state, commit, dispatch }, receipt) {
      commit('setSubmit', true);
      const { statementId } = receipt;
      delete receipt.statementId;

      receipt.invoices = receipt.invoices.join(' ');

      const { charges, waived } = state;
      const custom_fields = { charges, waived };
      receipt = { ...receipt, custom_fields };

      commit('setAutoselectStatement', statementId);
      commit('setResults', []);

      accounts
        .createReceipt(statementId, receipt)
        .then(response => {
          commit('setSubmit', false);
          // console.log(response);
          if (!response.data) {
            snackbar.error('Response data was empty 🤔');
            return;
          }

          const { invoices } = response.data;

          let warnings = 0;
          for (const invoice of invoices) {
            warnings += invoice.warnings.length;
          }
          if (warnings) commit('setResults', invoices);

          const options = {
            action: { label: 'Show details', method: 'show_results' },
            duration: 10000,
          };

          if (warnings >= invoices.length)
            snackbar.error(
              `Allocation failed with ${warnings} warning${
                warnings > 1 ? 's' : ''
              }`,
              options
            );
          else if (warnings)
            snackbar.warn(
              `Allocation partially successful, with ${warnings} warning${
                warnings > 1 ? 's' : ''
              }`,
              options
            );
          else snackbar.success('Allocation successful');

          dispatch('fetchStatements', state.autoselectAccountId);
        })
        .catch(error => {
          commit('setSubmit', false);
          errorHandler(error, dispatch);
        });
    },

    submitStatement({ commit, dispatch }, statement) {
      commit('setSubmit', true);
      const invoices = statement.invoices.join(',');

      accounts
        .createStatement({ ...statement, ...invoices })
        .then(response => {
          console.log(response.data);
          commit('setSubmit', false);
          commit('setReference', response.data.reference);
          snackbar.success('Payment successful');
        })
        .catch(error => {
          commit('setSubmit', false);
          errorHandler(error, dispatch);
        });
    },

    resetDefaults({ state, commit }, scope = 'full') {
      if (scope == 'partial') {
        const { client, reference, allocated } = defaults;
        commit('resetState', { client, reference, allocated });
      } else if (scope == 'butAccounts') {
        const accounts = state.accounts;
        commit('resetState', { ...defaults, accounts });
      } else {
        commit('resetState');
      }
    },

    showResults() {
      // Used as an event trigger
      snackbar.hide();
    },
  },
};
