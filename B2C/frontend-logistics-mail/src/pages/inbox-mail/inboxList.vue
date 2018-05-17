<template>
    <div>
        <listMailComponent title="收件箱" mailType="1"></listMailComponent>
    </div>
</template>

<script>
    import {TemplateSearchList} from 'xbn-biz-components'
    import listMailComponent from '../../components/listMailComponent'

    export default {
        components: {TemplateSearchList,listMailComponent},
        data() {
            return { }
        }
    }
</script>

<style lang="less">
    .text-right {
        text-align: right;
    }
</style>
