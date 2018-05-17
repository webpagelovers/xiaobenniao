import MessageCenter from './message-center/index.vue';
import UserInfo from './user/user-info.vue';
import ModifyPassword from './user/modify-password.vue';

import Common from 'xbn-biz-common';

const routes = [/*{
    path: '/message-center',
    component: MessageCenter,
    name: 'message-center'
},*/{
    path: '/user-info',
    component: UserInfo,
    name: 'user-info'
},{
    path: '/modify-password',
    component: ModifyPassword,
    name: 'modify-password'
}];

export default {
    routes,
    models: Common.models
};
