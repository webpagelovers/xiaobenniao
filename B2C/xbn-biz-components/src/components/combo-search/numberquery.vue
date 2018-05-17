<template>
    <div class="field">
        <nt-select class="operator" v-model="model.operator">
            <nt-option
                v-for="option in queryOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value">
            </nt-option>
        </nt-select>
        <!--注意这里有一个element的bug，就是2个data-picker放在同级， 切换时如果值为空会报错。 这里将他们放置到不同层次之上-->
        <nt-input v-if="model.operator!=='between'" class="number-query-full fR" v-model.number="model.value"></nt-input>
        <span class="fR" v-else>
            <nt-input v-model.number="model.gt" class="number-query-sep"></nt-input> - <nt-input v-model.number="model.lt" class="number-query-sep"></nt-input>
        </span>
    </div>
</template>

<script>
    /**
     * 对于日期区间范围的查询，默认的四种匹配条件
     **/
    const TIME_QUERY = [{
        label: '大于',
        value: 'gt'
    },{
        label: '小于',
        value: 'lt'
    },{
        label: '等于',
        value: 'eq'
    },{
        label: '介于',
        value: 'between'
    }];

    export default {
        props: ['value'],

        data: function() {
            return {
                queryOptions: TIME_QUERY
                //model: this.value
            };
        },
        computed: {
            model: function() {
                return this.value;
            }
        },

        watch: {
            'model':{
                handler: function (val, oldVal) {
                    this.$emit('input', val);
                },
                deep: true
            }
        }
    };
</script>