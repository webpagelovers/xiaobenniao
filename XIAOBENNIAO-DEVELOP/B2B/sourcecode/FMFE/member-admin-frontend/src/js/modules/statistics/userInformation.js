X.define("modules.statistics.userInformation", ["model.statisticsModel"], function (statisticsModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.statistics.tpl.userInformation
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
        ctrl.getEchartData(data,'browser',"浏览器",X.config.statistics.api.userInformationBrowser);
        ctrl.getEchartData(data,'os',"操作系统",X.config.statistics.api.userInformationOperatingSystem);
    };

    //获取后台图表X轴和value
    ctrl.getEchartData = function (data,elm,text,url){
        var callback = function(result){
            if(result.statusCode == X.constructor.prototype.constant.statusCode.SUCCESS){
                ctrl.setEchartFun(elm,text,result.data);
            }
        };
        statisticsModel.getEchartData(data,callback,url);
    };

    //设置浏览器、操作系统图表
    ctrl.setEchartFun = function(elm,text,dataX){
        var chart_pv = echarts.init(document.getElementById(elm));
        var option = {
            title : {
                text: text,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        dataX ? option.series[0].data = dataX : '';
        chart_pv.setOption(option);
    };

    return ctrl;

});
