X.define("modules.statistics.historicalFlow", ["model.statisticsModel"], function (statisticsModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.statistics.tpl.historicalFlow
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.rendering = function () {
        return view.render({}, function () {

            //给三个平台图片添加点击事件
            ctrl.view.find(".js-selectPlatform div").click(function () {
                $(this).addClass('select-platform-active');
                $(this).siblings().removeClass('select-platform-active');
            });

            var dateRangePicker = X.constructor.prototype.controls.getControl("DateRangePicker",ctrl.view.find(".js-dateRangePicker"));
            dateRangePicker.init();
            /*ctrl.getInitData();*/
            //搜索按钮添加单击事件，根据条件搜索数据
            ctrl.view.find(".js-search").on('click',function(){
                var createDateRange = dateRangePicker.val(),
                  beginTime,endTime;
                if(createDateRange){
                    var createDateRanges=createDateRange.split("@");
                    beginTime=createDateRanges[0]+" 00:00:00";
                    endTime=createDateRanges[1]+" 23:59:59";
                    createDateRange ={beginDate:beginTime,endDate:endTime};
                }/*else{
                    createDateRange = ctrl.setDate();
                }*/
                var opt = {
                    platForm: ctrl.view.find(".select-platform-active").attr("name"),
                    beginDate: createDateRange.beginDate,
                    endDate: createDateRange.endDate
                };
                opt.beginDate ? ctrl.getInitData(opt) : '';
            })
        });
    };

    ctrl.load = function (para) {
        ctrl.rendering();
    };

    //设置默认时间
    ctrl.setDate = function(){
        var dataDate = new Date();
        var y = dataDate.getFullYear();
        var m = dataDate.getMonth()+1;//获取当前月份的日期
        var d = dataDate.getDate();
        var beginTime,endTime,createDateRange;
        beginTime= y +"-"+ (m > 9 ? (m-1) : ('0'+ (m-1))) +"-"+ (d > 9 ? (d > 30 ? 30 : d) : ('0'+ d)) +" 00:00:00";
        endTime= y +"-"+ (m > 9 ? m : ('0'+ m)) +"-"+ (d > 9 ? d : ('0'+ d)) +" 23:59:59";
        createDateRange ={beginDate:beginTime,endDate:endTime};
        return createDateRange
    };

    //点击搜索按钮重新调取后台接口获取数据
    ctrl.getInitData = function(opt){
        var data = {
            platForm: opt ? opt.platForm : '' || 'atcdeal',
            beginDate: opt.beginDate,
            endDate: opt.endDate
        };

        ctrl.getEchartData(data,'pv',X.config.statistics.api.historicalFlowPV);
        ctrl.getEchartData(data,'uv',X.config.statistics.api.historicalFlowUV);
    };

    //获取后台图表X轴和value
    ctrl.getEchartData = function (data,elm,url){
        var callback = function(result){
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                ctrl.setEchartFun(elm,result.data.xAxis,result.data.objectalues);
            }
        };
        statisticsModel.getEchartData(data,callback,url);
    };

    //设置pv、uv图表
    ctrl.setEchartFun = function(elm,dataX,dataValue){
        var chart_pv = echarts.init(document.getElementById(elm));
        var option = {
            backgroundColor: 'white',
            title : {
                text: elm,
                x:'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            },
            legend: {
                icon: 'rect',
                itemWidth: 14,
                itemHeight: 5,
                itemGap: 13,
                right: '4%',
                textStyle: {
                    fontSize: 12,
                    color: '#F1F1F3'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLine: {
                    show:true,
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                data: ['13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55']
            }],
            yAxis: [{
                type: 'value',
                boundaryGap: false,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show:true,
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 14
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                data: ['0','1000', '2000', '3000','4000']
            }],
            series: [{
                name:elm,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 1
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(137, 189, 27, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(137, 189, 27, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(137,189,27)',
                        borderColor: 'rgba(137,189,2,0.27)',
                        borderWidth: 12

                    }
                },
                data: [2200, 1820, 1910, 1340, 1500, 1200, 1100, 3200, 3500, 2700, 2700, 2700]
            }]
        };
        dataX ? option.xAxis[0].data = dataX : '';
        dataValue ? option.series[0].data = dataValue : '';
        chart_pv.setOption(option);
    };

    return ctrl;

});
