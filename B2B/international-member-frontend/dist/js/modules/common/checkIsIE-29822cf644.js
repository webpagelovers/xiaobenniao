X.define("modules.common.checkIsIE",["modules.common.multipleFiles"],function (multipleFiles) {

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
                        warnInfo("You have not installed the flash player, please click here to install");
                    }
                }else{
                    warnInfo("You have not installed the flash player, please click here to install");
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
             var title = "Web Message";
             var btn = "Install";
             layer.alert(con, {
                 title:title,
                 //area: ["318px","216px"],
                 btn:[btn],
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

    //checkIsIE();

    var check = function(){
        multipleFiles.introduceFiles(X.config.common.res.common,function(){
            checkIsIE();
        });
    };

    return {
        checkIsIE : check
    };

});