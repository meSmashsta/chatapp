<template>
  <v-col cols="12">
    <v-list two-line>
      <template>
        <v-list-item v-for="message in messages" :key="message._id">
          <v-list-item-avatar color="grey darken-1" v-if="message.senderId !== loggedInUser._id">
          </v-list-item-avatar>
          <v-list-item-content v-bind:class="{ 'text-right align-self-start': message.senderId === loggedInUser._id }">
            <v-list-item-subtitle>
              {{ message.message }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <v-footer
      app
      color="transparent"
      height="72"
      inset
    >
    <v-text-field
      background-color="grey lighten-1"
      dense
      flat
      hide-details
      rounded
      v-model="message"
      solo
      @keydown.enter="submit"
    ></v-text-field>
    </v-footer>
  </v-col>
</template>

<script>
import Vue from 'vue'
import * as services from '../../services'
const { chatService, userService } = services.default

export default Vue.extend({
  name: 'Message',
  data: () => ({
    messages: [],
    message: '',
    recepientId: '',
    loggedInUser: {
      _id: ''
    }
  }),
  created: async function () {
    this.loggedInUser = userService.getLoggedInUser()
    const { _id: senderId } = this.loggedInUser
    const { id: recepientId } = this.$route.params
    this.recepientId = recepientId
    this.messages = await chatService.getMessages(senderId, recepientId)
    chatService.getMessagesRealmTime(senderId, recepientId, (message) => {
      this.messages.push(message)
    })
  },
  methods: {
    async submit () {
      const { _id } = this.loggedInUser
      const result = await chatService.createMessage({
        senderId: _id,
        recepientId: this.recepientId,
        message: this.message
      })
      this.message = ''
      const { id } = result
      chatService.getMessage(id)
    }
  }
})
</script>
