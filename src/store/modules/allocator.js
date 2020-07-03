import allocator from '@/api/allocator';
import errorHandler from '@/utils/error-handler';
import snackbar from '@/utils/snackbar';

export default {
  namespaced: true,

  state: {
    accounts: [],
    statements: [],
    autoselectAccountId: undefined,
    autoselectStatementId: undefined,
    results: [],
    submitting: false,
    querying: false,
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
  },

  actions: {
    fetchAccounts({ commit }) {
      commit('setQuery', true);
      commit('setStatements', []);
      commit('setResults', []);
      allocator
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
      if (accountId !== undefined) {
        commit('setQuery', true);
        commit('setAutoselectAccount', accountId);
        allocator
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

    importFile({ commit, dispatch }, bundle) {
      commit('setSubmit', true);
      const { file, account_id } = bundle;
      allocator
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

    submit({ state, commit, dispatch }, receipt) {
      commit('setSubmit', true);
      const { statementId } = receipt;
      delete receipt.statementId;
      commit('setAutoselectStatement', statementId);
      commit('setResults', []);

      allocator
        .postReceipt(statementId, receipt)
        .then(response => {
          console.log(response.data);

          const { invoices } = response.data;

          // const results = [];

          let warnings = 0;
          for (const invoice of invoices) {
            // const result = {
            //   [invoice.number]: invoice.warnings,
            // };
            // results.push(result);
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
          commit('setSubmit', false);
        })
        .catch(error => {
          commit('setSubmit', false);
          errorHandler(error, dispatch);
        });
    },

    showResults() {
      // Used as an event trigger
      snackbar.hide();
    },
  },
};
