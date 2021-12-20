import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

import '@vueform/multiselect/themes/default.css'

import './style/main.scss'

import router from './router.js'
import countriesStore from './store/countries'

const app = createApp(App)
app.use(router)
app.use(countriesStore)
app.use(BootstrapVue3)

app.mount('#app')
