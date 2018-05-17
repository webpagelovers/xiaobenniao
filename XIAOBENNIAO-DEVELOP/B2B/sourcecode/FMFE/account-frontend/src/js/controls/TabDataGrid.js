(function ($,X) { 

X.prototype.controls.widget("TabDataGrid",function (controlType) {


    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");


    /**
    @class TabDataGrid 切换数据表格
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息
    */
    function TabDataGrid(elem,options) {
        BaseControl.call(this, elem, options);

        this.setDataSource();
    }


    /**
    @method 获取切换数据表格控件tab按钮模板
    @static 类静态方法
    @return 获取切换数据表格控件tab按钮模板
    */
    TabDataGrid.getTabTemplate = function (item) {
        var html = '<li tabChangeInfo="' + item.createTime + '">' + item.createTime + '</li>';

        return html;
    };

    /**
     @method 获取切换数据表格控件数据表格模板
     @static 类静态方法
     @return 获取切换数据表格控件数据表格模板
     */
    TabDataGrid.getDataGridTemplate = function (item) {
        var html = '<div class="listWrap mb100">';
            html+=      '<p><span class="col66">变更时间：</span><span class="changeDate">'+ item.createTime+'</span></p>';
            html+=      '<p class="mt10"><span class="f14">变更公告</span><span class="col66">（<span style="color:red">注：</span>主要变更内容：<span class="changeMainContent">'+ item.comment+'</span>）</span></p>';
            html+=      '<div class="table_main js-datagrid"></div>';
            html+= '</div>';

        return html;
    };

    X.prototype.controls.extend(TabDataGrid,"BaseControl");
    TabDataGrid.prototype.constructor = TabDataGrid;

    /**
     @method getHtml 获取组合切换数据表格组件html
     @param ds {Array} 数据源
     @return 组合切换数据表格组件html
     */
    TabDataGrid.prototype.getHtml = function (ds) {
        var item,html = "";
        var that = this;

        var tabHtml = function (ds){
            var tabHtmls =  TabDataGrid.getTabTemplate(ds);
            return  tabHtmls;
        };

        var contentDiv = [];


        html = '<div class="js_tabPannel1">';
        html +=   '<div class="tab_btn fl changeTime mt40 mb100">';
        html +=      '<div class="col66 bgcFf"><p>变更时间</p><p>CHANGE TIME</p></div>';
        html +=      '<ul class="fix">';
        for (var i = 0, il = ds.data.length; i < il; i++) {
            html += tabHtml(ds.data[i]);
            contentDiv.push("<div></div>");
        }
        html +=      '</ul>';
        html +=   '</div>';
        html += '<div class="tab_content js-tabContent fl ml40 mt40 w80p">';
        html += contentDiv.join("");
        html += '</div></div>';

        return html;
    };


    /**
     @method setDataSource 设置切换列表
     @param dataSource {Object} 数据表格数据源配置，从服务器获取
     */
    TabDataGrid.prototype.setDataSource = function (dataSource) {
        var that = this;
        var $wrapTabDataGrid = that.elem.find(".js-wrapTabDataGrid");
        $wrapTabDataGrid.empty();
        var ds = dataSource || this.options.dataSource;
        var html = "";
        if (ds.data.length > 0) {
            html = this.getHtml(ds);
            var tabPanel = $(html);
            $wrapTabDataGrid.append(tabPanel);

            var header;
            function initTabPage($elem,tabPage) {
                for (var i = 0, il = ds.data.length; i < il; i++) {
                    if(tabPage == ds.data[i].createTime){
                        if(that.options.getHeaderF){
                            header = that.options.getHeaderF();
                        }

                        var content =$(TabDataGrid.getDataGridTemplate(ds.data[i]));

                        var grid =  X.prototype.controls.getControl("DataGrid",content.find(".js-datagrid").get(0),{columns:header["tenderHistoryItemList"],afterRowRender: function (row, data,index) {
                            $(row.dom).find("td").first().html(index+1);
                        }});
                        grid.init();
                        grid.loadData(ds.data[i].tenderHistoryItemList);
                        $elem.append(content);
                    }
                }

            }
            var activeTabInfo;
            var tp =  X.prototype.controls.getControl("TabPanel",tabPanel, {
                beforeChangeTab: function (tabLiInfo, targetLi, index, tabPage) {
                    activeTabLiInfo = tabLiInfo;
                    // 刊登状态 不同
                    var page = $(tabPage);
                    if(!page.data("hasInited")){
                        initTabPage(page,tabLiInfo);
                        page.data("hasInited",true);
                    }
                    // 为了样式效果，把当前选中的前一个加上样式名
                    targetLi.prev().removeClass('tab_lineNone');
                    return true;
                },
                afterChangeTab: function (tabLiInfo, targetLi, index, tabPage,oldTab) {
                    activeTabLiInfo = tabLiInfo;
                    activeTabLi = targetLi;
                    // 为了样式效果，把当前选中的前一个加上样式名
                    targetLi.prev().addClass('tab_lineNone');
                    if(tabLiInfo!=oldTab){
                        //route.setRoute({panel:tabLiInfo});
                    }
                }
            });

        }
    };

    return TabDataGrid;
});


})(jQuery,this.Xbn);