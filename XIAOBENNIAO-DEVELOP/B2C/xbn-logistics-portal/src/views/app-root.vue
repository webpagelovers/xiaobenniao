<template>

    <div id="xbn-root" class="xbn_main">
        <div class="app_left" v-bind:style="{ width: displayWidth}" :class="{'sidebar-collapsed': this.navigation.collapse}">
            <div class="logo-main" style="display: table;background: #2d2f31;">
                <div class="vM" style="display: table-cell;">
                    <a href="javascript:;" @click="handleCollapse"><i class="nt-icon-xbn-8" style="font-size: 24px;color: #fff;padding-left:8px;padding-right:16px;"></i></a>
                </div>
                <div class="text fR vM" v-bind:style="{ display: displayStyle }" >
                    <i><img src="../images/logo_left_h.png" width="29" height="32" alt=""/></i>
                    <span>集货转运</span>
                </div>
            </div>
            <nt-navigation-view :navigation="navigation"></nt-navigation-view>
        </div>
        <div class="app_right" :class="{'sidebar-collapsed': this.navigation.collapse}">
            <!-- 路由出口 -->
            <!-- 路由匹配到的组件将渲染在这里 -->
            <div class="app_content">
                <router-view></router-view>
            </div>
            <div class="footer">
            </div>
        </div>
    </div>
</template>


<script>

    import NtNavigationView from 'nt-navigation-view';
    import menu from '../config/menu.json';

    let returnValue = void 0;
    function TraversalObject(obj, matchVal)
    {
        for(var i =0; i< obj.length; i++){
            if (Array.isArray(obj[i]['children'])) {
                TraversalObject(obj[i]['children'], matchVal); //递归遍历
            }
            else {
                if(obj[i].index.indexOf('/') >=0 && (new RegExp(obj[i].index)).test(matchVal.path)) {
                    console.log(obj[i].index);
                    returnValue = obj[i].index;
                }
            }
        }
    }

    export default {
        data () {
            return {
                navigation:{
                    menus: menu.menus,
                    collapse: false
                },
                displayStyle:'table-cell',
                displayWidth:'190px'
            }
        },
        components: {
            NtNavigationView
        },

        created: function() {

        },

        methods: {
            handleCollapse(){
                this.navigation.collapse = !this.navigation.collapse;
                if(this.navigation.collapse){
                    this.displayStyle = 'none';
                    this.displayWidth = '64px';
                }
                else{
                    this.displayStyle = 'table-cell';
                    this.displayWidth = '190px';
                }

            }
        },

        watch: {
            $route: function(to, from) {
                TraversalObject(menu.menus, to);
                if (returnValue) {
                    this.$set(this.navigation, 'activeIndex', returnValue);
                }
            }
        }
    }
</script>


<style lang="less">
    html, body {
        padding: 0;
        margin: 0;
        height:100%;

    }
    .xbn_main {
        height: 100%;
        width: 100%;
        overflow: hidden;
        display: table;
        table-layout: fixed;

        .app_left {
            -webkit-transition: width 0.3s;
            -moz-transition: width 0.3s;
            -ms-transition: width 0.3s;
            -o-transition: width 0.3s;
            transition: width .3s;

            z-index: 99;
            width: 190px;

            &.sidebar-collapsed {
                width: 64px;
            }

            height: 100%;
            background: #2d2f31;
            width:190px;            
            vertical-align: top;
            position: fixed;

            .logo-main {
                height: 68px;
                img{
                    width:29px;
                    height: 32px;
                    margin-right:8px;
                    vertical-align: middle;
                }
                .text{
                    font-size: 18px;
                    text-align: center;
                    color: #fff;
                    line-height: 68px;
                }
            }

            .menu {
                height:100%;
                background: #27292d;
                .nt-menu-item {
                    width: 100%;
                }
            }
        }

        .app_right {
            height:100%;
            background: #f3f3f4;
            /*display:table-cell;*/
            margin-left: 190px;
            &.sidebar-collapsed {
                margin-left: 64px;
                .operationBox.top-fixed {
                    margin-left: 64px;
                }
            }

            .operationBox.top-fixed {
                margin-left: 190px;
            }

            .header-wraper{
                flex: 0 0 auto;
                z-index: 1;
                background: #317dff;;
                height: 68px;
                line-height: 68px;
                padding-left: 24px;
                color: #fff;
            }
            .app_content{
                flex: 1;
                overflow: auto;
            }
        }
    }

    /*.app_icon{
        width:170px;
        height: 68px;
        line-height: 68px;
        position: absolute;
        top:0;
        right: 0;
        z-index: 2;
    i{
        margin-right: 25px;
    }
    }*/
    .nt-page-operation-bar{
        height: 52px;
        line-height: 52px;
    }
    /*header模块*/
    .nt-page-pagination{
        text-align: center;
    }
    .mL24{
        margin-left:24px;
    }

    /* 列表模块*/
    /*.nt-page-head{
         height: 68px;
         background: #51a2e1;
         background:#317DFF;
     }*/

    .nt-menu--dark{
        background-color: #27292d!important;
    }
    .nt-menu--dark .nt-submenu__title{
        color: #a7b1c2;
        span{
            padding-left:16px;
        }
    }
    .nt-menu--dark .nt-submenu .nt-menu{
        background: #202225;
    }
    .nt-menu--dark .nt-submenu .nt-menu .nt-menu-item:hover{
        background: #317dff;
        color:#fff;
    }
    .nt-menu--dark .nt-submenu .nt-menu .nt-menu-item:hover a{
        color:#fff;
    }
    .c_fff{
        color: #fff;
    }
    .nt-menu--dark .nt-menu-item:hover, .nt-menu--dark .nt-submenu__title:hover{
        background-color: #202225;
        border-color: #202225;
    }
    .nt-menu li.nt-submenu{
        border-left: 4px solid #27292d;
        .nt-menu{
            li{
                border-left: none;
            }
        }
        &:hover{
            border-left: 4px solid #202225;
        }
    }
    .nt-menu li.is-opened{
        background: #202225;
        /*border-color: #1ab394;*/
        border-color: #317dff;
        &:hover{
            border-left: 4px solid #317dff;
        }
    }
    .nt-submenu .nt-menu-item{
        min-width: 100%;
    }
    .nt-menu--dark .nt-submenu .nt-menu{
        background: #202225!important;
        li{
            a{
                color: #74777d;
            }
        }
        li.is-active{
            background-color: #317dff!important;
            a{
                color: #fff;
            }

        }
    }
    .nt-menu--dark .nt-submenu .nt-menu .nt-menu-item:hover{
        background-color: #317dff!important;;
    }

    /*左侧栏一级按钮样式*/
    .nt-menu-item.home-menu {
        width: 100%!important;
        color: #bfcdd9;
        padding-left: 24px;
    }
    .nt-menu-item.home-menu span{
        padding-left:16px;
    }
    .nt-menu-item.home-menu.is-active{
        background-color: #317dff;
        color: #ffffff;
    }
</style>
