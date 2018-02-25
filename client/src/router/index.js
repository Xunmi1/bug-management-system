import Vue from 'vue';
import Router from 'vue-router';

import TheIndex from '@/TheIndex';
import TheHomeInput from '@/index/TheHomeInput';
import TheLoginInput from '@/index/TheLoginInput';
import TheRegisterInput from '@/index/TheRegisterInput';
import TheMain from '@/TheMain';
import TheProject from '@/TheProject';
import TheUserInfo from '@/TheUserInfo';
import TheNewProject from '@/project/TheNewProject';
import ProjectInfo from '@/project/ProjectInfo';
import ProjectPeople from '@/project/ProjectPeople';

import userName from '../userName';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            // 注册将使用的组件（局部注册），只在父组件可用
            component: TheIndex,
            children: [
                {
                    path: 'home',
                    name: 'home',
                    component: TheHomeInput,
                    // 别名，访问 / 时转向 /home, 且 url 不变。不同于重定向
                    alias: '/'
                },
                {
                    path: 'login',
                    name: 'login',
                    component: TheLoginInput
                },
                {
                    path: 'register',
                    name: 'register',
                    component: TheRegisterInput
                }
            ]
        },
        {
            path: '/:userName',
            name: 'main',
            component: TheMain,
            children: [
                {
                    path: 'project/user',
                    name: 'userProject',
                    component: TheProject,
                    alias: 'project'
                },
                {
                    path: 'project/new',
                    name: 'newProject',
                    component: TheNewProject
                },
                {
                    path: 'project/info',
                    name: 'projectInfo',
                    component: ProjectInfo
                },
                {
                    path: 'project/people',
                    name: 'projectPeople',
                    component: ProjectPeople
                },
                {
                    path: 'user',
                    name: 'user',
                    component: TheUserInfo
                },
                {
                    path: 'console',
                    name: 'console'
                }
            ]
        }
    ]
});
router.beforeEach((to, from, next) => {
    const isOpen = (to.name === '' || to.name === 'home' || to.name === 'login' || to.name === 'register');
    if (isOpen) {
        next();
    } else {
        if (to.params.userName === userName.name) {
            next();
        } else {
            console.log('用户拦截');
            next('/');
        }
    }
});

export default router;
