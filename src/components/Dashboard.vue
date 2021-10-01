<template>
    <ion-grid>
        <ion-row class="ion-margin ion-padding ruta-item">
            <ion-col> <ion-icon name="trophy" style="font-size:24px;margin-bottom:-5px;margin-right:5px"></ion-icon> META DIARIA</ion-col>
            <ion-col style="font-size:22px"> {{metaActual2}} / {{ metaFinal }}</ion-col>
        </ion-row>
    </ion-grid>

    <ion-button @click="goNext">Registrar Visita</ion-button>


    <p class="ion-margin" style="border-top:1px solid #FFF"></p>

    <h5>CLIENTES RECIENTES</h5>

    <!-- Mensaje Iconos -->
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="ion-text-left border" style="margin:0px 15px 0px 15px">
              <p style="margin:6px"><ion-icon style="font-size:1.4em;margin-bottom:-6px" name="checkmark-circle-outline" color="success"></ion-icon> <span style="font-size:.8em">La vísita fue registrada correctamente.</span></p>
              <p style="margin:6px"><ion-icon style="font-size:1.4em;margin-bottom:-6px" name="sync" color="warning"></ion-icon> <span style="font-size:.8em">La vísita debe sincronizarse.</span> </p>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
      
      <ion-grid>
          <ion-row>
            <ion-col>Cliente</ion-col>
            <ion-col>Status</ion-col>
          </ion-row>
          <ion-row v-if="rutasRecientes2.length == 0">
            <ion-col>
              <p class="ion-margin ion-padding ruta-item">No existen rutas recientes</p>
            </ion-col>
          </ion-row>
          <ion-row v-else v-for="(ruta , index ) in rutasRecientes2" :key="index" class="ruta-item ion-margin ion-padding">
              <ion-col> <div style="margin-top:5px"> {{ruta.client_code}} </div> </ion-col>
              <ion-col> 
                <ion-icon v-if="ruta.uploaded" name="checkmark-circle-outline" style="font-size:30px" color="success"></ion-icon>
                <ion-icon v-else name="sync" style="font-size:30px" color="warning" @click="sync($event, index)"></ion-icon>
              </ion-col>
          </ion-row>
      </ion-grid>
</template>

<script>
/* eslint-disable */
import { IonButton , IonGrid , IonRow , IonCol , IonIcon , toastController } from '@ionic/vue';
import { useRouter } from 'vue-router';

import { addIcons } from 'ionicons';
import { sync , checkmarkCircleOutline , trophy } from 'ionicons/icons';
import axios from 'axios';
import { Directory, Filesystem } from '@capacitor/filesystem'
import { Network } from '@capacitor/network';

import { mapGetters } from 'vuex' 

export default {
    name: 'Dashboard',
    components: { IonButton , IonGrid , IonRow , IonCol , IonIcon },
    data() {
        return {
            metaFinal: 3,
            metaActual: this.$store.getters.GET_METAACTUAL,
            rutasRecientes:  this.$store.getters.GET_RUTASRECIENTES,
            openForm: false,
            today: ''
        }
    },
    methods: {
      goNext(){
          this.$router.push('/poll');
      },
      async sync( event , index ){

        const  network = await Network.getStatus()

        if(network.connected == false){
          return this.openToast('¡¡No tiene conexión a internet!!','warning');
        }

        let el = event.target
        el.classList.add('roting');

        console.log('subiendo')

        let form = new FormData
        form.append('distributor_id', this.rutasRecientes2[index].distributor_id )
        form.append('client_code', this.rutasRecientes2[index].client_code )
        form.append('way_code', this.rutasRecientes2[index].way_code )
        form.append('lat', this.rutasRecientes2[index].lat )
        form.append('lng', this.rutasRecientes2[index].lng )
        form.append('duration', this.rutasRecientes2[index].duration )

        /* Imagen ANTES */
        /* Leyendo imagen guardada en storage de telefono */
        const contentBefore = await Filesystem.readFile({
            path: this.rutasRecientes2[index].filepath_before,
            directory: Directory.Data
          })
        /* Convertiendo imagenbase64 a file_before para subir */
        let fileBeforeBase64 =  `data:image/jpeg;base64,${contentBefore.data}`;
        let fileBefore = await this.dataURLtoFile(fileBeforeBase64, 'image1' );
        form.append('file_before', fileBefore );

        /* Imagen DESPUES */
        /* Leyendo imagen guardada en storage de telefono */
        const contentAfter = await Filesystem.readFile({
            path: this.rutasRecientes2[index].filepath_after,
            directory: Directory.Data
          })
        /* Convertiendo imagenbase64 a file_before para subir */
        let fileAfterBase64 =  `data:image/jpeg;base64,${contentAfter.data}`;
        let fileAfter = await this.dataURLtoFile(fileAfterBase64, 'image2' );
        form.append('file_after', fileAfter );

        form.append('incidences', this.rutasRecientes2[index].incidences ) //enviando respuestas

        axios.post( 'https://entrega.plantroya.com/api/v1/distributor/poll' , form )
        //axios.post( 'http://tesalia.delivery.wa.test/api/v1/distributor/poll' , form )
          .then( response => {
            console.log(response.data)
              if ( response.data.status ) {
                  setTimeout( () => {
                      el.classList.remove('roting');
                      this.rutasRecientes2[index].uploaded = true;
                      /* Actualizando LocalStorage */
                      localStorage.setItem('recientes-entrega',JSON.stringify(this.rutasRecientes2))
                      this.openToast('Visita Guardada', 'success' );
                  },600)
              } else {
                this.openToast(response.data.message , 'danger' );
                el.classList.remove('roting');
              }
          })
          .catch( failure  => {
              console.log( failure )
              this.openToast(failure,'danger');
          })
      },
      async openToast(msg,type) {
      const toast = await toastController
        .create({
          message: msg,
          color: type,
          duration: 2000
        })
      return toast.present();
      
      },
      async dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
      },
      closeForm(){
        this.openForm = false;
      },
      loadRecientes(){
        let count = 0;
        if(localStorage.getItem('recientes-entrega')){
          const rutasRecientes = JSON.parse(localStorage.getItem('recientes-entrega'));
          this.$store.dispatch('SET_RUTASRECIENTES_ACTION', rutasRecientes );
          rutasRecientes.forEach(ruta => {
            if(ruta.uploaded && this.today === ruta.date) { 
            count++; 
            this.$store.dispatch('SET_METAACTUAL_ACTION', count ) 
          }
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
      const d = new Date();
      this.today = d.toLocaleDateString('pt-PT');
      setTimeout(() => {
        this.loadRecientes();
      }, 200);
    },
    computed:{
      ...mapGetters({metaActual2: 'GET_METAACTUAL'}),
      ...mapGetters({rutasRecientes2: 'GET_RUTASRECIENTES'}),
    }
}

</script>

<style scoped>
.border{
      border: 1px solid rgb(74, 98, 114);
      background-color: rgb(59, 79, 92);
      border-radius: .25rem;

    }
.ruta-item{
  background-color: #1b262e;
  border-radius: .25rem;
}
.roting{
  animation-name: rotate;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
}
@keyframes rotate {
  from { transform: rotate(0deg);}
  to { transform: rotate(180deg);}
}
</style>