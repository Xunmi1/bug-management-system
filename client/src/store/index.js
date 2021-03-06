import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import user from './modules/user';
import tagState from './modules/tagState';
import issue from './modules/issue';
import project from './modules/project';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        user,
        tagState,
        issue,
        project
    },
    plugins: [createLogger()]
});

export default store;
