<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center"><img style="padding:5px 0px 5px 0px" src="assets/images/main-logo.png" alt=""></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-text-center">

      <login v-if="!isLogged" @singIn="singIn" ></login>
      <dashboard v-else></dashboard>

    </ion-content>
  </ion-page>
</template>
<script>

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';

import { addIcons } from 'ionicons';
import { sync , checkmarkCircleOutline , trophy } from 'ionicons/icons';

import Login from '../components/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import axios from 'axios';

export default {
    name: 'Home',
    components: { 'login': Login , 'dashboard': Dashboard , IonPage, IonHeader, IonToolbar, IonTitle, IonContent },
    data() {
        return {
          isLogged: false,
        }
    },
    methods: {
      singIn(){
        this.isLogged = true;
      },
      getIncidences(){
        console.log('getting incidences')
        if(!localStorage.getItem('incidences-entrega')){
          axios.get('https://preventa.plantroya.com/api/v1/seller/poll/getincidences' )
            .then( response => {
                localStorage.setItem('incidences-entrega', JSON.stringify(response.data.rows))
            })
            .catch( failure => {
                console.log(failure)
            })
        }
      }
    },
    setup() {
      const router = useRouter();
      return { router };
    },
    created() {
      addIcons({
        'sync': sync,
        'checkmark-circle-outline': checkmarkCircleOutline,
        'trophy': trophy
      })
    },
    mounted(){
      this.getIncidences();
    }
}

</script>
<style scoped>
  .border{
    border: 1px solid #fff;
    border-radius: .25rem;
  }
  .ruta-item{
    background-color: #181b1f;
    border-radius: .25rem;
  }
</style>