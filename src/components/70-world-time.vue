<template>
  <div>
    <div>
      <WorldMap @map-clicked="what" />
    </div>
    <input type="text" :value="geoPosition">
    <button @click="searchCity">Add New Clock</button>
    <button @click="addClock">Save Last Coordinates</button>
    <button @click="loadClocks">Load Saved Coordinates</button>
    <div id="clocks">
      <Clock v-for="(c,pos) in selectedCities" :key="pos"
        :time-zone="c.timeZone" :label="c.name">
      </Clock>
    </div>
    <button v-for="(c,pos) in selectedCities" :key="pos" @click="deleteClock(pos)"> Delete {{c.name}}</button>
  </div>
</template>

<script lang="ts">
// import ChildComponent from "./60-props-child.vue";
import axios, { AxiosResponse } from "axios";
import Clock from "./70-clock.vue";
import WorldMap from "./70-world-map.vue";
import { Vue, Component } from "vue-property-decorator";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth
} from "firebase/auth";
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
  QuerySnapshot,
  QueryDocumentSnapshot,
  deleteDoc,
  where,
  query,
} from "firebase/firestore";
const timezoneDBUrl = "http://api.timezonedb.com/v2.1";

type City = {
  name: string;
  timeZone: string;
};

type TimeZoneData = {
  countryName: string;
  gmtOffset: number;
  regionName: string;
  zoneName: string;
};

@Component({ components: { Clock, WorldMap } })
export default class Sample extends Vue {
  geoPos: { lat?: number; lng?: number } = {};
  selectedCities: Array<City> = [];
  currentCity: Array<City> = [];
  apiKey = "";
  mounted(): void {
    this.apiKey = process.env.VUE_APP_TIMEZONE_API_KEY; 
    let uid = null;
    const auth = getAuth();
    if(auth.currentUser != null){
      uid= auth.currentUser.uid;
    }
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
    // const collref: CollectionReference = collection(db, "users");
    const userDoc: DocumentReference = doc(db, "users", ""+ uid+ "");
    /* const cityColl: CollectionReference = collection(db, "users", ""+ uid, "userCities");
    const regionDoc: DocumentReference = doc(db, "users", ""+ uid, "userCities", "region");
    let currArray; */
    setDoc(userDoc, { name: uid});
    this.selectedCities = [];
    this.loadClocks();
  }
  get geoPosition(): string {
    if (this.geoPos.lat && this.geoPos.lng)
      return `${this.geoPos.lat.toPrecision(5)},${this.geoPos.lng.toPrecision(
        5
      )}`;
    else return "N/A";
  }
  
  searchCity(): void {
    this.selectedCities = this.selectedCities.filter(
    (element, i) => i === this.selectedCities.indexOf(element)
    ); 
    const param = new URLSearchParams();
    param.append("key", this.apiKey);
    param.append("format", "json");
    param.append("by", "position");
    param.append("lat", this.geoPos.lat!.toString());
    param.append("lng", this.geoPos.lng!.toString());
    const tzUrl = `${timezoneDBUrl}/get-time-zone?` + param.toString();
    // Use a Web Proxy Server to get around CORS issue
    // since timezonedb.com does not allow CORS
    axios
      .request({
        method: "GET",
        url: "https://api.allorigins.win/get",
        params: {
          url: tzUrl,
        },
      })
      .then((r: AxiosResponse) => {
        return r.data;
      })
      .then((r: any) => JSON.parse(r.contents))
      .then((r: TimeZoneData) => {
        // Add the selected location to our array
          //if(this.selectedCities.lastIndexOf({name: r.regionName, timeZone: r.zoneName}) <=0 ){
            for (let index = 0; index < this.selectedCities.length; index++) {
              if(this.selectedCities[index].name == r.regionName && this.selectedCities[index].timeZone == r.zoneName){
                this.selectedCities.splice(index, 1);
              }
              
            }
            this.selectedCities.push({name: r.regionName, timeZone: r.zoneName});
            this.currentCity.pop();
            this.currentCity.push({name: r.regionName, timeZone: r.zoneName});
            //}
      });
  }
  addClock():void{
    let uid = null;
    const auth = getAuth();
    if(auth.currentUser != null){
      uid= auth.currentUser.uid;
    }
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
    //const collref: CollectionReference = collection(db, "users");
    //const userDoc: DocumentReference = doc(db, "users", ""+ uid+ "");
    const cityColl: CollectionReference = collection(db, "users", ""+ uid, "userCities");
    //const regionDoc: DocumentReference = doc(db, "users", ""+ uid, "userCities", "region");
    for (let index = 0; index < this.currentCity.length; index++) {
      addDoc(cityColl, {name: this.currentCity[index].name, timeZone: this.currentCity[index].timeZone});
    }
  }

deleteClock(pos: number):void{
    const auth = getAuth();
    if(auth.currentUser != null){
      const uid= auth.currentUser.uid;
    
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
    //const collref: CollectionReference = collection(db, "users");
    //const userDoc: DocumentReference = doc(db, "users", ""+ uid+ "");
    const cityColl: CollectionReference = collection(db, "users", ""+ uid, "userCities");
    //const regionDoc: DocumentReference = doc(db, "users", ""+ uid, "userCities", "region");
    getDocs(cityColl).then((qs: QuerySnapshot) => {
    qs.forEach((qd: QueryDocumentSnapshot) => {
      if(qd.data().name == this.selectedCities[pos].name){
        deleteDoc(doc(db, "users", "" + uid, "userCities", "" + qd.id));
      }
    });
  });
  }
}

loadClocks(): void{
  this.selectedCities = [];
  let uid = null;
    const auth = getAuth();
    if(auth.currentUser != null){
      uid= auth.currentUser.uid;
    }
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
    const cityColl: CollectionReference = collection(db, "users", ""+ uid, "userCities");
    getDocs(cityColl).then((qs:QuerySnapshot) => {
    qs.forEach((qd: QueryDocumentSnapshot) => {
        this.selectedCities.push({name: qd.data().name, timeZone: qd.data().timeZone})
      console.log("From Firestore: ", qd.id, qd.data());
      
    });
    });   
}
  what(geoPos: { lat: number; lng: number }): void {
    // When the user pans the map left/right the longitude
    // angle can be out of the [-180,+180] range
    while (geoPos.lng > 180) geoPos.lng -= 360;
    while (geoPos.lng < -180) geoPos.lng += 360;
    this.geoPos = { ...geoPos };
  }
}
</script>

<style scoped>
#clocks {
  margin-top: 1em;
}

pre {
  white-space: normal;
  padding: 0.5em;
  border: 2px solid gray;
}
</style>