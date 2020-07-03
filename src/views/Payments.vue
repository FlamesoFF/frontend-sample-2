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

            <v-combobox multiple clearable chips small-chips
                        class="required"
                        v-model="invoices"
                        label="Invoices"
                        :rules="rules.invoices"
                        :hint="hints.invoices"
                        :disabled="!accountId"
                        required
            >
                        <!-- @change="onInvoicesChanged" -->
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

            <v-text-field label="Client"
                          :value="client"
                          :hint="hints.readonly"
                          :disabled="!accountId"
                          readonly
            ></v-text-field>

            <v-textarea label="Comments"
                        v-model="comments"
                        :auto-grow="true"
                        rows="1"
                        :disabled="!accountId"
            ></v-textarea>

            <v-layout row>
              <v-flex xs6>
                <v-menu lazy top offset-x full-width
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-right="0"
                        :return-value.sync="date"
                        transition="slide-y-transition"
                        min-width="290px"
                        :disabled="!accountId"
                >
                  <v-text-field slot="activator"
                                v-model="date"
                                label="Date"
                                hint="YYYY-MM-DD"
                                prepend-icon="event"
                                :disabled="!accountId"
                                readonly
                  ></v-text-field>
                  <v-date-picker v-model="date" @input="$refs.menu.save(date)"></v-date-picker>

                </v-menu>
              </v-flex>

              <v-flex xs6>
                <v-text-field v-model="reference"
                              label="Reference"
                              placeholder="-"
                              :hint="hints.readonly"
                              :disabled="!accountId"
                              readonly
                ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row class="no-counter">
              <v-flex xs3>
                <v-text-field type="text"
                              :value="allocated"
                              label="Allocated"
                              placeholder="0"
                              :prefix="getCurrencySymbol()"
                              :rules="rules.noZero"
                              :hint="hints.readonly"
                              :disabled="!accountId"
                              readonly
                ></v-text-field>
              </v-flex>

              <v-flex xs3>
                <v-text-field type="text"
                              :value="deposit"
                              label="Deposit"
                              placeholder="0"
                              :prefix="getCurrencySymbol()"
                              :hint="hints.readonly"
                              :disabled="!accountId"
                              readonly
                ></v-text-field>
              </v-flex>

              <v-flex xs3>
                <v-text-field type="number" :class="{ waived }"
                              v-model="charges"
                              label="Charges"
                              placeholder="0"
                              suffix="%"
                              :append-icon="waived ? 'money_off' : 'monetization_on'"
                              @click:append="toggleWaived"
                              :disabled="!accountId"
                ></v-text-field>
              </v-flex>

              <v-flex xs3>
                <v-text-field type="number"
                              v-model="received"
                              label="Received"
                              placeholder="0"
                              :prefix="getCurrencySymbol()"
                              :hint="hints.numbersOnly"
                              :disabled="!accountId"
                ></v-text-field>
              </v-flex>
            </v-layout>

          </v-container>
        </v-form>

        <v-card-actions>

          <v-spacer></v-spacer>
          
          <v-btn flat
                 color="accent"
                 :loading="submitting"
                 @click="submit"
          >
            Submit
          </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

</template>

<script>
  import { mapState, mapGetters } from 'vuex';
  import moment from 'moment';

  import { cleanInvoices } from '@/utils/invoice-tools';
  import snackbar from '@/utils/snackbar';
  import hints from '@/utils/hints';
  import rules from '@/utils/rules';

  const getDefaultValues = () => ({
    accountId: 0,
    currency: '',
    invoicesBuffer: [],
    comments: '',

    subscription: null,

    // amount: null,
    // charges: 3,
    // received: null,
    // Models
    // date: moment().format('YYYY-MM-DD'),
    // client: '',
    // reference: '',
    // invoices: [],
    // invoicesDetails: [],

    menu: false,
    valid: false,
    ...rules('requiredSelect', 'invoices', 'noZero', 'numbersOnly'),
    ...hints('invoices', 'readonly'),
  });

  export default {
    name: 'payments',

    data: () => getDefaultValues(),

    computed: {
      ...mapState('accounts', [
        'accounts',
        'client',
        'date',
        'reference',
        'autoselectAccountId',
        'autoselectReceiptId',
        'submitting',
        'querying',
        'invoicesDetails',
        'allocated',
        'waived',
      ]),

      ...mapGetters('accounts', ['deposit']),

      account: {
        get() {
          return this.accounts.find(acc => acc.id === this.accountId);
        },
        set(account) {
          this.accountId = account.id;
        },
      },

      dateFormatter: {
        get() {
          return this.date;
        },
        set(newDate) {
          this.date = moment(newDate).format('YYYY-MM-DD');
        },
      },

      // total() {
      //   const amount = parseFloat(this.amount, 10);
      //   const surcharge = parseFloat(this.surcharge, 10);
      //   const val = amount + (amount * surcharge / 100);

      //   if (amount && surcharge) return (val).toFixed(2);
      //   else return amount;
      // },

      charges: {
        get() {
          return this.$store.state.accounts.charges;
        },
        set(value) {
          this.$store.commit('accounts/setCharges', value);
        }
      },

      received: {
        get() {
          return this.$store.state.accounts.received;
        },
        set(value) {
          this.$store.commit('accounts/setReceived', value);
        }
      },

      // deposit() {
      //   return Math.round(this.calcDeposit(this.received) * 100) / 100;
      // },

      invoices: {
        get() {
          return this.invoicesBuffer;
        },
        set(value) {
          this.invoicesBuffer = cleanInvoices(value);
        }
      }
    },

    watch: {
      comments(text) {
        if (text) this.comments = text.trim();
      },

      invoices(invoices) {
        if (invoices && invoices.length) {
          const { currency } = this;
          this.$store.dispatch('accounts/getInvoicesDetails', { currency, invoices });
        } else {
          this.partialClearForm();
        }
      },
    },

    methods: {
      selectAccount(accountId, account) {
        if (accountId) {
          this.accountId = accountId;
          this.clearForm();
          this.currency = this.account.currency;
        }
      },

      submit() {
        if (this.$refs.form.validate()) {
          if (!this.submitting) {
            // this.submitting = true;

            const { account, date, comments, invoices } = this;
            const payload = { account, date, comments, invoices };
            this.$store.dispatch('accounts/submitStatement', payload);

            this.$refs.form.resetValidation();
          }
        } else {
          console.log(this.$refs.form.validate());
        }
      },

      removeInvoice(item) {
        this.invoices.splice(this.invoices.indexOf(item), 1);
      },

      clearForm() {
        (({ currency, invoices, comments }) => // client, reference, allocated
          Object.assign(this, { currency, invoices, comments })
        )(getDefaultValues());

        this.$store.dispatch('accounts/resetDefaults', 'butAccounts');
        this.resetCharges();
        this.resetDate();

        if (this.$refs.form) this.$refs.form.resetValidation();
      },

      partialClearForm() {
        this.$store.dispatch('accounts/resetDefaults', 'partial');
        if (this.$refs.form) this.$refs.form.resetValidation();

      },

      resetCharges() {
        this.$store.commit('accounts/setCharges', 3)
        this.$store.commit('accounts/setWaived', false)
      },

      resetDate() {
        this.$store.commit('accounts/setDate', moment().format('YYYY-MM-DD'));
      },

      getCurrencySymbol() {
        return this.currency == 'USD' ? '$' : (this.currency == 'EUR' ? '€' : '');
      },

      toggleWaived() {
        this.$store.commit('accounts/setWaived', !this.waived);
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
    },

    mounted() {
      this.subscription = this.$store.subscribeAction((action, state) => {
        if (action.type == 'accounts/fetchAccounts') {
          this.accountId = 0;
          this.clearForm();
        }
      });

      this.$store.dispatch('accounts/resetDefaults');
      this.$store.dispatch('accounts/fetchAccounts');
      this.resetCharges();
      this.resetDate();
    },

    destroyed() {
      this.subscription();
    }
  };
</script>

<style lang="scss" scoped>
  // @import '~vuetify/dist/vuetify.min.css';

  .v-chip {
    background: rgba(0, 0, 0, 0.05);
  }
</style>

