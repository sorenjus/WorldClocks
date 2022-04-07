<template>
  <div class="home">
    <h2>This is the main page</h2>
    <p>{{userInfo}}</p>
    <img :src="userPhotoURL" v-if="userPhotoURL.length > 0" width="64">
    <button @click="outtahere">Logout</button>
    <button @click="DeleteUser">Delete Account</button>
    <button @click="DisplayMap">See Map</button>
  </div>
</template>

<script lang="ts">

import App from "../components/70-world-time.vue";
import { Component, Vue } from "vue-property-decorator";
import {
  getAuth,
  onAuthStateChanged,
  User,
  Auth,
  signOut,
  deleteUser,
} from "firebase/auth";
import { deleteDoc } from "@firebase/firestore";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  getDocs,
  setDoc,
  getFirestore,
  terminate,
  waitForPendingWrites, 
  QuerySnapshot,
  QueryDocumentSnapshot,
  query,
  where
} from "firebase/firestore";
import { FirebaseApp, initializeApp } from "firebase/app";
@Component
export default class HomeView extends Vue {
  userPhotoURL = "";
  auth: Auth | null = null;
  userInfo = "";
  mounted(): void {
    this.auth = getAuth();
    onAuthStateChanged(this.auth, (user: User | null) => {
      console.log("Auth changed", user);
      if (user) {
        this.userPhotoURL = user.photoURL ?? "";
        this.userInfo = `${user.displayName}`;
      }
    });
  }
  DisplayMap(): void{
    new Vue({
          render: (h) => h(App),}).$mount("#app");
  }

  
  DeleteUser(): void{
    const auth = getAuth();
    const user = auth.currentUser;
    let uid = null;
    if(auth.currentUser != null){
      uid= auth.currentUser.uid;}
    const firebaseConfig = {
      apiKey: "AIzaSyC0tSdEH_t353PD8Wl6aTv9GOYmL2OtoSc",
      authDomain: "firestore-21f91.firebaseapp.com",
      projectId: "firestore-21f91",
      storageBucket: "firestore-21f91.appspot.com",
      messagingSenderId: "274792513680",
      appId: "1:274792513680:web:c0e1f30102ebf7bed45815",
      measurementId: "G-EGKP5CX1WV"
      };
    const app: FirebaseApp = initializeApp(firebaseConfig, "Users");
    const db: Firestore = getFirestore(app);
    const userDoc: DocumentReference = doc(db, "users", ""+ uid+ "");
    const cityColl: CollectionReference = collection(db, "users", ""+ uid+ "", "userCities");
    if(user){
      deleteDoc(userDoc);
      deleteUser(user).then(() => {
      // User deleted.
        }).catch((error) => {
        // An error ocurred
        });
    }
    if (this.auth) signOut(this.auth);

    // Back to the previous page
    this.$router.back();
  }
  outtahere(): void {
    if (this.auth) signOut(this.auth);

    // Back to the previous page
    this.$router.back();
  }
}
</script>
