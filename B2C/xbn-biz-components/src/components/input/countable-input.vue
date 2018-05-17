<style scoped>
    .textarea_counter{
        line-height: 14px;
        color: #cccccc;
        position: absolute;
        right: 16px;
        bottom: 16px;
    }
    .red{color: red}
    .col_9fa1a2{color: #9fa1a2;}
</style>

<template>
    <div class="rel">
        <slot>
            <nt-input :type="type"
                      :rows="rows"
                      :placeholder="placeholder"
                      :value="value"
                      @change="handleChange"
                      :maxlength="maxlength"></nt-input>
        </slot>
        <p class="textarea_counter">
            <span :class="count >= 1 ? 'col_57595b' :'' " >
                <i :class="count == total ? 'red' : ''">{{count}}</i>
            </span>/{{maxlength}}<!-- {{total-count}} -->
        </p>
    </div>
</template>

<script>

    export default {
        props: {
            type: {
                type: String,
                default: 'text'
            },
            maxlength: {
                type: Number,
                default: 20,
            },
            value: [String, Number],
            placeholder: String,
            size: String,
            rows: {
                type: Number,
                default: 2
            }
        },


        data: function () {
            return {
                count: 0
            };
        },

        computed: {

        },

        created() {

        },

        methods: {
            //统计计数
            handleChange(value){
                this.count = 0 + value.length;
            }
        }
    };
</script>
