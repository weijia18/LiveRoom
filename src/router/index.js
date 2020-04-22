import Vue from 'vue'
import Router from 'vue-router'
import LiveRoom from '@/components/LiveRoom'
import ChatRoom from '@/components/ChatRoom'
import OnLine from '@/components/OnLine'

Vue.use(Router)

export default new Router({
  mode:"history",
  routes: [
    {
      path: '/',
      name: 'LiveRoom',
      component: LiveRoom,
      redirect:"/chatroom"
    },
    {
      path: '/chatroom',
      component: ChatRoom
    },
    {
      path: '/online',
      component: OnLine
    }
  ]
})
