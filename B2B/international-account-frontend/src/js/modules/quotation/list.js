X.define("modules.quotation.list", function () {

	var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.quotation.tpl.list
    });

    var ctrl = X.controller.newOne({
        view: view
    });

    var schema = {
        searchMeta: {
            schema: {
                        simple: [
                            {
                                name: "productName",
                                inputName: "productName",
                                title: "产品名称",
                                ctrlType: "TextBox",
                                placeholder: "请输入产品名称"
                            },
                            {
                                name: "status",
                                inputName: "status",
                                title: "询盘状态",
                                ctrlType: "ComboBox",
                                dataSource: inquiryModel.const.cases,
                                className:'z10000'
                            },
                            {
                                name: "postTime",
                                inputName: "postTime",
                                title: "发布时间",
                                ctrlType: "DateRangePicker"
                            }
                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            if (data.query.status == -2) {
                                data.query.status = '';
                            }
                            if (click) {
                                route.setRoute(getRoute());
                            }

                            if (data.query.postTime) {
                                data.query.postTime = data.query.postTime.split('@');
                                data.query.startPostTime = data.query.postTime[0];
                                data.query.endPostTime = data.query.postTime[1];
                                delete data.query.postTime;
                            }

                            return data;
                        }
                    },
        }
    }

    ctrl.load = function() {
    	view.render(function() {
    		
    	})
    }

    return ctrl
})