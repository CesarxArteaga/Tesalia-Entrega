<template>
        <div class="ion-padding" :class="classColor" style="background-color:#000;font-size:1.2em;position:fixed;z-index:1000;width:100%">
          <span>Tiempo Transcurrido</span> 
          <span class="border" :class="classColor" style="padding:6px;margin-left:15px;margin-right:15px">
            {{minutes}} : <span v-if="seconds.toString().length == 1">0</span>{{seconds}}
          </span>
        </div>

        <div class="ion-padding">
          <h5 style="margin-top:3rem">Fotos Iniciales y Finales de la Actividad</h5>
          <ion-grid>
            <ion-row>
              <ion-col>
                <div class="border">
                  <div v-if="photoFirstUrl==''">
                    <input type="file" id="file1" @change="savePhotoFirst($event)" hidden/>
                    <label for="file1"> <ion-icon name="image-outline"></ion-icon> Subir Foto Inicial</label>
                  </div>
                  <div v-else>
                    <ion-icon name="close-circle" size="large" style="position:absolute;top:-3px;right:-3px" @click="removePhoto(1)"></ion-icon>
                    <img :src="photoFirstUrl">
                  </div>
                </div>
              </ion-col>
              <ion-col>
                <div class="border">
                  <div v-if="photoLastUrl==''">
                    <input type="file" id="file2" @change="savePhotoLast($event)" hidden/>
                    <label for="file2"> <ion-icon name="image-outline"></ion-icon> Subir Foto Final</label>
                  </div>
                  <div v-else>
                    <ion-icon name="close-circle" size="large" style="position:absolute;top:-3px;right:-3px" @click.stop="removePhoto(2)"></ion-icon>
                    <img :src="photoLastUrl">
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <div style="clear:both">
          <h5 class="ion-padding-top">Agregar Incidencias de la Ruta</h5>
          <ion-list style="background:unset">
            <div v-for="(incidencia,index) in incidencias" :key="index">
              <ion-item color="dark" >
                <ion-label>{{incidencia.text}}</ion-label>
                <ion-checkbox
                  slot="start"
                  @update:modelValue="incidencia.isChecked = $event"
                  :modelValue="incidencia.isChecked">
                </ion-checkbox>
              </ion-item>
              <div style="padding: 0px 15px 15px 15px" v-show="incidencia.isChecked">
                <ion-textarea class="ion-text-left border"  placeholder="Agregar comentario..." v-model="incidencia.comment"></ion-textarea>
              </div>
            </div>
          </ion-list>
        </div>
          <p v-if="isFetching">
            <ion-spinner></ion-spinner>
          </p>
          <ion-button fill="outline" color="light" @click="goBack">Atras</ion-button>
          <ion-button style="margin-left:2rem" @click="presentAlertConfirm">Continuar</ion-button>
</template>

<script>
/* eslint-disable */
import { IonGrid , IonRow , IonCol , IonLabel ,  IonTextarea , IonCheckbox , IonList , IonItem , toastController , IonButton , IonIcon , alertController , IonSpinner } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { addIcons } from 'ionicons';
import { imageOutline , checkmarkOutline , closeCircle } from 'ionicons/icons';
import axios from 'axios';
import { Geolocation } from '@ionic-native/geolocation'

import { ref, onMounted, watch } from 'vue';
//import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem'
import { Network } from '@capacitor/network';

export default  {
  name: 'Process',
  components: { IonGrid , IonRow , IonCol , IonLabel ,  IonTextarea , IonCheckbox , IonList , IonItem , IonButton , IonIcon , IonSpinner }
  ,data () {
      return {
            classColor: '',
            count: true,
            minutes: 0,
            seconds: 0,
            client: this.$store.getters.GET_CLIENT,
            distributor: this.$store.getters.GET_DISTRIBUTOR,
            wayCode: this.$store.getters.GET_RUTA,
            incidencias: [],
            photoFirstUrl: '',
            photoFirstFile: null,
            photoLastUrl: '',
            photoLastFile: null,
            lat: 0,
            lng: 0,
            duration: 0,
            conexion: false,
            isFetching: false
        }
  },
  methods:{
    savePhotoFirst(event){
        this.photoFirstFile = event.target.files[0];
        this.photoFirstUrl = URL.createObjectURL(this.photoFirstFile);
      },
    savePhotoLast(event){
      this.photoLastFile = event.target.files[0];
      this.photoLastUrl = URL.createObjectURL(this.photoLastFile);
    },
    removePhoto(index){
      if(index == 1){
        this.photoFirstUrl = ''
        this.photoFirstFile = null
      }else if(index == 2){
        this.photoLastUrl = ''
        this.photoLastFile = null
      }
    },
    getIncidences(){
      console.log('getting incidences')
      const array_incds = JSON.parse(localStorage.getItem('incidences-entrega'));
        array_incds.forEach(incidencia => {
            this.incidencias.push({id: incidencia.id, text: incidencia.name, isChecked: false , comment: ''})
        });
    },
    getLocation(){
      Geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude 
        this.lng = resp.coords.longitude 
      }).catch((err) => {
        console.log(err)
      })
    },
    saveTime(){
      this.count = false
      let timeTemp = 0;
      if(this.minutes >= 1){
        timeTemp = this.minutes*60
      }
      timeTemp = timeTemp + this.seconds
      this.duration = timeTemp
      console.log('Tiempo Finalizado');
    },
    async completeProcess(){
        this.isFetching = true;

        this.saveTime();

        //Parametros a servidor para insertar poll
        const form = new FormData;
        
        form.append('distributor_id', this.distributor.id )
        form.append('client_code', this.client.code )
        form.append('way_code', this.wayCode )
        form.append('lat', this.lat )
        form.append('lng', this.lng )
        form.append('file_before', this.photoFirstFile ) //Enviando foto comprimida
        form.append('file_after', this.photoLastFile ) //Enviando foto comprimida
        form.append('duration', this.duration )

        /* Validando incidencias */
        const incidences = [] // Incidencias que se envian a api
        this.incidencias.forEach(incidencia => {
          if(incidencia.isChecked){
            incidences.push({
              id: incidencia.id,
              comment: incidencia.comment
            })
          }
        });
        /* Agregando incidencias al form */
        form.append('incidences', JSON.stringify(incidences));

        const d = new Date();
        const recienteItem = {'distributor_id': this.distributor.id, 'client_code': this.client.code, 'way_code': this.wayCode, 'lat': this.lat, 'lng': this.lng ,'duration': this.duration, 'incidences': JSON.stringify(incidences), 'date': d.toLocaleDateString('pt-PT')}

        /* Si el telefono esta conectado a internte sube data a servidor */

        const network = await Network.getStatus();

        let recientes = [];
        if(localStorage.getItem('recientes-entrega')){
            recientes = JSON.parse(localStorage.getItem('recientes-entrega'))
        }

        if(network.connected){
          recienteItem.uploaded = true
          console.log('CON INTERNET')
          axios.post( 'https://entrega.plantroya.com/api/v1/distributor/poll' , form )
          //axios.post( 'http://tesalia.delivery.wa.test/api/v1/distributor/poll' , form )
                .then( response => {
                  console.log(response.data)
                    if ( response.data.status ) {
                        setTimeout( () => {
                            recientes.push(recienteItem);
                            localStorage.setItem('recientes-entrega', JSON.stringify(recientes));
                            this.isFetching = false;
                            this.$emit('nextStep');
                        },500)
                    } else {
                      this.openToast(response.data.message , 'danger');
                      this.isFetching = false;
                      return false
                    }
                })
                .catch( failure  => {
                    console.log( failure )
                    this.isFetching = false;
                    return false
                })
        }else{
            recienteItem.uploaded = false;

            console.log('SIN INTERNET')

            //Conviertiendo a base64
            const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = reject;
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(blob);
            });

            const savePicture = async (photo, fileName) => {
                let base64Data;

                // Fetch the photo, read as a blob, then convert to base64 format
                const blob = photo;
                base64Data = await convertBlobToBase64(blob);

                const savedFile = await Filesystem.writeFile({
                    path: fileName,
                    data: base64Data,
                    directory: Directory.Data
                });

                // Use webPath to display the new image instead of base64 since it's
                // already loaded into memory
                return {
                    filepath: fileName,
                    webviewPath: photo.webPath
                };
            }

            /* Guardando Foto Antes */
            const fileNameBefore = new Date().getTime() + recienteItem.client_code + 'before-delivery.jpeg';
            const savedFileImageBefore = await savePicture(this.photoFirstFile, fileNameBefore);

            /* Guardando Foto Despues */
            const fileNameAfter = new Date().getTime() + recienteItem.client_code + 'after-delivery.jpeg';
            const savedFileImageAfter = await savePicture(this.photoLastFile, fileNameAfter);

            /* Añadiendo Identificadores de photos a Item Reciente */
            recienteItem.filepath_before = savedFileImageBefore.filepath;
            recienteItem.filepath_after = savedFileImageAfter.filepath;

            /* Añadiendo item a localStorage */
            recientes.push(recienteItem);
            localStorage.setItem('recientes-entrega', JSON.stringify(recientes));
            this.$emit('nextStep');
        }

        

    },
    async presentAlertConfirm(){
      if(this.validatePhotos() ){ //Si los campos han sido llenados correctamente
        const alert = await alertController
          .create({
            cssClass: 'my-custom-class',
            header: 'Finalizar Encuesta',
            message: '¿Esta seguro que desea finalizar la encuesta con los campos ingresados?',
            backdropDismiss: true,
            translucent: true,
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Confirm Cancel:')
                },
              },
              {
                text: 'Aceptar',
                handler: () => {
                  console.log('Confirm Okay')
                    this.completeProcess();
                },
              },
            ],
          });
        return alert.present();
      }
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
    validatePhotos(){
      if(this.photoFirstUrl == '' || this.photoLastUrl == ''){ //Si las fotos no se han cargado
        this.openToast('Ingrese todas fotos requeridas','danger')
        return false;
      }else{
        return true;
      }
    },
    goBack(){
      this.$router.back();
      this.$store.dispatch('SET_CLIENT_ACTION',{});
      this.$emit('backStep');
    },
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  created() {
    addIcons({
      'image-outline': imageOutline,
      'checkmark-outline': checkmarkOutline,
      'close-circle': closeCircle
    })
    
  },
  mounted(){
    this.getLocation();
    this.getIncidences();
  },
  watch: {
    seconds: {
      handler(){
        if(this.count){
          setTimeout(()=>{
            this.seconds++
            if(this.seconds == 60){
              this.seconds = 0
              this.minutes++
              if(this.minutes == 1){
                this.classColor = 'count-1min'
              }else if(this.minutes == 2){
                this.classColor = 'count-2min'
              }
            }
          }, 1000 )
        }
      },
      immediate: true
    }
  } 
}
</script>

<style scoped>
  .border{
    border: 1px solid #FFF;
    border-radius: .25rem;
  }
  .custom{
    width: 100px;
    margin-right: 10px;
  }
  label{
    display: inline-block;
    background-color: rgb(14, 14, 14);
    color: white;
    padding: 0.5rem;
    font-family: sans-serif;
    border-radius: 0.2rem;
    cursor: pointer;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: .9em;
  }
  .col{
    float: left;
    font-size: .7em;
    max-width: 110px;
    margin: 5px;
  }
  .count-1min{
    border-color: orange;
    color: orange;
  }
  .count-2min{
  border-color: red;
    color: red;
  }
</style>