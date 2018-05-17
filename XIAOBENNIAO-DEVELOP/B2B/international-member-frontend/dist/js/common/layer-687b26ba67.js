X.define("common.layer", ["modules.common.multipleFiles"], function (multipleFiles) {

    var options = {
        alert: {
            title: "Notice",
            btn:   ["Yes"]
        },
        confirm: {
            title: "Notice",
            btn:   ["Yes", "No"]
        }
    }

    function extend(type, data) {
        var target = {}
        jQuery.extend(target, options[type])

        if ( data ) {
            for (var i in target) {
                data[i] && (target[i] = data[i])
            }
        }

        return target
    }

    var popLayer = {
        successMsg : function(title,callback,btn){
            layer.msg('<span style="margin-left:20px;">'+title+'</span>', {
                icon: 1,
                time: 2000,
                btn: btn
            },function(){
                callback();
            });
        },
        successRegisterMsg : function(title,callback){
            layer.msg('<span style="margin-left:20px;">'+title+'</span>', {
                icon: 1,
                time: 3000,
                btn: ['返回']
            },function(){
                callback();
            });
        },
        successregister : function(title,callback){
            layer.msg(title, {
                time: 2000
            },function(){
                callback();
            });
        },
        successConfirm : function(content , callback){
            layer.confirm(content , function(index){
                callback();
            });
        },
        closeIt : function(index){
            layer.close(index);
        },

        layerImg:function(content){
            layer.open({
                type: 1,
                area: ['297px', '420px'],
                title: false,
                content: content
            });
        },
        alert: function(content, options, yes){
            var type = typeof options === 'function';
            if(type) {
                yes = options;
                options = {};
            }
            return layer.open($.extend({
              content: content,
              yes: yes
            }, extend('alert', options)));
        }, 
        confirm: function(content, options, yes, cancel){ 
            var type = typeof options === 'function';
            if(type){
              cancel = yes;
              yes = options;
              options = {};
            }

            options = extend('confirm', options)
            return layer.open($.extend({
              content: content,
              btn: options.btn,
              yes: yes,
              btn2: cancel
            }, options));
        },
        close: function(index) {
            layer.close(index)
        },
        prompt:function(title,content,btn,fn){
            layer.open({
                title: title,
                content: content ,
                btn: btn,
                yes:fn
            });
        },
        beforePostConfirm : function(content,opt,cancelCallback,yesCallback){
            layer.confirm(content ,{
                btn:opt.btn,
                title:opt.title
            }, function(index){
                cancelCallback(index);
            },function(index){
                yesCallback(index);
            });
        }
    };


    return popLayer;
});