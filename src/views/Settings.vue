<template>
  
  <v-layout>
    <v-flex>
      <v-card class="main">

        <transition name="fade">
          <v-progress-linear :indeterminate="true"
                             height="5"
                             color="accent"
                             v-show="false"
          ></v-progress-linear>
        </transition>

        <v-toolbar card dense>
          <v-btn icon @click="goBack">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title class="subheading grey--text">Settings</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-menu offset-y left>
            <v-btn icon slot="activator">
              <v-icon>more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile @click="setEnvironment('prod')" >
                <v-list-tile-title>Set prod. env.</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="setEnvironment('dev')" >
                <v-list-tile-title>Set dev. env.</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>

        <v-container fluid class="no-counter">

          <v-form ref="form" v-model="valid" lazy-validation>

            <div class="section">
              <p>Application Settings</p>

              <v-layout row>
                <v-flex xs3>
                  <v-text-field v-model="settings.invoiceLength"
                                type="number"
                                label="Invoice Length"
                                suffix="digits"
                                :rules="rules.numbersOnly"
                                class="padding-after"
                  />
                </v-flex>

                <v-flex xs4>
                  <v-text-field v-model="bytesToKBs"
                                type="number"
                                label="Import File Size Limit"
                                suffix="KB"
                                :rules="rules.numbersOnly"
                                class="padding-before padding-after"
                  />
                </v-flex>

                <v-flex xs5>
                <v-select :items="tabs"
                          v-model="settings.defaultTab"
                          item-text="label"
                          item-value="value"
                          label="Default tab"
                          class="padding-before"
                ></v-select>
                </v-flex>
              </v-layout>

              <v-layout row v-if="showAdvanced">
                <v-flex xs12>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-list-tile-title>Enable Bills tab</v-list-tile-title>
                      </v-list-tile-content>

                      <v-list-tile-action>
                        <v-switch class="pl-3 pt-2"
                                  v-model="settings.enableBills"
                                  @change="toggleBillsTab"
                        />
                      </v-list-tile-action>
                    </v-list-tile>
                  </v-list>
                </v-flex>
              </v-layout>
            </div>

            <div class="section" v-if="showAdvanced">
              <p>API settings</p>

              <v-layout row>
                <v-flex xs5>
                  <v-text-field v-model="settings.apiIp"
                                label="IP"
                                :rules="rules.validIP"
                  />
                </v-flex>

                <v-flex xs4 class="padding-after">
                  <v-text-field v-model="formattedApiPort"
                                type="number"
                                label="Port"
                                prefix=":"
                                :rules="rules.numbersOnly"
                  />
                </v-flex>

                <v-flex xs3 class="padding-before">
                  <v-text-field v-model="settings.apiTimeout"
                                type="number"
                                label="Timeout"
                                suffix="ms"
                                :rules="rules.numbersOnly"
                  />
                </v-flex>
              </v-layout>
            </div>

            <div class="section" v-if="showAdvanced">
              <p>Auth Settings</p>

              <v-layout row>
                <v-flex xs5>
                  <v-text-field v-model="settings.authIp"
                                label="IP"
                                :rules="rules.validIP"
                  />
                </v-flex>

                <v-flex xs4 class="padding-after">
                  <v-text-field v-model="formattedAuthPort"
                                type="number"
                                label="Port"
                                prefix=":"
                                :rules="rules.numbersOnly"
                  />
                </v-flex>

                <v-flex xs3 class="padding-before">
                  <v-text-field v-model="settings.authTimeout"
                                type="number"
                                label="Timeout"
                                suffix="ms"
                                :rules="rules.numbersOnly"
                  />
                </v-flex>
              </v-layout>
            </div>

            <div class="section" v-if="showAdvanced">
              <p>Attachment Settings</p>

              <v-layout row>
                <v-flex xs5>
                  <v-text-field v-model="settings.attachmentIp"
                                label="IP"
                                :rules="rules.validIP"
                  />
                </v-flex>

                <v-flex xs4 class="padding-after">
                  <v-text-field v-model="formattedAttachmentPort"
                                type="number"
                                label="Port"
                                prefix=":"
                                :rules="rules.numbersOnly"
                  />
                </v-flex>
              </v-layout>
            </div>

            <v-btn flat block color="accent" @click="toggleAdvanced">
              {{ showAdvanced ? 'Hide advanced' : 'Show advanced' }}
              <v-icon right class="r-anim" :class="{r180: showAdvanced}">
                arrow_drop_down
              </v-icon>
            </v-btn>

          </v-form>

        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn flat @click="resetSettings">
            Reset
          </v-btn>

          <v-btn flat @click="saveSettings"
                 color="accent"
                 :disabled="!dirty"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

</template>

<script>
  import { mapState } from 'vuex';

  import store from '@/store';
  import { isDev } from '@/env';
  import snackbar from '@/utils/snackbar';

  const ipRegex = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/;

  const rules = {
    numbersOnly: [v => (v && /^\d+$/.test(v)) || 'Numbers only'],
    validIP: [v => (v && ipRegex.test(v)) || 'Not a valid IP'],
  }

  const tabs = () => {
    const tabs = [
      { label: 'Allocator', value: 'allocator' },
      { label: 'Payments', value: 'payments' },
    ];
    if (store.state.settings.enableBills) {
      tabs.push({ label: 'Bills', value: 'bills' })
    }
    return { tabs };
  }

  const initialState = () => ({
    rules,
    settings: { ...store.state.settings },
    ...tabs(),
    showAdvanced: false,
    valid: false,
    dirty: false,
  });

  export default {
    name: 'Settings',

    data: () => (initialState()),

    computed: {
      formattedApiPort: {
        get() {
          const port = this.settings.apiPort;
          return port.substring(1, port.length - 1);
        },
        set(port) {
          this.settings.apiPort = `:${port}/`;
        }
      },

      formattedAuthPort: {
        get() {
          const port = this.settings.authPort;
          return port.substring(1, port.length - 1);
        },
        set(port) {
          this.settings.authPort = `:${port}/`;
        }
      },

      formattedAttachmentPort: {
        get() {
          const port = this.settings.attachmentPort;
          return port.substring(1, port.length - 1);
        },
        set(port) {
          this.settings.attachmentPort = `:${port}/`;
        }
      },

      bytesToKBs: {
        get() {
          return this.settings.importFileSizeLimit / 1000
        },
        set(KB) {
          if (/^\d+$/.test(KB)) this.settings.importFileSizeLimit = KB * 1000;
        }
      }
    },

    watch: {
      settings: {
        handler: function (changes) {
          const newSate = JSON.stringify(changes);
          const inititalState = JSON.stringify(initialState().settings);
          this.dirty = newSate != inititalState;
        },
        deep: true,
      }
    },

    methods: {
      goBack() {
        console.log(this.$router);
        this.$router.go(-1);
        // window.history.back();
      },

      toggleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
      },

      toggleBillsTab(enabled) {
        console.log(enabled);
        if (enabled) this.tabs.push({ label: 'Bills', value: 'bills' });
        else {
          this.tabs = this.tabs.filter(tab => tab.value != 'bills');
          if (this.settings.defaultTab == 'bills')
            this.settings.defaultTab = 'allocator';
        }
      },

      saveSettings() {
        if (this.$refs.form.validate()) {
          const settings = {};
          for (const prop in this.settings) {
            settings[prop] = this.settings[prop];
          }
          store.dispatch('settings/setSettings', settings);
          this.dirty = false;
        } else {
          snackbar.warn('Can\'t save invalid settings');
        }
      },

      resetSettings() {
        store.dispatch('settings/resetSettings');
        const { showAdvanced } = this;
        Object.assign(this.$data, { ...initialState(), showAdvanced });
      },

      setEnvironment(env) {
        const IPs = { prod: '192.168.1.5', dev: '192.168.2.22' }
        this.settings.apiIp = IPs[env];
        this.settings.authIp = IPs[env];
        this.settings.attachmentIp = IPs[env];
      },
    },
  };
</script>

<style lang="scss" scoped>
  .section {
    &:not(:last-child) {
      margin-bottom: 12px;
    }

    > p {
      color: #1e88e5;
      font-size: 16px;
      font-weight: 400;
      text-transform: capitalize;
    }
    /deep/ .v-list__tile {
      padding: 0;
    }
  }

  .v-toolbar {
    z-index: 0;
  }
  .v-card__actions .v-btn + .v-btn {
    margin: 0;
  }
</style>


