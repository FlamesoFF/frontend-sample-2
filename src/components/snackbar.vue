<template>
    <v-snackbar bottom left
                v-model="active"
                :timeout="duration"
                :color="color"
    >
      <span>
        <v-icon dark v-show="icon">{{ icon }}</v-icon>
        {{ message }}
      </span>
      <v-btn flat :color="color ? '' : 'accent'"
             @click="$store.dispatch('snackbar/action', action.method)"
      >
        {{ action.label }}
      </v-btn>
    </v-snackbar>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'Snackbar',

    computed: {
      ...mapState('snackbar', [
        'visible',
        'message',
        'action',
        'duration',
        'color',
      ]),

      active: {
        get() {
          return this.visible;
        },
        set(visibility) {
          this.$store.commit('snackbar/setVisibility', visibility);
        }
      },

      icon() {
        let icon;

        if (this.color == 'success') icon = 'check_circle';
        if (this.color == 'warning') icon = 'warning';
        if (this.color == 'error') icon = 'error';
        if (this.color == 'info') icon = 'info';

        return icon;
      }
    },
  };
</script>

<style scoped lang="scss">
  .v-snack__content {
    span {
      display: flex;
      align-items: center;
    }
    .v-icon {
      margin-left: -8px;
      margin-right: 8px;
    }
  }
</style>
