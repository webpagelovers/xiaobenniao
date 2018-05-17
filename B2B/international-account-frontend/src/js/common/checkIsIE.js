(function () {

    var checkIsIE = function () {

        var userAgent = window.navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器

        if(isIE){
            var version=userAgent.match(/MSIE\s\d+/);
            var vNumber=version[0].split(" ")[1];
            if(vNumber<10){
                var fls = flashChecker();
                if (fls.f){
                    if(fls.v < 23){
                        warnInfo("非常抱歉，您当前安装的flash版本较低，为了不影响后期操作的正常进行，请您升级最新版本");
                    }
                }else{
                    warnInfo("非常抱歉，您当前安装的flash版本较低，为了不影响后期操作的正常进行，请您升级最新版本");
                }
            }
        }

        //检测是否安装flash
        function flashChecker() {
            var hasFlash = 0;         //是否安装了flash
            var flashVersion = 0; //flash版本
            var swf;

            try{
                swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            }
            catch(e){

            }
            if (swf) {
                hasFlash = 1;
                VSwf = swf.GetVariable("$version");
                flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
            }

            return { f: hasFlash, v: flashVersion };
        }

        //弹出提示框
        function warnInfo (content) {
            var con = '<div style="padding:0 0 20px;">'+content+'</div>';
            layer.alert(con, {
                title:"提示",
                //area: ["318px","216px"],
                btn:["下载"],
                yes : function(index){
                    var btn = $('.layui-layer-btn');
                    btn.find('.layui-layer-btn0').attr({
                        href: '../../installPackage/flashplayer23ax_ca_install.exe'
                    });
                    layer.close(index);
                }
            });
        }
    };

    checkIsIE();

    return {};

})();
