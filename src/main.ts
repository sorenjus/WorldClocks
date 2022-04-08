import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyC0tSdEH_t353PD8Wl6aTv9GOYmL2OtoSc",
  authDomain: "firestore-21f91.firebaseapp.com",
  projectId: "firestore-21f91",
  storageBucket: "firestore-21f91.appspot.com",
  messagingSenderId: "274792513680",
  appId: "1:274792513680:web:c0e1f30102ebf7bed45815",
  measurementId: "G-EGKP5CX1WV"
};
Vue.config.productionTip = false;
const app = initializeApp(firebaseConfig);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");