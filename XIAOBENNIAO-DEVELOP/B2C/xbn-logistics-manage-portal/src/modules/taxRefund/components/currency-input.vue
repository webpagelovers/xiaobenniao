<template>
    <span :class="className">
        <nt-input type="text" ref="input" :disabled="disabled" :placeholder="placeholder" :maxlength="maxlength"
            v-bind:value="curValue"
            v-on:input="updateValue"
            v-on:focus="selectAll"
            v-on:blur="formatValue"
            ></nt-input>
    </span>
</template>

<script>
    export default {
        props: {
            value: {
                type: [String, Number]
            },
            fixDecimal: {
                type: [String, Number],
                default: 2
            },
            placeholder: {
                type: String,
                default: ''
            },
            className: {
                type: String,
                default: ''
            },
            disabled: {
                type: [Boolean],
                default: false
            },
            maxlength: {
                type: [String, Number],
                default: 19
            },
            onBlurCall: {
                default: function () {}
            }
        },
        computed: {
            curValue() {
                if (this.value && this.$nt.isNumber(this.value)) {
                    // 初始化的时候，就显示已经格式化的数据
                    this.$emit('input', Number(this.value).toFixed(this.fixDecimal).toString());
                }
                return this.value ? this.value.toString() : '';
            }
        },
        methods: {
            updateValue: function (value) {
                var formattedValue = value.trim();
                this.$emit('input', formattedValue);
            },
            formatValue: function (index) {
                if (Number(this.curValue)) {
                    this.$emit('input', Number(this.curValue).toFixed(this.fixDecimal).toString());
                    this.$emit('onBlurCall');
                }
            },
            selectAll: function (event) {
              // Workaround for Safari bug
              // http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
                setTimeout(function () {
                  	event.target.select()
                }, 0)
            }
        }
    }
</script>


<style lang="less" scoped>
    span {display: inline-block;}
</style>
