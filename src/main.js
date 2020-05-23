import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import VueCropper from 'vue-cropper'

import './style.css'

Vue.config.productionTip = false

import http from './http'
Vue.prototype.$http = http

Vue.mixin({
  computed: {
    uploadUrl(){
      return this.$http.defaults.baseURL + '/storage/upload'
    }
  },
  methods: {
    getAuthHeaders(){
      return {
        'token':localStorage.getItem('token')
        // Authorization: `Bearer ${localStorage.token || ''}`
      }
    }
  }
})

Vue.filter('dd', function (tplData) {
  let dateMM = tplData ? new Date(tplData) : new Date();
  let dateTT = tplData ? new Date(tplData) : new Date();
  let hours = dateTT.getHours() < 10 ? '0' : '';
  let min = dateTT.getMinutes() < 10 ? '0' : '';
  return `${dateMM.getFullYear()}-${dateMM.getMonth() + 1}-${dateMM.getDate()} ${hours + dateTT.getHours()}:${min + dateTT.getMinutes()}`;
});

Vue.filter('mDate', function (tData) {
  let dateTT = tData ? new Date(tData) : new Date();
  let hours = dateTT.getHours() < 10 ? '0' : '';
  let min = dateTT.getMinutes() < 10 ? '0' : '';
  return `${hours + dateTT.getHours()}:${min + dateTT.getMinutes()}`;
});

Vue.filter('myDate', function (txData) {
  let dateT = txData ? new Date(txData) : new Date();    
  return `星期${dateT.getDay()}`;
});
Vue.use(VueCropper)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
