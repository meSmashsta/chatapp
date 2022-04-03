import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Message from '../views/message/Message.vue'
import MessageList from '../views/message/MessageList.vue'
import MessageView from '../views/message/MessageView.vue'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/message'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/message',
    component: Message,
    children: [
      { path: '', name: 'message.list', component: MessageList },
      { path: 'view/:id', name: 'message.view', component: MessageView }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
