<template>
  <v-col cols="12">
    <v-card>
      <v-subheader>Messages</v-subheader>

      <v-list two-line>
        <template v-for="user in users">
          <v-list-item :key="user._id" :to="{ name: 'message.view', params: { id: user._id } }">
            <v-list-item-avatar color="grey darken-1">
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ user.username }}</v-list-item-title>

              <v-list-item-subtitle>
                Lorem ipsum dolor sit amet, consectetur adipisicing
                elit. Nihil repellendus distinctio similique
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-col>
</template>

<script>
import Vue from 'vue'
import * as services from '../../services'
const { userService } = services.default

export default Vue.extend({
  name: 'Message',
  data: () => ({
    users: []
  }),
  created: async function () {
    this.users = await userService.getUsers()
  }
})
</script>
