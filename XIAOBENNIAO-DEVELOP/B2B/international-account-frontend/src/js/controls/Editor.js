(function ($,X) {

    X.prototype.controls.widget("Editor", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        function Editor(elem, options){
            BaseControl.call(this,elem,options);
            this.init(elem, options);
        }

        X.prototype.controls.extend(Editor,"BaseControl");

        Editor.prototype.constructor = Editor;

        Editor.prototype.init = function(elem, options) {
            this.props(elem, options)
            this.loadTemplate()
            this.generateEditor()
        }

        var defaultOptions = {
            maximumWords: 1500
            //errorClass: 'editor-error'
        }
        /**
         @method props 添加属性
         */
        Editor.prototype.props = function(elem, options) {
            this.name       =   this.elem.attr('data-property-name') || this.elem.attr('name')
            this.elem       =   elem
            this.options    =   options || {}

            for (var i in defaultOptions) {
                !this.options[i] && (this.options[i] = defaultOptions[i])
            }
        }

        /**
         @method loadTemplate 添加模板
         */
        Editor.prototype.loadTemplate = function() {
            var name = this.name,
                html = [
                    '<script id="'+ name +'" class="default-edit" type="text/plain"></script>',
                    '<input type="hidden" name="'+ name +'" data-property-name="'+ name +'">'
                ].join('')

            this.elem.append(html)
        }

        /**
         @method loadTemplate 生成Editor
         */
        Editor.prototype.generateEditor = function() {
            var id = this.name
            UE.delEditor(id)
            this.editor = UE.getEditor(id, this.options);
            this.addEvent()
            
        }

        /**
         @method loadTemplate 为editor添加事件
         */
        Editor.prototype.addEvent = function() {
            var me = this

            this.editor.on('blur', function() {
                $('input[name='+ me.name +']', me.elem).val(me.editor.getContent()).valid()
            })
        }

        Editor.prototype.getValue = function() {
            return this.editor.getContent()
        }

        Editor.prototype.setValue = function(value) {
            var me = this
            this.editor.ready(function() {
                me.editor.setContent(value)
            })
        }

        return Editor
    });

})(jQuery,this.Xbn);