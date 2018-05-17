/**
 * Created by Administrator on 2017/5/25.
 */
X.define("modules.statistics.realTimeTraffic",["model.statisticsModel"], function (statisticsModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.statistics.tpl.realTimeTraffic
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var atcdealpv,atcdealuv,weintradepv,weintradeuv,bmsupplierpv,bmsupplieruv;
    ctrl.rendering = function () {
        return view.render({}, function () {
            ctrl.tab();
            ctrl.connect(0);
            atcdealpv =echarts.init(document.getElementById("echarts-atcdeal-pv"));
            atcdealuv =echarts.init(document.getElementById("echarts-atcdeal-uv"));
            weintradepv =echarts.init(document.getElementById("echarts-weintrade-pv"));
            weintradeuv =echarts.init(document.getElementById("echarts-weintrade-uv"));
            bmsupplierpv =echarts.init(document.getElementById("echarts-bmsupplier-pv"));
            bmsupplieruv =echarts.init(document.getElementById("echarts-bmsupplier-uv"));
            $(".js-accondion ul li[leaf='0'] ul li[leaf='0']:not([code='statistics.realTimeTraffic'])").click(function () {
                ctrl.disconnect();
                $(".js-accondion ul li[leaf='0'] ul li[leaf='0']:not([code='statistics.realTimeTraffic'])").unbind("click");
            });
        });
    };
    //tab切换
    ctrl.tab = function(){
        var itemHtml = $;
        itemHtml(".js-realTimeTraffic-menu li").each(function(index) {
            itemHtml(this).click(function() {
                itemHtml(".js-realTimeTraffic-menu div").removeClass("select-platform-active");
                itemHtml(".js-realTimeTraffic-content li:eq(" + index + ")").show().siblings().hide();
                itemHtml(this).find("div").addClass("select-platform-active");
                ctrl.connect(index)

            });
        });
    };
    ctrl.data = {};
    var stompClient = null;
    //订阅
    ctrl.connect = function(index) {
        var socket = new SockJS(X.config.statistics.api.realTimeTrafficWs);
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            var item = statisticsModel.const.domaiName;
            for (var i=0; i< item.length; i++){
                if(i == index){
                    stompClient.subscribe('/monitor/pv/'+item[index]+'', function (data) {
                        var data = JSON.parse(data.body);
                        ctrl.showChart(item[index]+"pv",data,"pv");
                        ctrl.view.find(".js-today").text(data.currentDate);
                    });

                    stompClient.subscribe('/monitor/uv/'+item[index]+'', function (data) {
                       var data = JSON.parse(data.body);
                        ctrl.showChart(item[index]+"uv",data,"uv");
                    });

                    ctrl.sendName(index);


                }else{
                    stompClient.unsubscribe('/monitor/pv/'+item[i]+'');
                    stompClient.unsubscribe('/monitor/uv/'+item[i]+'');
                }

            }

        });
    };
    //断开
    ctrl.disconnect = function() {
        if (stompClient != null) {
            stompClient.disconnect();
        }
    };

    ctrl.sendName = function(index) {
        stompClient.send("/app/monitor/pv", {}, JSON.stringify({'platForm':statisticsModel.const.domaiName[index] }));
        stompClient.send("/app/monitor/uv", {}, JSON.stringify({'platForm':statisticsModel.const.domaiName[index] }));
    };
    ctrl.option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: "pv",
            type:'line',
            smooth:true,
            stack: 'a',
            areaStyle: {
                normal: {}
            },
            data: ["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]
        }]
    };
    /**
     * @todo 显示图表
     * @
     * **/
    ctrl.showChart = function(domainName,data,type){
        //var myDate = new Date().getHours();
        ctrl.option.xAxis.data = data.xAxis;
        //ctrl.option.series[0].data = data.objectalues.slice(0,myDate);
        ctrl.option.series[0].data = data.objectalues;
        ctrl.option.series[0].name = type;
        switch (domainName){
            case "atcdealpv":
                atcdealpv.setOption(ctrl.option);
                break;
            case "atcdealuv":
                atcdealuv.setOption(ctrl.option);
                break;
            case "weintradepv":
                weintradepv.setOption(ctrl.option);
                break;
            case "weintradeuv":
                weintradeuv.setOption(ctrl.option);
                break;
            case "bmsupplierpv":
                bmsupplierpv.setOption(ctrl.option);
                break;
            case "bmsupplieruv":
                bmsupplieruv.setOption(ctrl.option);
                break;
            default:
                break;
        }

    };
    ctrl.load = function (para) {
        ctrl.rendering();
    };

    return ctrl;
});