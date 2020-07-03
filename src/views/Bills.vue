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
        <transition name="fade">
          <v-progress-linear indeterminate
                             height="5"
                             color="accent"
                             query
                             v-show="false"
          ></v-progress-linear>
        </transition>

        <v-container fluid>

          <v-form ref="form" v-model="valid" lazy-validation>
            
            <v-select dense class="required"
                      v-model="agentId"
                      :items="agents"
                      item-text="name"
                      item-value="id"
                      label="Select agent"
                      required
            >
              <template slot="item" slot-scope="data">
                <b>{{ data.item.name.split(' ')[0] }}</b>&nbsp;
                <i>{{ data.item.name.split(' ')[1] }}</i>
                {{ data.item.name.split(' ')[2] }}
              </template>
            </v-select>

            <v-combobox multiple clearable chips small-chips
                        class="required"
                        v-model="tags"
                        :items="templates"
                        label="Description"
                        :disabled="!agentId"
            >
              <template slot="selection"
                        slot-scope="data"
              >
                <v-chip close small
                        :selected="data.selected"
                >
                  <strong>{{ data.item }}</strong>&nbsp;
                </v-chip>
              </template>
            </v-combobox>

          </v-form>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import { LocalStorage as LS } from '@apollo4u/auxiliary';

  export default {
    data() {
      return {
        valid: false,

        agentId: '',
        tags: [],

        agents: [
          { id: 7, name: 'Agent 007' },
          { id: 47, name: 'Agent 47' },
          { id: 48, name: 'Agent J' },
          { id: 50, name: 'Agent Smith' },
          { id: 69, name: 'Austin Powers' },
          { id: 70, name: 'Sam Fisher' },
          { id: 71, name: 'Solid Snake' },
        ],

        templates: ['A18', 'A17', 'P10', 'P50']
      }
    },

    mounted() {
      // LS.setItem('testValue', false)
      // console.log('Test value:', LS.getItem('testValue'))
    },
  }
</script>

<style>
</style>
