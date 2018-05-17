X.define("modules.statistics.externalLinks", ["model.statisticsModel", "modules.common.routerHelper"], function (statisticsModel, routerHelper) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.statistics.tpl.externalLinks
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        view.render({}, function () {
            ctrl.initPage();
            ctrl.initQuery();
        });
    };

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    ctrl.initPage = function (data, url){
        // var data = {
        //     "beginDate": "2017-04-29 11:11:11",
        //     "endDate": "2017-04-29 11:11:11",
        //     "platForm": "atcdeal"
        // };
        // ctrl.getEchartData(data, X.config.statistics.api.externalLinks);
    };

    var platform = 'atcdeal';
    ctrl.initQuery = function () {
        ctrl.view.find(".js-platform").parent().parent().hide();
        ctrl.view.find(".js-selectPlatform div").click(function () {
            platform = $(this).attr('name');
            $(this).addClass('select-platform-active');
            $(this).siblings().removeClass('select-platform-active');
            ctrl.view.find(".js-platform").val(platform);
        });
        var $searcher = ctrl.view.find(".js-searchbox");
        var option = {};
        option.searchMeta = {
            schema: {
                simple: [
                    {
                        name: "date",
                        title: "选择日期",
                        ctrlType: "DateRangePicker"
                    }
                ]
            },
            reset: {
                show: false
            }
        };
        var searcher = Xbn.prototype.controls.getControl("Searcher",$searcher, option.searchMeta);
        searcher.init();

        ctrl.view.find(".js-search").click(function () {
            //var dateTime = ctrl.view.find(".js-searchbox option:eq(1)").val();
            var dateTime = searcher.controls.date.val();
            var beginTime = '';
            var endTime = '';
            if (dateTime) {
                dateTime = dateTime.split('@');
                beginTime = dateTime[0];
                endTime = dateTime[1];
            }

            var data = {
                "beginDate": beginTime,
                "endDate": endTime,
                "platForm": platform
            };
            ctrl.getEchartData(data, X.config.statistics.api.externalLinks);
        });
    };

    ctrl.getEchartData = function (data, url){
        var callback = function(result){
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                ctrl.setEchartFun(result.data);
            }
        };
        statisticsModel.getEchartData(data, callback, url);
    };

    ctrl.setEchartFun = function (data) {
        var myChart = echarts.init(ctrl.view.find("#main")[0]);
        if (data.length) {
            var option = {
                title: {
                    text: '外链统计',
                    left: 'center',
                    textStyle: {
                        //color: '#3399cc'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "<div style='text-align: left'>{a} </div>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: data.sort(function (a, b) {
                        return a.value - b.value;
                    })
                },
                toolbox: {
                    show: true,
                    feature: {
                        // dataView: {show: true, readOnly: false},
                        // saveAsImage: {
                        //     show: true,
                        //     title: '保存'
                        // }
                    }
                },
                //calculable : true,
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: data.sort(function (a, b) {
                        return a.value - b.value;
                    }),
                    //.sort(function (a, b) { return a.value - b.value; })
                    animation: false
                }]
            };
            ctrl.view.find("#main").show();
            myChart.setOption(option);
            var temp = ctrl.view.find(".js-noData");
            if (!temp.hasClass('none')) {
                ctrl.view.find(".js-noData").addClass('none');
            }
        } else {
            $(myChart).html();
            ctrl.view.find("#main").hide();
            ctrl.view.find(".js-noData").removeClass('none');
        }
    };

    return ctrl;

});
