X.define("modules.common.checkIsIE",function () {

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
                        warnInfo("请安装最新版flash");
                    }
                }else{
                    warnInfo("请安装最新版flash");
                }
            }
        }

        //检测是否安装flash
        function flashChecker() {
            var hasFlash = 0;         //是否安装了flash
            var flashVersion = 0; //flash版本
            var VSwf;

            var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (swf) {
                hasFlash = 1;
                VSwf = swf.GetVariable("$version");
                flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
            }

            return { f: hasFlash, v: flashVersion };
        }

        //弹出提示框
        function warnInfo (content) {
            var con = '<div style="padding:0 0 20px;"><i class="iconfont icon-bgcGanTan" style="color: orange;margin-right: 10px"></i><a style="color: #00b7ee" href="../../installPackage/flashplayer23ax_uu_install.exe">'+content+'</a></div>';
            layer.alert(con, {
                title:"提示",
                area: ["318px","216px"],
                yes : function(index){
                    layer.close(index);
                }
            });
        }
    };

    checkIsIE();

    return {};

});