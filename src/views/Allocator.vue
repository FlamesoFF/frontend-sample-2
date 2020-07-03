<template>

  <v-layout>
    <v-flex>
      <v-card class="main">
        <transition name="fade">
          <v-progress-linear :indeterminate="true"
                             height="5"
                             color="accent"
                             v-show="submitting"
          ></v-progress-linear>
        </transition>
        <transition name="fade">
          <v-progress-linear :indeterminate="true"
                             height="5"
                             color="accent"
                             :query="true"
                             v-show="querying"
          ></v-progress-linear>
        </transition>

        <v-form ref="form" v-model="valid" lazy-validation>

          <v-container fluid>

            <v-select dense class="required"
                      v-model="accountId"
                      :items="accounts"
                      item-text="name"
                      item-value="id"
                      :rules="rules.requiredSelect"
                      label="Select account"
                      @change="selectAccount($event)"
                      :disabled="submitting"
                      required
            >
              <template slot="item" slot-scope="data">
                <span class="font-weight-bold">
                  {{ data.item.name.split(' ')[0] }}
                </span>&nbsp;
                <span class="condensed font-weight-thin">
                  {{ data.item.name.split(' ')[1] }}
                </span>
              </template>
            </v-select>

            <v-select dense class="required"
                      ref="statementSelect"
                      v-model="statementId"
                      :items="statements"
                      item-text="display_value"
                      item-value="id"
                      :rules="rules.requiredSelect"
                      label="Select statement"
                      @change="selectStatement($event)"
                      @keydown.native.enter="keypressHandler()"
                      :disabled="!statements.length || submitting"
            >
              <template slot="item" slot-scope="data">
                <span class="condensed font-weight-thin">
                  {{ data.item.display_value.split(' ')[0] }}
                </span>&nbsp;
                <span class="font-weight-bold">
                  {{ data.item.display_value.split(' ')[1] }}
                </span>&nbsp;
                <span class="font-weight-thin">
                  {{ data.item.display_value.split(' ')[2] }}
                </span>
              </template>
            </v-select>

            <v-textarea label="Description"
                        v-model="description"
                        :auto-grow="true"
                        rows="1"
                        :disabled="!statement || submitting"
            ></v-textarea>

            <!-- <v-textarea label="Invoices"
                        v-model="invoices"
                        :auto-grow="true"
                        rows="1"
                        :disabled="!statement || submitting"
            ></v-textarea> -->

            <v-combobox multiple clearable chips small-chips
                        v-model="invoices"
                        label="Invoices"
                        :rules="rules.invoices"
                        :hint="hints.invoices"
                        :disabled="!statement || submitting"
            >
                        <!-- @change="onInvoicesChange" -->
              <template slot="selection"
                        slot-scope="data"
              >
                <v-chip :color="getChipColor(data.item)"
                        :text-color="getChipColor(data.item, true)"
                        :selected="data.selected"
                        @input="removeInvoice(data.item)"
                        close small
                >
                  <strong>{{ data.item }}</strong>&nbsp;
                </v-chip>
              </template>
            </v-combobox>

            <v-textarea label="Comments"
                        v-model="comments"
                        :auto-grow="true"
                        rows="1"
                        :disabled="!statement || submitting"
            ></v-textarea>

            <v-layout row class="no-counter">
              <v-flex xs3>
                <v-text-field type="text"
                              :value="allocated"
                              label="Allocated"
                              placeholder="0"
                              :prefix="getCurrencySymbol()"
                              :hint="hints.readonly"
                              :disabled="!statement || submitting"
                              readonly
                ></v-text-field>
              </v-flex>

              <v-flex xs3>
                <v-text-field type="text"
                              :value="depositStatic"
                              label="Deposit"
                              placeholder="0"
                              :prefix="getCurrencySymbol()"
                              :hint="hints.readonly"
                              :disabled="!statement || submitting"
                              readonly
                ></v-text-field>
              </v-flex>

              <v-flex xs3>
                <v-text-field type="text" :class="{ waived }"
                              v-model="charges"
                              label="Charges"
                              placeholder="0"
                              :prefix="getCurrencySymbol()"
                              :append-icon="waived ? 'money_off' : 'monetization_on'"
                              @click:append="toggleWaived"
                              :rules="rules.numbersOnly"
                              :disabled="!statement || submitting"
                ></v-text-field>
                              <!-- @keydown.69.prevent -->
              </v-flex>

              <v-flex xs3>
                <v-text-field type="number"
                              :value="received"
                              label="Received"
                              placeholder="0"
                              :prefix="getCurrencySymbol()"
                              :hint="hints.readonly"
                              :disabled="!statement || submitting"
                              readonly
                ></v-text-field>
              </v-flex>
            </v-layout>

          </v-container>
          
        </v-form>

        <v-card-actions>
          
          <v-spacer></v-spacer>

          <v-slide-x-transition>
            <v-btn flat
                   v-show="results.length"
                   @click="showResults = true"
            >
              Show results
            </v-btn>
          </v-slide-x-transition>

          <v-btn flat
                 color="accent"
                 :loading="submitting"
                 @click="submit"
          >
            Submit
          </v-btn>
          
        </v-card-actions>

        <div class="dropzone" :class="{ visible: dragging }">
          <span>Drop files here</span>
        </div>
      </v-card>

      <v-dialog v-model="showResults"
                width="500"
      >
        <v-card>
          <v-card-title class="headline"
          >
            Allocation results
          </v-card-title>

          <v-card-text>
            
            <v-list>
              <v-list-tile v-for="invoice in results"
                           :key="invoice.number"
              >
                <v-list-tile-action>
                  <v-icon :color="invoice.warnings.length ? 'error' : 'success'">
                    {{ invoice.warnings.length ? 'highlight_off' : 'check_circle_outline' }}
                  </v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <!-- <v-list-tile-title v-text="invoice.number"></v-list-tile-title>
                  <v-list-tile-sub-title>{{ invoice.warnings.join('; ') + '.' }}</v-list-tile-sub-title> -->
                  <div>
                    <span class="text--primary">{{ invoice.number }}</span>
                    <span class="text--secondary bulleted" v-if="invoice.warnings.length">{{ invoice.warnings.join('; ') }}</span>
                  </div>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat
                   color="accent"
                   @click="showResults = false"
            >
              Dismiss
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>

</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import snackbar from '@/utils/snackbar';
  import { extractInvoices, cleanInvoices } from '@/utils/invoice-tools';
  import hints from '@/utils/hints';
  import rules from '@/utils/rules';

  export default {
    name: 'allocator',

    data: () => ({
      // descHasFocus: false,
      // importedStatement: {},
      showResults: false,
      subscription: null,
      dragging: false,

      accountId: null,
      statementId: null,
      description: '',
      invoicesBuffer: [],
      // invoices: [],
      comments: '',

      // allocated: 0,
      // charges: null,
      // received: null,

      valid: false,
      ...rules('required', 'requiredSelect', 'numbersOnly'),
      ...hints('invoices', 'readonly'),
    }),

    computed: {
      ...mapState('accounts', [
        'accounts',
        'statements',
        'autoselectAccountId',
        'autoselectStatementId',
        'results',
        'submitting',
        'querying',
        'invoicesDetails',
        'allocated',
        'received',
        'waived',
      ]),

      ...mapGetters('accounts', ['depositStatic']),

      ...mapState('settings', [
        'importFileSizeLimit'
      ]),

      account: {
        get() {
          return this.accounts.find(acc => acc.id === this.accountId);
        },
        set(account) {
          this.accountId = account.id;
        }
      },
      statement: {
        get() {
          return this.statements.find(rec => rec.id === this.statementId);
        },
        set(statement) {
          this.statementId = statement.id;
        }
      },

      invoices: {
        get() {
          return this.invoicesBuffer;
        },
        set(value) {
          this.invoicesBuffer = cleanInvoices(value);
        }
      },

      charges: {
        get() {
          return this.$store.state.accounts.charges;
        },
        set(value) {
          this.$store.commit('accounts/setCharges', value);
        }
      },

      currency() {
        return this.account ? this.account.currency : '';
      },
    },

    watch: {
      statements(statements) {
        if (statements && statements.length) {
          if (this.autoselectStatementId !== null) {
            if (this.checkAvailability('statements', this.autoselectStatementId)) {
              this.statementId = this.autoselectStatementId;
            } else {
              if (this.autoselectStatementId !== null) snackbar.show(`Couldn't find statement`);
            }
            if (this.statement) {
              this.selectStatement(this.autoselectStatementId);
            } else {
              // TODO:
              // Show snackbar 'Statement no longer available'
            }
            this.$store.commit('accounts/setAutoselectStatement', null);
          }
        }
      },
      description(text) {
        if (text != undefined) {
          this.description = text.trim();
          this.invoices = extractInvoices(this.description);
        }
      },
      invoices(newInvoices, oldInvoices) {
        if (newInvoices && newInvoices.length) {
          if (!oldInvoices || (newInvoices.join(' ') != oldInvoices.join(' '))) {
            this.getInvoicesDetails();
          }
        } else {
          this.$store.commit('accounts/setAllocated', null);
        }
      },
      comments(text) {
        if (text) this.comments = text.trim();
      }
    },

    methods: {
      // ...mapActions({

      // }),
      selectAccount(id) {
        this.$store.dispatch('accounts/fetchStatements', id);
        if (this.checkAvailability('accounts', id)) {
          this.accountId = id;
        } else {
          if (id !== undefined) snackbar.show(`Couldn't find account`);
        }
        this.statementId = null;
        this.clearForm();
      },

      selectStatement(id) {
        if (id) {
          const { description, comments, date, received } = this.statement;
          this.description = description;
          this.comments = comments;
          this.invoices = extractInvoices(description);
          // const splits = display_value.split(' ');
          this.$store.commit('accounts/setDate', date);
          this.$store.commit('accounts/setReceived', received);
        }
      },

      getInvoicesDetails() {
        const { currency, invoices } = this;
        this.$store.dispatch('accounts/getInvoicesDetails', { currency, invoices });
      },

      submit() {
        if (this.$refs.form.validate()) {
          if (!this.submitting) {
            const { account, statementId, description, comments, invoices } = this;

            // this.autoselectStatementId = statementId;
            this.$store.dispatch(
              'accounts/submitReceipt',
              { account, statementId, description, comments, invoices }
            )
            this.$refs.form.resetValidation();
          }
        } else {
          //TODO: maybe do something?
          console.log(this.$refs.form.validate());
        }
      },

      getCurrencySymbol() {
        return this.currency == 'USD' ? '$' : (this.currency == 'EUR' ? '€' : '');
      },

      getChipColor(invoiceNum, getTextColor = false) {
        if (this.invoicesDetails.length) {
          const match = this.invoicesDetails.find(
            invoice => invoice.number == invoiceNum
          );

          if (match) {
            if (match.warnings.length || !match.unallocated)
              return getTextColor ? 'white' : 'red';
            else
              return getTextColor ? 'white' : 'green';
          }
        }

        return getTextColor ? 'black' : 'gray';
      },

      checkAvailability(category, target) {
        if (target !== null) return this[category].find(item => item.id == target);
        else {
          // console.error('Target missing on availability check');
          return null;
        }
      },

      removeInvoice(item) {
        this.invoices.splice(this.invoices.indexOf(item), 1);
        this.getInvoicesDetails();
      },

      clearForm() {
        this.description =
          this.comments = '';

        this.invoices = [];
        this.clearBottomRow();

        if (this.$refs.form) this.$refs.form.resetValidation();
      },

      clearBottomRow() {
        this.$store.commit('accounts/setAllocated', null);
        this.$store.commit('accounts/setReceived', null);
        this.charges = null;
      },

      toggleWaived() {
        this.$store.commit('accounts/setWaived', !this.waived);
      },

      keypressHandler() {
        this.$refs.statementSelect.isMenuActive = false;
        console.log('Submitting...');
        this.submit();
      },
    },

    mounted() {
      this.subscription = this.$store.subscribeAction((action, state) => {
        if (action.type == 'accounts/fetchAccounts') {
          if (this.autoselectAccountId !== null && this.autoselectStatementId !== null) {
            // this.accountId = this.autoselectAccountId;
            this.selectAccount(this.autoselectAccountId);
            this.$store.commit('accounts/setAutoselectAccount', null);
            // this.$store.commit('accounts/setAutoselectStatement', null);
          } else {
            this.$store.commit('accounts/setAutoselectAccount', null);
            this.accountId = null;
            this.statementId = null;
          }
          this.clearForm();
        }

        if (action.type == 'accounts/showResults') {
          this.showResults = true;
        }
      });

      this.$store.dispatch('accounts/resetDefaults');
      this.$store.dispatch('accounts/fetchAccounts');
      this.$store.commit('accounts/setWaived', true);

      // if (this.$refs.form) this.$refs.form.resetValidation();

      const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
      events.forEach(eventType => {
        document.addEventListener(eventType, event => {
          event.preventDefault();
          event.stopPropagation();

          if (
            eventType == 'dragenter' ||
            eventType == 'dragover'
          ) this.dragging = true;

          else if (
            eventType == 'dragleave' ||
            eventType == 'drop'
          ) this.dragging = false;

          if (eventType == 'drop') {
            const file = event.dataTransfer.files[0];
            if (file) {
              if (file.size < this.importFileSizeLimit) { // old_value: 2048
                if (
                  ~file.name.indexOf('.txt') ||
                  ~file.name.indexOf('.csv') ||
                  ~file.name.indexOf('.ofx')
                ) {
                  const file = event.dataTransfer.files[0];
                  const account_id = this.accountId;
                  console.log(file);
                  this.$store.dispatch('accounts/importFile', { file, account_id });
                } else {
                  snackbar.error(`Unsupported file type: ${file.type}`);
                }
              } else {
                snackbar.error(`File size limit of ${CONFIG.importFileSizeLimit} bytes exceeded.`);
              }
            }
          }
        }, false);
      });

      // TODO: Unsub

    },

    destroyed() {
      this.subscription();
    }
  };
</script>

<style lang="scss" scoped>
  .dropzone {
    pointer-events: none;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 16px;
    right: 16px;
    top: 16px;
    bottom: 16px;
    background-color: rgba(68, 138, 255, 0.2);
    border: 3px dashed rgba(68, 138, 255, 0.38);
    border-radius: 5px;
    z-index: 10;
    opacity: 0;
    &.visible {
      opacity: 1;
    }
    span {
      text-transform: uppercase;
      font-family: Roboto Condensed;
      font-size: 26px;
      font-weight: 400;
      line-height: 26px;
      color: rgba(68, 138, 255, 0.5);
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .v-dialog {
    .v-list__tile__action {
      min-width: 40px;
    }
    .v-card__title {
      padding: 26px 34px 0px;
    }
  }
</style>

