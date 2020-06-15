import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Main from './views/Main.vue'

import AdminUserEdit from './views/AdminUserEdit.vue'
import AdminUserList from './views/AdminUserList.vue'

import CardEdit from './views/CardEdit.vue'
import CardList from './views/CardList.vue'

import MessageEdit from './views/MessageEdit.vue'
import MessageList from './views/MessageList.vue'

import TrestManagement from './views/TrestManagement.vue' 

import AccessFrom from './views/AccessFrom.vue' 

import Advertising from './views/Advertising.vue' 

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/login', name: 'login', component: Login, meta: { isPublic: true } },
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        { path: '/Card/create/:id', component: CardEdit },
        { path: '/Card/edit/:id', component: CardEdit, props: true },
        { path: '/Card/list', component: CardList },

        { path: '/Message/create', component: MessageEdit },
        { path: '/Message/edit/:id', component: MessageEdit, props: true },
        { path: '/Message/list', component: MessageList },

        { path: '/admin_users/create', component: AdminUserEdit },
        { path: '/admin_users/edit/:id', component: AdminUserEdit, props: true },
        { path: '/admin_users/list', component: AdminUserList },
 
        { path: '/test/trestManagement', component: TrestManagement },
        { path: '/statistical/AccessFrom', component: AccessFrom },
        { path: '/setting/Advertising', component: Advertising },
        
      ]
    },

  ]
})
router.beforeEach((to, from, next) => { 
  if (!to.meta.isPublic && !localStorage.token) {
    return next('/login')
  }
  next()
})
export default router