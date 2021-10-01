<template>
    <h6>Información de Usuario</h6>
    <ion-grid>
        <ion-row>
            <ion-col>
                <ion-item color="dark" disabled="true" class="border">
                    <ion-label position="stacked">Cédula</ion-label>
                    <ion-input v-model="cedula"></ion-input>
                </ion-item>
            </ion-col>
            <ion-col>
                <ion-item color="dark" disabled="true" class="border">
                <ion-label position="stacked">Ruta</ion-label>
                <ion-input v-model="ruta" ></ion-input>
                </ion-item>
            </ion-col>
        </ion-row>
    </ion-grid>

    <h6>Seleccionar Cliente</h6>
    <ion-grid>
        <ion-row>
            <ion-col>
                <ion-item color="dark" class="border">
                    <ion-label position="floating">Código Cliente</ion-label>
                    <ion-input v-model="codeClient" inputmode="numeric"></ion-input>
                </ion-item>
            </ion-col>
        </ion-row>
        <!-- <ion-row>
            <ion-col>
                <ion-item color="dark" class="border">
                    <ion-label position="floating">Ruta</ion-label>
                    <ion-input v-model="ruta"></ion-input>
                </ion-item>
            </ion-col>
        </ion-row> -->
        <ion-row>
            <ion-col>
                <p v-if="isFetching">
                    <ion-spinner></ion-spinner>
                </p>
                <ion-button fill="outline" color="light" @click="regresar">
                    Regresar
                </ion-button>
                <ion-button @click="searchClient">
                    Continuar 
                </ion-button>
            </ion-col>
        </ion-row>
    </ion-grid>

    <p style="border-top:1px solid #FFF"></p>

    <register></register>

</template>

<script>
import { IonItem , IonLabel , IonInput , IonButton , IonGrid , IonRow , IonCol , IonSpinner , toastController } from '@ionic/vue';
import Register from '../components/Register.vue';
//import axios from 'axios';
//import { Network } from '@capacitor/network';
import { useRouter } from 'vue-router'
export default {
    name: 'FormClient',
    components: { 'register': Register , IonItem , IonLabel , IonInput , IonButton , IonGrid , IonRow , IonCol , IonSpinner },
    data(){
        return {
            cedula: this.$store.getters.GET_CEDULA, 
            ruta: this.$store.getters.GET_RUTA,
            codeClient: '',
            isFetching: false
        }
    },
    methods: {
        async searchClient(){
            if(this.codeClient === '' || this.ruta === ''){
                this.openToast('Ingrese el código del cliente','danger')
            }else{
                setTimeout(() => {
                    this.isFetching = false
                    this.$store.dispatch('SET_CLIENT_ACTION', { code: this.codeClient });
                    this.$emit('nextStep');
                }, 500);
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
        },
        regresar(){
            this.$router.go(-1);
        }
    },
    setup(){
        const router = useRouter();
        return { router };
    }
}
</script>

<style>
.border{
    border:1px solid #fff;
    border-radius: .25rem;
}
</style>