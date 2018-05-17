import {edit, setting,inboxList,outboxList,draftList,dustbinList,deletedList,detailMail,binding} from './pages/page';
import * as models from './models/models';
import errors from './models/error-code';
const routes = [
    {
        path: '/mail/writeMail/:type/:id?/:source?',
        // :type                                       // :source
        // -> new 新增                                 // -> inboxList 收件箱
        // -> edit 编辑                                // -> outboxList 发件箱
        // -> reply 回复                               // -> draftList 草稿箱
        // -> replyAll 回复全部                        // -> dustbinList 垃圾箱
        // -> relay 转发                               // -> deletedList 已删除
        component: edit
    },
    {
        path: '/mail/setting/',
        component: setting
    },
    {
        path: '/mail/inboxList',
        component: inboxList
    },
    {
        path: '/mail/outboxList',
        component: outboxList
    },
    {
        path: '/mail/draftList',
        component: draftList
    },
    {
        path: '/mail/dustbinList',
        component: dustbinList
    },
    {
        path: '/mail/deletedList',
        component: deletedList
    },
    {
        path: '/mail/detailMail/:mailType/:id',
        component: detailMail
    },
];

export default {
    routes,
    errors,
    models: [models]
}
