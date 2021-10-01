<template>
        <ion-icon class="ion-margin-top" name="checkmark-circle-outline" style="font-size:7em" color="success"></ion-icon>
        <h4>
            Se ha registrado la información de la vista para la ENTREGA correctamente.
        </h4>
        <ion-button class="ion-margin-top" @click="complete">
            Aceptar
        </ion-button>
</template>

<script>
import {  IonButton , IonIcon  } from '@ionic/vue';
import { useRouter } from 'vue-router';

import { addIcons } from 'ionicons';
import { checkmarkCircleOutline } from 'ionicons/icons';

export default  {
  name: 'CompleteTask',
  components: { IonButton , IonIcon },
  data(){
    return {
      today: ''
    }
  },
  methods: {
    complete(){
      this.loadRecientes();
      setTimeout(() => {
        this.$router.go(-1);
      }, 500);
      
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
  created() {
    addIcons({
      'checkmark-circle-outline': checkmarkCircleOutline,
    })
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  mounted(){
    const d = new Date();
    this.today = d.toLocaleDateString('pt-PT');
  }
}
</script>
<style>
    .border{
        border: 1px solid #FFF;
        border-radius: .25rem;
    }
</style>