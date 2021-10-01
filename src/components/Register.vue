<template>
  <h5>Registar Nuevo Cliente</h5>
  <!-- <ion-item color="dark">
    <ion-label>Seleccionar Región</ion-label>
    <ion-select ok-text="OK" cancel-text="Cancelar" v-model="regionId">
      <ion-select-option v-for="(region,id) in form.regiones" :key="id" :value="region.id">{{region.name}}</ion-select-option>
    </ion-select>
  </ion-item> -->

  <!-- <ion-item color="dark">
    <ion-label>Seleccionar Agencia</ion-label>
    <ion-select ok-text="OK" cancel-text="Cancelar" v-model="agencyId">
        <ion-select-option v-for="(agency,id) in form.agencias" :key="id" :value="agency.id">{{agency.name}}</ion-select-option>
    </ion-select>
  </ion-item> -->

  <ion-item color="dark">
    <ion-label>Seleccionar Supervisor</ion-label>
    <ion-select ok-text="OK" cancel-text="Cancelar" v-model="supervisorId">
        <ion-select-option v-for="(supervisor,id) in form.supervisores" :key="id" :value="supervisor.id">{{supervisor.code}}</ion-select-option>
    </ion-select>
  </ion-item>

  <!-- <ion-item color="dark">
    <ion-label>Seleccionar Ruta</ion-label>
    <ion-select ok-text="OK" cancel-text="Cancelar" v-model="wayId">
        <ion-select-option v-for="(ruta,id) in form.rutas" :key="id" :value="ruta.id">{{ruta.code}}</ion-select-option>
    </ion-select>
  </ion-item> -->

  <ion-item color="dark">
    <ion-label>Seleccionar Categoria</ion-label>
    <ion-select ok-text="OK" cancel-text="Cancelar" v-model="categoryId">
        <ion-select-option v-for="(category,id) in form.categorias" :key="id" :value="category.id">{{category.name}}</ion-select-option>
    </ion-select>
  </ion-item>

  <ion-item color="dark">
    <ion-label position="floating">Nombre Negocio</ion-label>
    <ion-input v-model="name"></ion-input>
  </ion-item>

  <ion-item color="dark">
    <ion-label position="floating">Dueño</ion-label>
    <ion-input v-model="owner"></ion-input>
  </ion-item>

  <ion-item color="dark">
    <ion-label position="floating">Dirección</ion-label>
    <ion-input v-model="address"></ion-input>
  </ion-item>

  <ion-item color="dark">
    <ion-label position="floating">Teléfono</ion-label>
    <ion-input v-model="phone"></ion-input>
  </ion-item>

  <p v-if="isFetching">
    <ion-spinner></ion-spinner>
  </p>
  <ion-button color="success" class="ion-margin-top ion-margin-bottom" @click="register">
      <ion-icon name="person-add"></ion-icon>
      Registrar
  </ion-button>

</template>

<script>

import { IonItem , IonLabel , IonInput , IonSelect , IonSelectOption , IonButton , IonSpinner , IonIcon , toastController } from '@ionic/vue';
import axios from 'axios';
import { addIcons } from 'ionicons';
import { personAdd } from 'ionicons/icons';
export default {
  name: 'Register',
  components: { IonItem , IonLabel , IonInput , IonSelect , IonSelectOption , IonButton , IonSpinner , IonIcon },
  data(){
    return {
      isFetching: false,
      form: '',
      regionId: '',
      agencyId: '',
      categoryId: '',
      wayId: '',
      supervisorId: '',
      name: '',
      owner: '',
      address: '',
      phone: ''
    }
  }, 
  methods: {
    getDataForm(){
      //axios.get('http://tesalia.presale.wa.test/api/v1/seller/poll/getdataregister')
      axios.get('https://preventa.plantroya.com/api/v1/seller/poll/getdataregister')
      .then(response => {
        console.log(response.data)
        if(response.data.status){
          setTimeout(() => {
          this.form = response.data.rows
          }, 500 );
        }else{
          console.log(response.data.message)
        }
      })
      .catch(err=>{
        console.log(err)
      })
    },
    register(){

      if(this.phone == '' || this.address == '' || this.owner == '' || this.name == '' || this.categoryId == '' || this.supervisorId == ''){
        return  this.openToast('Ingrese todos los campos requeridos','danger')
        
      }

      this.isFetching = true;
      const form = new FormData

      /* form.append('region_id',this.regionId);
      form.append('agency_id',this.agencyId);
      form.append('way_id',this.wayId); */
      form.append('way_code',this.$store.getters.GET_RUTA);
      form.append('category_id',this.categoryId);
      form.append('supervisor_id',this.supervisorId);
      form.append('name',this.name);
      form.append('owner',this.owner);
      form.append('address',this.address);
      form.append('phone',this.phone);

      axios.post('https://preventa.plantroya.com/api/v1/seller/poll/create_client', form )
      //axios.post('http://tesalia.presale.wa.test/api/v1/seller/poll/create_client', form )
      .then(response => {
        console.log(response.data)
        if(response.data.status){
          console.log(response.data)
          setTimeout(() => {
            this.isFetching = false;
            this.clearForm();
            this.openToast('Cliente Creado Correctamente','success');
          }, 500 );
        }else{
          this.isFetching = false;
          this.openToast(response.data.message,'danger')
        }
      })
      .catch(err=>{
        this.isFetching = false
        console.log(err)}
        )

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
    clearForm(){
      this.regionId = '',
      this.agencyId = '',
      this.categoryId = '',
      this.wayId = '',
      this.supervisorId = '',
      this.name = '',
      this.owner = '',
      this.address = ''
    }
  },
  created(){
    addIcons({
      'person-add': personAdd
    })
  },
  mounted(){
    this.getDataForm()
  }
}
</script>

<style>

</style>