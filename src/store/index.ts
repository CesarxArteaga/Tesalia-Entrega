import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store, MutationTree, ActionTree , GetterTree } from 'vuex';

export interface State { cedula: string ; ruta: string; client: {}; distributor: {}; metaActual: number; rutasRecientes: [] }

export const key: InjectionKey<Store<State>> = Symbol();

const state: State = {
    cedula: '',
    ruta: '',
    client: {},
    distributor: {},
    metaActual: 0,
    rutasRecientes: []
};

//GETTERS
const getters: GetterTree <State, any> = {
    ['GET_CEDULA'](state){
        return state.cedula;
    },
    ['GET_RUTA'](state){
        return state.ruta;
    },
    ['GET_CLIENT'](state){
      return state.client;
    },
    ['GET_DISTRIBUTOR'](state){
      return state.distributor;
    },
    ['GET_METAACTUAL'](state){
      return state.metaActual;
    },
    ['GET_RUTASRECIENTES'](state){
      return state.rutasRecientes;
    },
}

//MUATATIONS
export const enum MUTATIONS {
    SET_CEDULA = 'SET_CEDULA',
    SET_RUTA = 'SET_RUTA',
    SET_CLIENT = 'SET_CLIENT',
    SET_DISTRIBUTOR = 'SET_DISTRIBUTOR',
    SET_METAACTUAL = 'SET_METAACTUAL',
    SET_RUTASRECIENTES = 'SET_RUTASRECIENTES',
}

const mutations: MutationTree<State> = {
  [MUTATIONS.SET_CEDULA](state, data){
    state.cedula = data
  },
  [MUTATIONS.SET_RUTA](state, data){
    state.ruta = data
  },
  [MUTATIONS.SET_CLIENT](state, data){
    state.client = data
  },
  [MUTATIONS.SET_DISTRIBUTOR](state, data){
    state.distributor = data
  },
  [MUTATIONS.SET_METAACTUAL](state, data){
    state.metaActual = data
  },
  [MUTATIONS.SET_RUTASRECIENTES](state, data){
    state.rutasRecientes = data
  },
}

//ACTIONS
export const enum ACTIONS { 
    SET_CEDULA_ACTION = 'SET_CEDULA_ACTION',
    SET_RUTA_ACTION = 'SET_RUTA_ACTION',
    SET_CLIENT_ACTION = 'SET_CLIENT_ACTION',
    SET_DISTRIBUTOR_ACTION = 'SET_DISTRIBUTOR_ACTION',
    SET_METAACTUAL_ACTION = 'SET_METAACTUAL_ACTION',
    SET_RUTASRECIENTES_ACTION = 'SET_RUTASRECIENTES_ACTION',
}

const actions: ActionTree<State, any> = {
  [ACTIONS.SET_CEDULA_ACTION](store, data) {
    store.commit(MUTATIONS.SET_CEDULA,data);
  },
  [ACTIONS.SET_RUTA_ACTION](store, data){
    store.commit(MUTATIONS.SET_RUTA, data);
  },
  [ACTIONS.SET_CLIENT_ACTION](store, data){
    store.commit(MUTATIONS.SET_CLIENT, data);
  },
  [ACTIONS.SET_DISTRIBUTOR_ACTION](store, data){
    store.commit(MUTATIONS.SET_DISTRIBUTOR, data);
  },
  [ACTIONS.SET_METAACTUAL_ACTION](store, data){
    store.commit(MUTATIONS.SET_METAACTUAL, data);
  },
  [ACTIONS.SET_RUTASRECIENTES_ACTION](store, data){
    store.commit(MUTATIONS.SET_RUTASRECIENTES, data);
  },
};

export const store = createStore<State>({ state, mutations, actions , getters });

// our own `useStore` composition function for types
export function useStore() {
    return baseUseStore(key);
}