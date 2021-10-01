<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons slot="end">
                <ion-button >Close</ion-button>
              </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    {{ content }}
  </ion-content>
</template>

<script>
import { IonContent, IonHeader, IonTitle, IonToolbar , IonButtons, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ModalRegister',
  props: {
    title: { type: String, default: 'Super Modal' }
  },
  data() {
    return {
      content: 'Content',
    }
  },
  components: { IonContent, IonHeader, IonTitle, IonToolbar , IonButtons, IonButton },
  methods:{
    
  }
});
</script>