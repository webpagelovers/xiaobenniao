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
        <span v-if="model.operator!=='between'">
            <nt-date-picker v-model="model.dateValue"
                class="time-query-value fR"
                align="right"
                type="date"
                placeholder="选择日期">
            </nt-date-picker>
        </span>
        <nt-date-picker v-if="model.operator==='between'" v-model="model.rangeValue"
            class="time-query-value fR"
            align="right"
            type="daterange"
            placeholder="选择日期范围">
        </nt-date-picker>
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
                queryOptions: TIME_QUERY,
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