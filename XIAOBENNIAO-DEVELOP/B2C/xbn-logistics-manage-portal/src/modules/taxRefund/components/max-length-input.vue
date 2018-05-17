<template>
    <span :class="'max-length-input-box ' + className">
        <span :class="'max-length-input-content ' + ' ' + curColor">
            <nt-input :maxlength="maxlength" :rows="rows" :placeholder="placeholder" :type="type" ref="input"
                v-bind:value="curValue"
                v-on:input="updateValue"
                v-on:focus="changeColor('on')"
                v-on:blur="changeColor()"
            ></nt-input>
            <p class="max-length-input-content-counter">{{currentLength}}/{{maxlength}}</p>
        </span>
    </span>
</template>

<script>
    export default {
        props: {
            value: {
                type: String,
            },
            type: {
                type: String,
                default: ''
            },
            className: {
                type: String
            },
            maxlength: {
                type: [String, Number],
                required: true
            },
            rows: {
                type: [String, Number],
                default: '3'
            },
            placeholder: {
                type: String,
                default: ''
            },
            validForm: {},
            validProp: {
                type: String,
            }
        },
        computed: {
            currentLength() {
                return this.value ? this.value.length : 0;
            },
            curValue() {
                return this.value ? this.value : '';
            }
        },
        data: function () {
            // debugger;
            // let curValue = this.value || '';
            return {
                curColor: '',
                isError: '',
                // curValue: curValue
            }
        },
        methods: {
            // 不是直接更新值，而是使用此方法来对输入值进行格式化和位数限制
            updateValue: function (value) {
                var formattedValue = value.trim();
                // 如果值尚不合规，则手动覆盖为合规的值
                // if (formattedValue !== value) {
                //     this.$refs.input.value = formattedValue;
                // }
                // 通过 input 事件带出数值
                this.$emit('input', formattedValue);
            },
            changeColor: function (tag) {
                if (tag) {
                    this.curColor = 'max-length-input-colorBlue';
                } else {
                    this.curColor = '';
                    // this.dispatch('nt-form-item', 'nt.form.change', this.fileList);
                    // 校验当前项目
                    // this.validForm.validateField(this.validProp, async (valid) => {
                    //     if (valid) {
                    //         this.isError = 'is-error';
                    //     } else {
                    //         this.isError = '';
                    //     }
                    // });
                }
            }
        }
    }
</script>


<style scoped>
.max-length-input-box { display: inline-block;}
.max-length-input-content {border:1px solid #ccc;display: inline-block;width: 100%;border-radius: 5px;padding-bottom: 16px; position: relative;}
.max-length-input-box .max-length-input-content >>> textarea.nt-textarea__inner {border: 0;}
.max-length-input-box .max-length-input-content >>> .nt-input__inner {border: 0;}
.max-length-input-content.max-length-input-colorBlue {border:1px solid #317dff;}
.max-length-input-content-counter { position: absolute; right: 5px; bottom: 1px; color: #ccc; line-height: 14px;}
.nt-form-item.is-error .max-length-input-content { border-color: #fe5655;}
.noBorer { border: none;}
</style>
