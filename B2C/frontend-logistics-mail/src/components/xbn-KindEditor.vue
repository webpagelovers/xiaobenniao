<template>
    <textarea class="js-editor" name="content" ref="editor"
        v-bind:value="curValue"
    ></textarea>
</template>

<script>
    import merge from 'deepmerge';
    import kindeditor from './../../static/kindeditor/kindeditor-all.js';
    import lang from './../../static/kindeditor/lang/zh-CN.js';
    import '../../static/kindeditor/themes/default/default.css';
    import '../../static/kindeditor/themes/simple/simple.css';
    let callBack = null;
    export default {
        props: {
            value: {
                type: [String, Number]
            },
        },
        data () {
            return {
                editor: null,
                curValue: '',
                hasCreated: false
            }
        },
        methods: {
            async initEditor(opts = {}) {
                let defaultOptions = {
    		        // cssPath : '/css/index.css',
    		        // filterMode : true,
    				themeType: 'simple',
    				// basePath: './../static/kindeditor/',
                    filterMode: false,
                    width: '100%',
                    height: '450px',
                    afterChange: () => {
                        if (this.hasCreated) {
                            this.editor && this.editor.sync();
                            this.curValue = this.$el.value;
                            this.$emit('input', this.curValue);
                        }
                    }
    			};
                let options = merge(defaultOptions, opts);

                options.afterCreate = () => {
                    let that = this;
                    this.$nextTick(() => {
                        setTimeout(() => {
                            opts.afterCreate.bind(that)();
                            this.hasCreated = true;
                        }, 100)
                    });
                }
                this.editor = await KindEditor.create(this.$el, options);
            },
            html(val) {
                this.editor && this.editor.html(val);
            },
            appendHtml(val) {
                this.editor && this.editor.appendHtml(val);
            },
            fullHtml() {
                if (this.editor) {
                    return this.editor.fullHtml();
                }
            },
            focus() {
                this.editor && this.editor.focus();
            }
        },
        created() {}
    }
</script>


<style lang="less">
    .h185{height: 185px;}
    .w495 {width: 495px;}
</style>
