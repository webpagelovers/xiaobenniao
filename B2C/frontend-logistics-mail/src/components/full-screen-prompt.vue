<template>
    <nt-dialog title="" :visible.sync="isShow" :fullscreen="true" size="full" :close-on-click-modal="false" :show-close="false" class="header-border-none">
        <i :class="opts.icon + ' big-icon'"></i>
        <h4>{{ opts.title }}</h4>
        <span>{{ opts.content }}</span>
        <div>
            <nt-button v-for="(item, index) in opts.btns" type="text" @click="item.clickFn" :key="index" :icon="item.icon || ''">{{item.text}}</nt-button>
        </div>
    </nt-dialog>
</template>

<script>
    import merge from 'deepmerge';
    // let callBack = null;
    export default {
        data () {
            return {
                isShow: false,
                opts: {
                    icon:  'nt-icon-xbn-34',
                    title: '出错了',
                    content: '您访问的网页出现问题了哦',
                    btns: []
                }
            }
        },
        methods: {
            show(opts = {}) {
                this.opts = merge(this.opts, opts);
                this.isShow = true;
            }
        },
        created() {}
    }
</script>


<style lang="less" scope>
.big-icon { font-size: 40px; float: left; margin-right: 30px;}
</style>
