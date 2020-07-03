<template>

  
  <v-app>
    <!-- <v-navigation-drawer app></v-navigation-drawer> -->

    <v-toolbar color="primary" dense dark>
      <tabs/>
      <v-spacer></v-spacer>
      <toolbar/>
    </v-toolbar>

    <v-content>
      <v-container class="main">
        <transition name="slide-fade" mode="out-in">
          <router-view :key="$route.fullPath"/>
        </transition>
      </v-container>
    </v-content>

    <snackbar/>

  </v-app>

</template>

<script>
  import { mapState } from 'vuex';
  
  import toolbar from '@/components/toolbar.vue';
  import tabs from '@/components/tabs.vue';
  import snackbar from '@/components/snackbar.vue';

  export default {
    name: 'App',
    components: {
      toolbar,
      tabs,
      snackbar,
    },

    computed: {},

    created() {
      this.$store.dispatch('auth/updateStatus');
    }
  }

</script>

<style lang="scss">

  @import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,400i,700|Roboto:300,400,400i,500,700&subset=cyrillic-ext,latin-ext');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  // icons repo not up-to-date, using CDN

  html {
    overflow-y: auto !important;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #e1e1e1
  }

  ::-webkit-scrollbar-thumb {
    background: #757575;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }
  
  // Vuetify hacks
  // Hide down_arrow on chips
  .v-text-field .v-input__append-inner:nth-child(4) {
    display: none !important;
  }

  // .v-content__wrap {
  //   transition: .2s .2s cubic-bezier(.4,0,.2,1);
  // }

  .darwin {
    .application--wrap {
      min-height: calc(100vh - 22px);
    }
  }
  .win32 {
    .application--wrap {
      min-height: calc(100vh - 32px);
    }
  }

  @media screen and (max-width: 959px) {
    .v-content {
      max-height: calc(100vh - 48px);
      overflow: auto;
    }
    .darwin .v-content {
      max-height: calc(100vh - 70px);
    }
    .win32 .v-content {
      max-height: calc(100vh - 80px);
    }
  }

  @media screen and (min-width: 960px) {
    .v-content__wrap {
      // max-height: calc(100vh - 48px);
      overflow: auto;
    }

  }

  @media screen and (max-width: 600px) {
    .container.main {
      padding: 0;
    }
    .v-card.main {
      min-height: calc(100vh - 48px);
    }
    .darwin .v-card.main {
      min-height: calc(100vh - 70px);
    }
    .win32 .v-card.main {
      min-height: calc(100vh - 80px);
    }
    .slide-fade-enter,
    .slide-fade-leave-to {
      transform: translateY(-16px);
    }
  }

  @media screen and (min-width: 601px) {
    .container.main {
      // height: 100%;
      max-width: 500px;
    }
    .slide-fade-enter {
      transform: translateX(-16px);
    }
    .slide-fade-leave-to {
      transform: translateX(16px);
    }
  }

  .v-toolbar {
    z-index: 1;
  }

  .v-card.main {
    .v-progress-linear {
      margin: 0 0 -5px 0;
    }
    .container {
      padding: 20px 30px;
    }
  }

  .application--wrap,
  .v-content,
  .v-card.main {
    transition: none !important;
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.2s;
  }
  .slide-fade-enter,
  .slide-fade-leave-to {
    opacity: 0;
  }

  .required label::after {
    content: ' *';
    color: #ff9800; // accent
  }

  .bulleted::before {
    content: '•';
    margin: 0 4px;
  }

  .r-anim { transition: transform 0.2s ease-out !important; }
  .r180 { transform: rotate(-180deg); }

  .capitalize {text-transform: capitalize; }
  .condensed { font-family: 'Roboto Condensed'; }

  .padding-before { padding-left: 8px; }
  .padding-after { padding-right: 8px; }
  .margin-before { margin-left: 8px; }
  .margin-after { margin-right: 8px; }

  .no-counter {
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none; 
        margin: 0;
    }
  }

  .waived {
    input, .v-label {
      text-decoration: line-through;
    }
  }
  
  .v-text-field .v-label--active {
    max-width: 135% !important;
  }

  .v-card__actions .v-btn {
    padding: 0 8px;
  }

</style>
