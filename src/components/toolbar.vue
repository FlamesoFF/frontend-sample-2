<template>

  <div>
    <transition name="slide-fade" mode="out-in">
      <v-layout v-if="isAuthorized" key="1"
                align-center justify-center row
      >
        <v-tooltip bottom>
          <v-btn icon slot="activator" @click="refresh">
            <v-icon>refresh</v-icon>
          </v-btn>
          <span>Refresh accounts</span>
        </v-tooltip>

        <v-menu offset-y left min-width="330" max-width="330"
                :close-on-content-click="false"
                transition="slide-y-transition"
                @blur="rolesExpanded = false"
        > 
          <v-tooltip bottom slot="activator" nudge-right="30">
            <v-avatar size="40" slot="activator">
              <img :src="avatar"
                  alt="User"
                  @error="onError"
              >
            </v-avatar>
            <span>User details</span>
          </v-tooltip>

          <v-list>
            <v-list-tile>
              <v-list-tile-avatar>
                <img :src="avatar"
                alt="User"
                @error="onError"
                >
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ user.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ user.email }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <!-- <v-list-tile-action>
                <v-btn icon ripple @click="$store.dispatch('auth/signOut')">
                  <v-icon color="error">exit_to_app</v-icon>
                </v-btn>
              </v-list-tile-action> -->
            </v-list-tile>

            <!-- <v-layout row style="margin: 4px 10px 0;"> -->
            <!-- <v-list-tile> -->
              <v-flex wrap style="padding: 4px 12px;">
                <v-chip v-for="(role, index) in user.roles"
                        v-bind:key="role"
                        v-if="index < 2 || rolesExpanded"
                        color="primary"
                        text-color="white"
                        small label
                >
                  {{ role }}
                </v-chip>
                <v-chip small label
                        color="primary"
                        text-color="white"
                        v-if="user.roles.length > 2 && !rolesExpanded"
                        @click="rolesExpanded = true"
                >
                  +{{user.roles.length - 2}}
                </v-chip>
              </v-flex>
            <!-- </v-list-tile> -->

            <v-list-tile class="condensed">
              <!-- <v-list-tile-content> -->
                <!-- <v-list-tile-title>{{ remainder }}</v-list-tile-title> -->
                <span>Session expires in:</span>
                <v-spacer></v-spacer>
                <v-progress-circular :value="100 * remainder / 43200000"
                                     class="margin-before margin-after"
                                     color="primary"
                                     :width="2"
                                     :size="25"
                >
                  <!-- {{ Math.floor(100 * remainder / 43200000) }} -->
                </v-progress-circular>
                <v-chip outline label color="primary">
                  {{ formatRemainder(remainder) }}
                </v-chip>
              <!-- </v-list-tile-content> -->
            </v-list-tile>


            <v-layout row>
              <v-flex xs-4 class="text-xs-center">
                <v-btn icon ripple to="/settings" :disabled="atSettings">
                  <v-icon>settings</v-icon>
                </v-btn>
              </v-flex>

              <v-divider inset vertical v-if="isElectron"></v-divider>

              <v-flex xs-4 class="text-xs-center" v-if="isElectron">
                <v-btn icon ripple @click="toggleDevTools()">
                  <v-icon>code</v-icon>
                </v-btn>
              </v-flex>

              <v-divider inset vertical></v-divider>

              <v-flex xs-4 class="text-xs-center">
                <v-btn icon ripple @click="$store.dispatch('auth/signOut')">
                  <v-icon color="error">exit_to_app</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
                
          </v-list>
            
        </v-menu>
      </v-layout>

      <!-- add layout here for other conditions -->
    </transition>
  </div>


</template>

<script>
  import * as moment from 'moment';
  import { mapGetters } from 'vuex';
  import router from '@/router';

  import { getRemainder,formatRemainder } from '@/utils/auth';
  import { isElectron, toggleDevTools } from '@/utils/electron-bridge';

  export default {
    name: 'Toolbar',

    data: () => ({
      remainder: '',
      rolesExpanded: false,
      atSettings: router.currentRoute.name == 'settings',
    }),

    computed: {
      ...mapGetters('auth', ['user', 'avatar', 'isAuthorized']),
      isElectron,
    },

    watch:{
      $route (to) {
        this.setAtSettings();
      },
    },

    methods: {
      toggleDevTools,

      getRemainder,
      // () {
      //   const remainder = getRemainder();

      //   // if (remainder) return `Session expires in: ${remainder}`;
      //   if (remainder) return remainder;
      //   // else return 'Session expired.';
      //   else return false;
      // },
      formatRemainder,

      refresh() {
        this.$store.dispatch('accounts/fetchAccounts');
      },

      onError(event) {
        const { target } = event;
        target.onerror = "";
        target.src = "img/no_avatar.png";
        return true;
      },

      setAtSettings() { this.atSettings = router.currentRoute.name == 'settings' }
    },

    mounted() {
      setInterval(_ => {
        // console.log(this.user.exp);
        if (this.user) this.remainder = getRemainder();
      }, 1000);
    }

  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .v-list {
    padding: 8px 0 0;
  }
  .condensed {
    .v-list__tile {
      height: auto !important;
    }
    .v-chip {
      margin: 0;
    }
  }
  .v-divider--vertical.v-divider--inset {
    margin-bottom: 8px;
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.5s;
    // position: absolute;
    // left: 16px !important;
    // right: 16px !important;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    opacity: 0;
  }
  .slide-fade-enter {
    transform: translateX(16px);
  }
  .slide-fade-leave-to {
    transform: translateX(16px);
  }
</style>
