X.define("modules.inquiries.list", function () {

	var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.inquiries.tpl.list
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
                        ctrlType: "TextBox",
                        placeholder: "Click to search here..."
                    },
                    /*{
                        name: "postTime",
                        inputName: "postTime",
                        title: "Post Time",
                        ctrlType: "DatePicker"
                    },
                    {
                        name: "postTime",
                        inputName: "postTime",
                        association: !0,
                        ctrlType: "DatePicker"
                    },*/
                    {
                        name: "postTime",
                        inputName: "postTime",
                        ctrlType: "TabButton",
                        dataSource: ['All Statuses', 'Quotation Received']
                    }
                ]
            },
            search: {
                onSearch: function (data, searcher, click) {
                    return data;
                }
            },
            reset: {
                show: false
            }
        },
        gridMeta: {
            columns: [
                {
                    field: {
                        name: "inquiries",
                        title: "Inquiries"
                    },
                    width: "10%",
                    className: "tL"
                },
                {
                    field: {
                        name: "quotations",
                        title: "Quotations"
                    },
                    width: "13%"
                },
                {
                    field: {
                        name: "postTime",
                        title: "Post Time"
                    },
                    width: "20%"
                },
                {
                    field: {
                        name: "actions",
                        title: "Actions"
                    },
                    width: "20%"
                }
            ]
        },
        pageInfo: {
            pageSize: '10',
            pageNo: '1'
        },
        url: X.config.inquiries.api.list
    }

    var list

    var events = {
        init: function() {
            this.renderList()
        },
        renderList: function() {
            list = X.controls.getControl("List", view.el.children(), schema)
            list.init()
        }
    }

    ctrl.load = function() {
    	view.render(function() {
    		events.init()
    	})
    }

    return ctrl
})