
// 这里指定每个页面组件的动态引入方式
// await import 是ES6标准引入方式，vue-router官方是 以下写法：
// const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo') 是等价的
// 通过  /* webpackChunkName: "githuber" */ 这样的方式指定 都打到同一个包中
// 开发人员只需要修改 vue文件的位置、给出组件名称就可以了
//import PageUserList from './page/userlist/page.vue'

//const PageUserList = async resolve => resolve(await import(/* webpackChunkName: "githuber" */'./page/userlist/page.vue'));
//const UserDetail = async resolve => resolve(await import(/* webpackChunkName: "githuber" */'./page/hello/page.vue'));

// const taxAdd = () => import(/* webpackChunkName: "tax" */ './tax/taxAdd.vue'); //新增和编辑
// const list = () => import(/* webpackChunkName: "tax" */'./list/index.vue');   //列表
// const detail = () => import(/* webpackChunkName: "tax" */'./details/index.vue'); //详情


const edit = () => import(/* webpackChunkName: "mail" */'./edit-mail/edit-mail.vue'); //详情
const setting = () => import(/* webpackChunkName: "mail" */'./setting-mail/index.vue'); //设置
const inboxList = () => import(/* webpackChunkName: "mail" */'./inbox-mail/inboxList.vue'); //收件箱
const outboxList = () => import(/* webpackChunkName: "mail" */'./outbox-mail/outboxList.vue'); //发件箱
const draftList = () => import(/* webpackChunkName: "mail" */'./drafts-mail/draftList.vue'); //草稿箱
const dustbinList = () => import(/* webpackChunkName: "mail" */'./dustbin-mail/dustbinList.vue'); //垃圾箱
const deletedList = () => import(/* webpackChunkName: "mail" */'./deleted-mail/deleteList.vue'); //已删除
const detailMail = () => import(/* webpackChunkName: "mail" */'./detail-mail/detailMail.vue'); //邮件详情

export {
    inboxList,
    outboxList,
    draftList,
    dustbinList,
    deletedList,
    edit,
    setting,
    detailMail,
};
