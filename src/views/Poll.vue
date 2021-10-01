<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="ion-text-center"><img style="padding:5px 0px 5px 0px" src="assets/images/main-logo.png" alt=""></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" color="dark" class="ion-text-center">
     
      <form-client v-if="step==1" @nextStep="nextStep"></form-client>
      <process v-if="step==2" @nextStep="nextStep"></process>
      <complete-task v-if="step==3"></complete-task>

    </ion-content>
  </ion-page>
</template>
<script>

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import FormClient from '../components/FormClient.vue';
import Process from '../components/Process.vue';
import CompleteTask from '../components/CompleteTask.vue';

export default {
    name: 'Poll',
    components: { 'process': Process , 'form-client': FormClient , 'complete-task': CompleteTask , IonPage, IonHeader, IonToolbar, IonTitle, IonContent },
    data(){
      return{
        step: 1,
      }
    },
    methods: {
      nextStep(){
        this.step++;
      }
    }
}
</script>
<style scoped>
  .border{
    border:1px solid #fff;
    border-radius: .25rem;
  }
  .toast-message .md , .toast-message .hydrated{
    font-size: 25px;
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
</style>