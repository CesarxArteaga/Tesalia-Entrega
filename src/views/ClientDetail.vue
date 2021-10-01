<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center"><img style="padding:5px 0px 5px 0px" src="assets/images/main-logo.png" alt=""></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" color="dark" class="ion-text-center">

      <h6>Información de Usuario</h6>

      <ion-grid>
          <ion-row>
              <ion-col>
                  <ion-item color="dark" disabled="true" style="border: 1px solid #f1f1f1;border-radius:.5rem;font-weight:bold">
                      <ion-label position="stacked">Cédula</ion-label>
                      <ion-input v-model="cedula"></ion-input>
                  </ion-item>
              </ion-col>
              <ion-col>
                  <ion-item color="dark" disabled="true" style="border: 1px solid #f1f1f1;border-radius:.5rem;font-weight:bold">
                    <ion-label position="stacked">Ruta</ion-label>
                    <ion-input v-model="ruta"></ion-input>
                  </ion-item>
              </ion-col>
          </ion-row>
      </ion-grid>

      <h4>Seleccionar Cliente</h4>
        <ion-item color="dark" class="ion-margin border">
          <ion-label position="floating">Código de Cliente</ion-label>
          <ion-input v-model="codeClient"></ion-input>
        </ion-item>
        <ion-button @click="searchClient">
            Ingresar
        </ion-button>

      <p class="ion-margin" style="border-top:1px solid #FFF"></p>
      <h4>Registrar Nuevo Cliente</h4>
      <register></register>

    </ion-content>
  </ion-page>
</template>
<script>
/* eslint-disable */
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent , IonItem , IonLabel , IonInput , IonButton , IonGrid , IonRow , IonCol , IonIcon , toastController } from '@ionic/vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import { addIcons } from 'ionicons';
import { personAdd } from 'ionicons/icons';

import Register from '@/components/Register.vue';

export default {
    name: 'ClientDetail',
    components: { 'register': Register , IonPage, IonHeader, IonToolbar, IonTitle, IonContent , IonItem , IonLabel , IonInput , IonButton , IonGrid , IonRow , IonCol , IonIcon },
    data() {
        return {
            cedula: this.$store.getters.GET_CEDULA,
            ruta : this.$store.getters.GET_RUTA,
            codeClient: '',
            clientData: {},
            currentModal: null
        }
    },
    methods: {
      async searchClient(){
        if(this.codeClient == ''){
          this.openToastError('Ingrese el campo código de cliente')
        }else{
          const codeClient_ = this.codeClient
          axios.get(`http://tesalia.presale.wa.test/api/v1/seller/client?client_code=${codeClient_}`)
          .then(response => {
            console.log('from api prod')
            console.log(response.data)
            if(response.data.status){
              this.clientData = response.data.row
              this.goNext()
            }else{
              this.openToastError(response.data.message)
            }
          })
          .catch(err => {
            console.log(err)
          })
          
        }
      },
      goNext(){
        this.router.push('/poll')
      },
      async openToastError(msg) {
        const toast = await toastController
          .create({
            color: 'danger',
            message: msg,
            duration: 2000
          })
        return toast.present();
      }
      
    },
    setup() {
      const router = useRouter();
      return { router };
    },
    created() {
      addIcons({
        'person-add': personAdd
      })
    }
}
</script>
<style scoped>
  .border{
    border: 1px solid #fff;
    border-radius: .25rem;
  }
</style>