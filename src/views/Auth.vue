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

        <v-toolbar card dense>
          <v-toolbar-title class="subheading grey--text">{{greeting}}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon ripple to="/settings">
            <v-icon class="grey--text">settings</v-icon>
          </v-btn>
        </v-toolbar>

        <v-container fluid>
          <v-form ref="form" v-model="valid" lazy-validation>

            <v-text-field v-model="username"
                          :rules="rules.username"
                          label="Username"
                          @keydown.native.enter="validateUser"
            ></v-text-field>

            <v-text-field v-model="password"
                          :append-icon="show ? 'visibility_off' : 'visibility'"
                          :rules="rules.password"
                          :type="show ? 'text' : 'password'"
                          label="Password"
                          @click:append="show = !show"
                          @keydown.native.enter="validateUser"
            ></v-text-field>

          </v-form>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat
                 color="accent"
                 :loading="submitting"
                 @click="validateUser"
          >
            Sign in
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>

</template>

<script>
  import { mapState } from 'vuex';

  import { isDev } from '@/env'
  import Auth from '@/api/auth';
  import greet from '@/utils/greetings'

  let tempUser;
  if (isDev) try {
    tempUser = require('../temp/dev.json');
  } catch (error) {
    console.warn(error.toString());
  }

  let defaultData = {
    username: '',
    password: '',

    show: false,
    valid: false,
    greeting: '',

    rules: {
      username: [
        v => !!v || 'Please enter a username',
        v => (v && v.length > 3) || 'Username is too short'
      ],
      password: [
        v => !!v || 'Please enter a password',
        v => (v && v.length > 3) || 'Password is too short'
      ],
    }
  }

  if (isDev && tempUser) {
    defaultData = {...defaultData, ...tempUser };
  }

  export default {
    name: 'Auth',

    data: () => (defaultData),

    computed: {
      ...mapState('auth', ['submitting']),
    },

    methods: {
      validateUser() {
        if (!this.submitting) {

          if (this.$refs.form.validate()) {
            const { username, password } = this;
            this.$store.dispatch('auth/signIn', { username, password });
          }
        }
      },

      greet,
    },

    created() {
      this.greeting = greet();
    }
  };
</script>

<style lang="scss" scoped>

.v-toolbar {
  z-index: 0;
}

</style>


