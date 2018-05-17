X.define("modules.inquiry.inquiryDetail", ["model.inquiryModel", "modules.common.routerHelper", "common.layer", "adapter.intlTelInput", "modules.inquiry.inquiryDetailInfo"], function (inquiryModel, routerHelper, layer, intlTelInput, inquiryDetailInfo) {

    //初始化视图对象
    var view = X.view.newOne({
        el: $(".xbn-content"),
        url: X.config.inquiry.tpl.inquiryDetail
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    var getRoute = function () {
        var route = {panel: activeTabLiInfo, ldata: lists[activeTabLiInfo].val()};
        return route;
    };

    var schemas2 = (function () {
        var schemas = {
            "tabAll": {
                searchMeta: {
                    schema: {
                        simple: [

                        ]
                    },
                    search: {
                        onSearch: function (data, searcher, click) {
                            data.query.sourcingRequestId = _para["sourcingRequestId"];
                            //data.query.sourcingRequestId = 12;
                            return data;
                        }
                    },
                    selector: "tabAll",
                    reset: {
                        show: false
                    }
                },
                gridMeta: {
                    columns: [],
                    orderMode: 1,
                    primaryKey: "userId",
                    afterRowRender: function (row, data) {
                        $(row.dom).find(".js-name").html(data.name);
                        $(row.dom).find(".js-email").html(data.email);
                        $(row.dom).find(".js-phone").html(data.phone);
                        $(row.dom).find(".js-postTime").html(data.postTime);
                        $(row.dom).find(".js-adminName").html(data.adminName);

                        var source = '';
                        if (data.source != '') {
                            if(data.source.match(/^\d+$/)){
                                source = inquiryModel.const.source[data.source].value;
                            }else{
                                source = data.source;
                            }
                        }
                        $(row.dom).find(".js-source").html(source);

                        var index = data.details.indexOf('<body');
                        var endIndex = data.details.indexOf('<\/body>');
                        if (index != -1) {
                            var temp = data.details.slice(index + 7, endIndex - 4);
                            $(row.dom).find(".js-details").html(temp);
                        }
                        var fileUploadController = window.X.config.PATH_FILE.path.rootUploadUrl;
                        var attachmentList = data.sourcingRequestQuoteAttachments;
                        var infoDetailAttach = $(row.dom).find(".js-quoteAttach");
                        infoDetailAttach.html('');
                        $.each(attachmentList, function (i, item) {
                            var a = '<div class="grayBlock mr10" style="margin-bottom: 10px;"><a href=' + fileUploadController + '?fileType=' + 9 + '&filePath=' + item.filePath + '&fileName=' + encodeURI($.trim(item.fileName)) + ' class="underline c009add">' + item.fileName + '</a><span class="accessory col66 ml30">' + item.fileSize + '</span></div><br>';
                            $(infoDetailAttach).append(a);
                        });

                        if (attachmentList.length == 0) {
                            infoDetailAttach.css({'display': 'inline-block'})
                        }

                    },
                    afterTableRender: function () {
                        setTimeout(function () {
                            var temp = ctrl.view.el.find('.js-quote-content .page_line em').text();
                            ctrl.view.el.find('.js-quote-count').text(temp);
                            $('#loading').remove();
                        }, 1000);
                    },
                    type : "C",
                    selector : ".js-modules-inquiry-detail"
                },
                pageInfo: {
                    pageSize: '10',
                    totalPages: '10',
                    pageNo: '1',
                    smallPapogation: {
                        isShow: false,
                        elem: '.js_small_papogation1'
                    }
                },
                url: X.config.inquiry.api.quote,
                toolbar: {
                    items: [
                    ]
                }

            }
        };

        return schemas;
    })();

    var lists = {};
    var activeTabLiInfo2 = "tabAll";

    function initTabPage($elem, schema, tabPage) {
        var list = X.controls.getControl("List", $elem, schema);
        list.init();
        lists[tabPage] = list;
    }

    ctrl.initPage  =function (){
        var tabPannel = X.controls.getControl("TabPanel", $('.js_tabPannel1'), {

        });
        var tabPannel2 = X.controls.getControl("TabPanel", $('.js_tabPannel2'), {
            activeTabInfo: activeTabLiInfo2,
            beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                activeTabLiInfo2 = tabLiInfo;
                // 刊登状态 不同
                var page = $(tabPage);
                if (!page.data("hasInited")) {
                    var schema2 = schemas2[tabLiInfo];
                    if (schema2) {
                        initTabPage(page, schema2, tabLiInfo);
                    }
                    page.data("hasInited", true);
                }
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().removeClass('tab_lineNone');
                return true;
            },
            afterChangeTab: function (tabLiInfo, targetLi, index, tabPage, oldTab) {
                activeTabLiInfo2 = tabLiInfo;
                activeTabLi = targetLi;
                // 为了样式效果，把当前选中的前一个加上样式名
                targetLi.prev().addClass('tab_lineNone');
                if (tabLiInfo != oldTab) {
                    //route.setRoute({panel: tabLiInfo});
                }
            }
        });
        if (_para["tab"]) {
            ctrl.view.el.find("li[tabChangeInfo=all]").removeClass('active');
            ctrl.view.el.find("li[tabChangeInfo=under_review]").addClass('active');
            ctrl.view.el.find("li[tabChangeInfo=under_review]").click();
        }

        var callback = function (result) {
            if (result.statusCode="2000000") {

                var data = result.data[0];

                var arr = data.userAgent.split(';');
                arr.shift();
                data.userAgent = arr.join(';');

                data.ip = data.ip + ' ' + data.countryAbb + ' ' + data.countryNameCn;
                inquiryDetailInfo.originalInfoTabInit(data, ctrl, _para);
                inquiryDetailInfo.publicInfo();

            }
        };
        inquiryModel.getInquiryDetailById(_para["sourcingRequestId"], callback);

        ctrl.view.el.find(".js-addQuote").click(function () {
            X.router.run("m=inquiry.addPrice&sourcingRequestId=" + _para["sourcingRequestId"]);
        });
    };

    ctrl.rendering = function () {
        return view.render({}, function () {
            return view.render({}, function () {
                X.require(["adapter.webuploader"], function () {
                    ctrl.initPage();
                });
            });
        });
    };

    var _para;
    ctrl.load = function (para) {
        para = para || {};
        _para = para ;
        var loading = '<div id="loading"><img src="../images/loading2.gif"></div>';
        $('body').append($(loading));
        ctrl.rendering();
    };

    return ctrl;

});
