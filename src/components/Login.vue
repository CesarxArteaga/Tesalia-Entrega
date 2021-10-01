<template>
  <div>
      <h4>Ingresar al sistema</h4>
      <p class="ion-margin ion-text-left alert">Recuerde ingresar desde la agencía o desde un lugar con acceso a internet.</p>
      <ion-item color="dark" class="ion-margin border" >
        <ion-label position="floating">Cédula</ion-label>
        <ion-input v-model="code" inputmode="numeric"></ion-input>
      </ion-item>
      <ion-item color="dark" class="ion-margin border">
        <ion-label position="floating">Ruta</ion-label>
        <ion-input v-model="ruta" inputmode="numeric"></ion-input>
      </ion-item>
      <p v-if="isFetching">
        <ion-spinner></ion-spinner>
      </p>
      <ion-button @click="login">Iniciar Sesión</ion-button>
  </div>
</template>

<script>
import { IonItem , IonLabel , IonInput , IonButton , IonSpinner , toastController } from '@ionic/vue';
import { addIcons } from 'ionicons';
import { sync , checkmarkCircleOutline , trophy } from 'ionicons/icons';
import axios from 'axios';

export default {
    name: 'Login',
    components: { IonItem , IonLabel , IonInput , IonButton , IonSpinner },
    data() {
      return {
        code: '', //1317031373
        ruta: '', //"501115"
        isFetching: false
      }
    },
    methods: {
        login(){
            if(this.code === '' || this.ruta === ''){
                this.openToast('Ingrese todos los campos','danger')
            }else{
                this.isFetching = true;
                const params = { 'code': this.code };
                axios.get('https://entrega.plantroya.com/api/v1/distributor' , { params: params } )
                //axios.get('http://tesalia.delivery.wa.test/api/v1/distributor' , { params: params } )
                .then(response => {
                    console.log(response.data)
                    if(response.data.status){
                        setTimeout(() => {
                          this.isFetching = false;
                          this.$store.dispatch('SET_CEDULA_ACTION', this.code);
                          this.$store.dispatch('SET_RUTA_ACTION', this.ruta);
                          this.$store.dispatch('SET_DISTRIBUTOR_ACTION', response.data.row )
                          localStorage.setItem('login-delivery',JSON.stringify(response.data.row));
                          localStorage.setItem('way-delivery',this.ruta);
                          this.$emit('singIn');
                        }, 500 );
                    }else{
                      this.isFetching = false;
                      this.openToast(response.data.message,'danger');
                    }
                })
                .catch(err => {
                    this.isFetching = false;
                    this.openToast(err,'danger');
                    console.log(err)
                }) 
            }
        },
        async openToast(msg,color) {
            const toast = await toastController
                .create({
                    color: color,
                    message: msg,
                    duration: 2000
                })
            return toast.present();
        }
    },
    created() {
      addIcons({
        'sync': sync,
        'checkmark-circle-outline': checkmarkCircleOutline,
        'trophy': trophy
      })
    },
    mounted(){
      if(localStorage.getItem('login-delivery')){
        const distributor = JSON.parse(localStorage.getItem('login-delivery'))
        this.$store.dispatch('SET_DISTRIBUTOR_ACTION', distributor);
        this.$store.dispatch('SET_CEDULA_ACTION', distributor.code );
        this.$store.dispatch('SET_RUTA_ACTION', localStorage.getItem('way-delivery') );
        this.$emit('singIn');
      }
    }
}
</script>

<style scoped>
  .alert{
    background-color: rgb(253, 167, 55);
    border-radius: .25rem;
    padding: .5rem;
    color: rgb(104, 67, 0);
  }
</style>