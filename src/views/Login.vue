<template>
  <v-main>
    <v-container>
      <v-form
        ref="form"
        v-model="valid"
      >
        <v-text-field
          v-model="user.username"
          :counter="10"
          label="username"
          required
        ></v-text-field>
        <v-text-field
          v-model="user.password"
          :counter="10"
          label="password"
          type="password"
          required
        ></v-text-field>

        <v-btn
          :disabled="!valid"
          color="warning"
          class="mr-4"
          @click="save"
        >
          Save
        </v-btn>
      </v-form>
    </v-container>
  </v-main>
</template>

<script>
import Vue from 'vue'
import * as services from '../services'
const { userService } = services.default

export default Vue.extend({
  name: 'Register',
  data: () => ({
    valid: true,
    user: {
      username: '',
      password: ''
    }
  }),
  methods: {
    async save () {
      try {
        const user = await userService.login(this.user.username, this.user.password)
        localStorage.setItem('user', JSON.stringify(user))
        this.$notify({
          group: 'alert',
          title: 'Login Successful',
          type: 'success'
        })
        this.$router.replace({ name: 'message.list' })
      } catch (e) {
        this.$notify({
          group: 'alert',
          title: 'User not found',
          text: 'Username/password did not match any user',
          type: 'error'
        })
      }
    }
  }
})
</script>
