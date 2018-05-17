X.define("common.layer",function () {
    var popLayer = {
        successMsg : function(title,callback){
            layer.msg('<span style="margin-left:20px;">'+title+'</span>', {
                icon: 1,
                time: 2000
            },function(){
                callback();
            });
        },
        failMsg : function(title,callback){
            layer.msg('<span style="margin-left:20px;">'+title+'</span>', {
                icon: 2,
                time: 2000
            },function(){
                callback();
            });
        },
        sMsg : function(title,callback,area,time,btn,closeBtn){
            layer.alert('<div style="padding:40px 15px 20px;;"><i class="iconfont icon-bgcDuiguo" style="color: #00b904;margin-right: 10px"></i>'+title+'</div>', {
                title:"提示",
                area: area || ["300px","250px"],
                time: time,
                btn: btn || ["确定"],
                closeBtn: closeBtn,
                yes : function(index){
                    callback(index);
                }
            });
        },
        sMsgSucc : function(title,callback,area){
            layer.alert('<div class="tac"><i class="iconfont icon-bgcDuiguo" style="color: #00b904;"></i>'+title+'</div>', {
                title:"提示",
                area: area || ["200px","200px"],
                yes : function(index){
                    callback(index);
                }
            });
        },
        sChange : function(content ,title,callback,area){
            layer.open({
                type : 1,
                content:content,
                title :title,
                area: area || ["500px","535px"],
                btn:["保存"],
                yes : function(index){
                    callback(index);
                }
            });
        },
        successConfirm : function(content ,callback,title){
            layer.confirm(content ,{title:title || "提示"}, function(index){

                callback();
            });
        },
        closeIt : function(index){
            layer.close(index);
        },
        successChange : function(content ,title, callback){
            layer.confirm(content ,{title:title}, function(index){
                callback(index);
            });
        },
        layerImg:function(content){
            layer.open({
                type: 1,
                title: false,
                area: function(){
                    var imgarea = [$(content).width(), $(content).height()];
                    var winarea = [$(window).width() - 50, $(window).height() - 50];
                    if(imgarea[0] > winarea[0]){
                        imgarea[0] = winarea[0];
                        imgarea[1] = imgarea[0]*img.height/img.width;
                    }
                    return [imgarea[0]+'px', imgarea[1]+'px'];
                }(),
                content: content
            });
        },
        layerOpen:function(opt){
            layer.open({
                type: opt.type || 1,
                title: opt.title ||false,
                closeBtn: opt.closeBtn || 0,
                area: opt.area || false,
                skin: opt.skin || false, //没有背景色
                shadeClose: opt.shadeClose || false,
                btn: opt.btn || false,
                time: opt.time,
                content: opt.content || "",
                success:function(){
                    opt.callback && opt.callback();
                },
                yes:function(){
                    opt.yes && opt.yes();
                }
            });
        },
        layerAlert : function(content){
            layer.alert(content);
        },

        layerBigImg : function(img){
            var index = layer.open({
                type: 1,
                content: img,
                maxmin: true
            });
            layer.full(index);
        },
        layerPrompt : function(content,callback){
            layer.alert(content,function(index){
                callback(index);
            });
        },
        alert: function(msg) {
            layer.alert(msg)
        },
        closeAll: function (type) {
            layer.closeAll(type);
        }
    };


    return popLayer;
});