<template>
  <transition name="slide-fade">
          
    <v-tabs dark show-arrows
            color="transparent"
            class="white--text"
            slider-color="white"
            v-if="isAuthorized"
            :hide-slider="!showSlider"
    >

      <v-tab ripple
             v-for="route of routes"
             v-bind:key="route.path"
             :to="route.path"
      >
        {{ route.name }}
      </v-tab>
    </v-tabs>

  </transition>

</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  const getShowSlider = routeName => routeName == 'allocator' || routeName == 'payments';

  export default {
    name: 'Tabs',

    data() {
      return {
        routes: [
          { path: '/allocator', name: 'Receipt Allocator' },
          { path: '/payments' , name: 'Client Payments'   },
          // { path: '/bills'    , name: 'Bill Details'      },
        ],
        showSlider: getShowSlider(this.$router.currentRoute.name),
      }
    },

    computed: {
      ...mapGetters('auth', ['isAuthorized']),
      ...mapState('settings', ['enableBills'])
    },

    watch:{
      $route(to) {
        this.showSlider = getShowSlider(to.name);
      },

      enableBills(enabled) {
        console.log('tabs.vue:', enabled);
        if (enabled) this.routes.push({ path: '/bills', name: 'Bill Details' });
        else this.routes = this.routes.filter(r => r.path != '/bills');
      }
    },

    methods: {
      getShowSlider,
    },

    mounted() {
      if (this.enableBills) this.routes.push({ path: '/bills', name: 'Bill Details' });
    }

  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
    transform: translateX(-16px);
  }
  .slide-fade-leave-to {
    transform: translateX(-16px);
  }

  .v-tabs /deep/ {
    .v-tabs__icon {
      display: flex;
    }
    .v-tabs__icon--prev {
      left: -15px;
    }
    .v-tabs__wrapper.v-tabs__wrapper--show-arrows {
      margin-left: 18px;
    }
  }
</style>
