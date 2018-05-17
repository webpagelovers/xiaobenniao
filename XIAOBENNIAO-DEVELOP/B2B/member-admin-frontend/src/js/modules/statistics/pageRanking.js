X.define("modules.statistics.pageRanking", ["model.statisticsModel"], function (statisticsModel) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.statistics.tpl.pageRanking
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    ctrl.load = function () {

        return view.render({}, function () {
            var dateRangePicker = X.constructor.prototype.controls.getControl("DateRangePicker", ctrl.view.find(".js-dateRangePicker"));
            dateRangePicker.init();

            view.el.find(".js-selectPlatform > div").click(function () {
                $(this).addClass("select-platform-active").siblings().removeClass("select-platform-active");
            });

            view.find(".js-search").on('click', function () {
                var createDateRange = dateRangePicker.val(),
                    beginTime, endTime;

                if (createDateRange) {
                    var createDateRanges = createDateRange.split("@");
                    beginTime = createDateRanges[0];
                    endTime = createDateRanges[1];
                    createDateRange = {beginDate: beginTime, endDate: endTime};
                    var opt = {
                        platForm: ctrl.view.find(".select-platform-active").attr("name"),
                        beginDate: createDateRange.beginDate,
                        endDate: createDateRange.endDate,
                        topNum: 20
                    };
                    ctrl.getData(opt);
                }else{
                    ctrl.view.find("tbody").empty();
                }
            })
        })
    };

    ctrl.getData = function (_data) {
        statisticsModel.getPageRankingList(_data, function (result) {

            var tpl = view.el.find(".js-list-tpl");
            var notpl = view.el.find(".js-nolist-tpl");
            if (result.data[0]) {
                result = result.data;
                for (var i = 0; i < result.length; i++) {
                    result[i].dataIndex = i + 1;
                }
                view.el.find(".js-listCon").loadTemplate(tpl, result);
            } else {
                view.el.find(".js-listCon").loadTemplate(notpl, result);
            }
        })
    };

    return ctrl;

});