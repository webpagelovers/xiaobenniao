<style lang="less">

</style>

<template>
    <div class="plan-list-container">
        <avatar-upload v-model="url" :accept="type" :size="4"></avatar-upload>
        <div style="width: 300px;">
            <countable-input v-model="desc" type="textarea" maxlength="300" rows="5"></countable-input>
        </div>
        <countable-input v-model="shortDesc" type="text" total="50"></countable-input>
    </div>
</template>

<script>
    import {AvatarUpload} from '../../index';
    import {CountableInput} from '../../index'
    export default {
        components: {
            AvatarUpload,
            CountableInput
        },
        data() {
            return {
                url: 'https://www.baidu.com/img/bd_logo1.png',
                type:'jpg,jpeg,gif,png',
                desc: '',
                shortDesc: '',
            };
        },

        created: async function () {

        },

        methods: {
            upload: function(file) {
                console.log(file);
            }
        }
    };
</script>


