X.define("modules.common.config",function () { 
    $.ajaxSetup({
        contentType: "application/json;charset=utf-8",
        crossDomain:true,
        xhrFields: {
            withCredentials: true
        }
    });

    $.support.cors = true;

    var initChannels  =function(){
        //订阅服务消息

        X.channels["e"] = "app.serviceError";
        X.channels["i"] = "app.serviceInfo";

        X.subscribe(X.channels["e"],function(){
            layer.open({
                title:'Warning',
                content:'Server refused request.',
                btn:['OK']
            });
        });

        X.subscribe(X.channels["i"],function(){

        });
    };

    initChannels();
    
});