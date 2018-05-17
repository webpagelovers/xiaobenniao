<style lang="less">
    .operationBox {
        &.top-fixed {
            position: fixed;
            z-index: 999;
            right: 0;
            left: 0;
            top: 0;
        }
    }
</style>

<template>
    <div>
        <div class="operationBox" :class="{'top-fixed': oprFixed}">
            <slot>
            </slot>
        </div>
        <!--浮动占位，维持整个页面高度，避免滚动到边缘发生跳动-->
        <div class="operationBox" :style="{display: oprFixed? 'block':'none'}"></div>
    </div>
</template>

<script>

    import { on, off } from 'nt-element/src/utils/dom';
    export default {
        props: {
            headHeight: {
                type: Number,
                default: 68
            },

        },
        components: {

        },

        data () {
            const data = {
                oprFixed: false
            };
            return data;
        },

        watch: {

        },

        mounted: function() {
            on(document, 'scroll', this.handleScroll);
        },

        destroyed() {
            off(document, 'scroll', this.handleScroll);
        },

        computed: {

        },

        beforeCreate: function() {

        },
        beforeUpdate: function() {

        },

        methods: {
            goBack: function() {
                this.$emit('back');
            },
            /**
             * 处理滚动时，保持操作栏位于页面顶端 (会消失的情形下)
             **/
            handleScroll: function() {
                //获取页面头的高度
                var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop > this.headHeight) {
                    this.oprFixed = true;
                } else {
                    this.oprFixed = false;
                }
            },
        }
    };
</script>

