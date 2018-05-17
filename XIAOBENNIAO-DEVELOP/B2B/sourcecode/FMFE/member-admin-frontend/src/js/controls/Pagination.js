(function ($,X) { 

X.prototype.controls.widget("Pagination",function (controlType){    

    /**
    * 页码组件封装
    *
    * @class Pagination
    * @constructor
    * @param {DOM}     elem  [必需]  页码组件要渲染到的dom元素
    * @param {Object}  opt   [必需]  初始化参数
    *     @param {String}    op.id              [可选]     更新数据
    *     @param {String}    op.totalCount      [可选]     总共的条数    [default: 0]
    *     @param {String}    op.pageSize        [可选]     每页显示条数  [default: 10 | > 0]
    *     @param {String}    op.pageNo          [可选]     当前所在页数  [default: 1  | > 1]
    *     @param {String}    op.totalPages      [可选]     总页数       [default: 总共的条数/每页条数]
    *     @param {function}  op.clickFirstPage  [可选]     点击首页的回调方法
    *     @param {function}  op.clickLastPage   [可选]     点击尾页的回调方法
    *     @param {function}  op.clickPrePage    [可选]     点击上一页的回调方法
    *     @param {function}  op.clickNextPage   [可选]     点击下一页的回调方法
    *     @param {function}  op.clickOtherPage  [可选]     点击某一页 或者 输入框输入值且点击确定后的回调方法
    *     @param {function}  op.changePageSize  [可选]     改变每页显示多少条 下拉后的回调方法
    *     @param {Object}    op.smallPapogation [可选]     附属小标题参数对象
    *         @param {Bloolean}  op.isShow [可选]     是否显示附属小标题 true-显示 false-隐藏
    *         @param {DOM}       op.elem [可选]       显示附属小标题的时候，需要被渲染到的dom元素
    */

    function Pagination(elem, opt) {
        // ele
        this.targetElement = elem;
        this.id = opt.id || '';
        // 共 X 条
        this.totalCount = opt.totalCount || '0';
        // 每页显示 X 条  select
        this.pageSize = opt.pageSize || '10';
        // 当前页
        this.pageNo = opt.pageNo || '1';
        // 共 X 页
        this.totalPages = opt.totalPages || Math.ceil(this.totalCount / this.pageSize).toString();
        // 用于存放 有用的 element
        this.elementChild = {};
        this.smallPapogation = opt.smallPapogation || {isShow: false};
        // this.smallPapogation = opt.smallPapogation || {isShow: true, elem: $('.small_papogation')};


        // 到 X 页  确定

        // 首页 每页 尾页 到X页 选择每页X条 点击事件
        this.clickFirstPage = opt.clickFirstPage;
        this.clickLastPage = opt.clickLastPage;
        this.clickPrePage = opt.clickPrePage;
        this.clickNextPage = opt.clickNextPage;
        this.clickOtherPage = opt.clickOtherPage;
        this.changePageSize = opt.changePageSize;

        this.dataFromUrl();
        this.create();
    }

    /**
     * 设置 从浏览器地址栏中获取 pagination 信息
     * 
     * 潜在问题：如果一个页面中有2个list, 就不知道是哪个对哪个, 但原先的routerHelper也没考虑到这个问题,
     *           如果要改改动会比较大, 所以暂时先不考虑这个问题
     * 
     * @method dataFromUrl
     */
    Pagination.prototype.dataFromUrl = function () {
        if (window.autoRouter && autoRouter.route) {
            var data = autoRouter.route.ldata.pData;

            this.pageSize = data.pageSize;
            this.pageNo   = data.pageNo;
        }
    }

    // 获得


    Pagination.prototype.get = function () {
        var pageInfo = {
            pageNo : this.pageNo,
            pageSize : this.pageSize,            
        }
        return pageInfo;        
    }
    /**
     * 销毁页码渲染内容，当初传入的DOM元素还存在
     *
     * @method destroy
     */
    Pagination.prototype.destroy = function () {
        this.targetElement.find('ul').remove();
    }

    /**
     * 创建页码的dom元素 及 相应事件绑定
     *
     * @method create
     */
    Pagination.prototype.create = function () {
        var self = this;
        var oUl = $('<ul class="pager"></ul>');
        // 共 X 条
        var firstLi = $('<li class="li-select-page"></li>');
        var oSpan = $('<span class="page_line">共 </span>');
        var oEm = $('<em>' + this.totalCount + '</em>');
        this.elementChild.totalCount = oEm;
        oSpan.append(oEm);
        oSpan.append(' 条');
        firstLi.append(oSpan);
        firstLi.append('<span>每页显示</span>');
        // 下拉 每页显示 X 条


        var selectLi = $(X.prototype.controls.getControlClazz("ComboBox").getTemplate({name:"changePageSize"}));

        firstLi.append(selectLi);
        selectLi.addClass();

        var cmb = X.prototype.controls.getControl("ComboBox",selectLi,{dataSource:[{key:10,value:10},{key:20,value:20},{key:30,value:30},{key:50,value:50}],
            defaultValue: this.pageSize || 10,
            selectedChanged: function (item) {
                if(self.pageSize != item.key){
                    self.pageSize = item.key;
                    self.changePageSize(item);     
                }               
            }
        });

        //cmb.init();

        this.elementChild.selectPageSize = selectLi;
        firstLi.append('条');
        oUl.append(firstLi);

        // 首页 按钮
        var oFirstPage = $('<li class="firstPage">首页</li>');
        this.elementChild.firstPage = oFirstPage;
        oFirstPage.on('click', $.proxy(this.toFirstPage, this));
        oUl.append(oFirstPage);

        // 上一页 按钮/*0705wfybug350*/
        var oPrePage = $('<li class="none prePage icon-55"></li>');
        this.elementChild.prePage = oPrePage;
        oPrePage.on('click', $.proxy(this.toPrePage, this));
        oUl.append(oPrePage);

        // 具体页码
        this.elementChild.oNumPage = [];
        var oNumPageBox = $('<li class="noneBg"></li>');
        var i = 1;
        var renderLastPages = (Number(this.totalPages) + 1) > 6 ? 6 : (Number(this.totalPages) + 1);
        // 渲染具体页面时用
        this.renderLastPage = renderLastPages;
        this.renderFirstPage = 1;

        if (renderLastPages > 1) {
            for (; i < renderLastPages; i++) {
                var oNumPage = $('<span data-num="' + i + '">' + i  + '</span>');
                if(i==this.pageNo){
                    oNumPage.addClass("on");
                }
                this.elementChild.oNumPage.push(oNumPage);
                oNumPageBox.append(oNumPage);
            }
        } else {
            var oNumPage = $('<span data-num="1">1</span>');
            this.elementChild.oNumPage.push(oNumPage);
            oNumPageBox.append(oNumPage);
        }
        this.elementChild.numPageBox = oNumPageBox;
        //this.elementChild.oNumPage[this.pageNo].addClass('on');
        oNumPageBox.on('click', $.proxy(this.clickPage, this));
        oUl.append(oNumPageBox);

        // 下一页 按钮/*0705wfybug350*/
        var oNextPage = $('<li class="nextPage icon-56"></li>');
        this.elementChild.nextPage = oNextPage;
        oNextPage.on('click', $.proxy(this.toNextPage, this));
        oUl.append(oNextPage);

        // 尾页 按钮
        var oLastPage = $('<li class="lastPage">尾页</li>');
        this.elementChild.lastPage = oLastPage;
        oLastPage.on('click', $.proxy(this.toLastPage, this));
        oUl.append(oLastPage);

        // 页码状态 input
        var oStateLi = $('<li class="li-select-page"></li>');
        oStateLi.append('共 ');
        var oState = $('<span>' + this.pageNo + ' / ' + this.totalPages + '</span>');
        this.elementChild.state = oState;
        oStateLi.append(oState);
        oStateLi.append('页');
        //oStateLi.append(' 页 到第');
        var oPageInput = $('<input class="toPageInput" type="text">');
        this.elementChild.pageInput = oPageInput;
        //oStateLi.append(oPageInput);
        //oStateLi.append('<span>页</span>');
        oUl.append(oStateLi);
        // 确认按钮
        var oConfirmBtn = $('<li class="toPage">确定</li>');
        this.elementChild.confirmBtn = oConfirmBtn;
        oConfirmBtn.on('click', $.proxy(this.toOtherPage, this));
        //oUl.append(oConfirmBtn);

        this.targetElement.html('').append(oUl);

        if (this.smallPapogation.isShow) {
            // 显示小页码
            var oFragment = document.createDocumentFragment();
            this.smallPapogation.elem = X.prototype.isString(this.smallPapogation.elem)
                ? $(this.smallPapogation.elem)
                : this.smallPapogation.elem;
            this.smallPapogation.elem.html('');
            // smallPrePage
            var oListprev = $('<em class="xbn_ico listprev"></em>');
            this.elementChild.smallPrePage = oListprev;
            oListprev.on('click', $.proxy(this.toPrePage, this));
            oFragment.appendChild(oListprev[0]);
            // smallState
            var oSmallState = $('<span><i class="">' + this.pageNo + '</i> / ' + this.totalPages + '</span>');
            this.elementChild.smallState = oSmallState;
            oFragment.appendChild(oSmallState[0]);
            // smallNextPage
            // var oListnext = $('<em class="se_ico listnext"></em>');
            // // oListnext.on('click', $.proxy(this.toNextPage, this));
            // oListnext.on('click', this.toNextPage);
            // oFragment.appendChild(oListnext[0]);

            // smallNextPage
            var oListnext = $('<em class="xbn_ico listnext"></em>');
            this.elementChild.smallNextPage = oListnext;
            oListnext.on('click', $.proxy(this.toNextPage, this));
            oFragment.appendChild(oListnext[0]);

            this.smallPapogation.elem.append(oFragment);
        } else {

        }
        // listprev
    }

    //
    // 点击 具体页码
    //  - 不管在多少页，都只显示5个可点击页
    // @method reRender
    Pagination.prototype.clickPage = function (event) {
        var _target = $(event.target);
        if (_target[0].nodeName === 'SPAN') {
            var newPageNo = _target.attr('data-num');
            this.toOtherPage(newPageNo);
        }
    },
    /**
     * 重新渲染具体页码的显示
     *  - 不管在多少页，都只显示5个可点击页
     * @method reRender
     */
    Pagination.prototype.reRender = function () {
        if (this.totalPages == '0') {
            this.targetElement.hide();
            if (this.smallPapogation.isShow) {
                this.smallPapogation.elem.hide();
            }
        } else {
            var newRenderFirstPage = this.totalPages === '0' ? 1
                : Number(this.pageNo) + 2 >= this.totalPages
                    ? (this.totalPages - 4 > 0
                        ? this.totalPages - 4
                        : 1)

                    : (this.pageNo - 2 > 0
                        ? this.pageNo - 2
                        : 1);
            var newRenderLastPage = this.totalPages === '0' ? 1
                : Number(this.pageNo) + 2 > this.totalPages
                    ? this.totalPages
                    : (Number(this.pageNo) + 2 - newRenderFirstPage > 5
                        ? Number(this.pageNo) + 2
                        : (newRenderFirstPage + 4 < this.totalPages ? newRenderFirstPage + 4 : this.totalPages));
            // clickLi
            var i = 0;
            if (Number(this.renderLastPage) === Number(newRenderLastPage)
                && Number(this.renderFirstPage) === Number(newRenderFirstPage)) {
                var arrNumPages = this.elementChild.oNumPage;
                for (; i < arrNumPages.length; i++) {
                    $(arrNumPages[i]).removeClass('on');
                }
                $(arrNumPages[this.pageNo - this.renderFirstPage]).addClass('on');
            } else {
                this.elementChild.oNumPage = [];
                this.renderFirstPage = newRenderFirstPage;
                this.renderLastPage = newRenderLastPage;
                this.elementChild.numPageBox.html('');
                var pFragment = document.createDocumentFragment();
                for (i = newRenderFirstPage; i <= newRenderLastPage; i++) {
                    var oNumPage = $('<span data-num="' + i + '">' + i  + '</span>');
                    this.elementChild.oNumPage.push(oNumPage);
                    pFragment.appendChild(oNumPage[0]);
                }
                this.elementChild.numPageBox.append(pFragment);
            }
            this.elementChild.oNumPage[this.pageNo - this.renderFirstPage]
                && this.elementChild.oNumPage[this.pageNo - this.renderFirstPage].addClass('on');
            // state
            this.elementChild.state.html(this.pageNo + '/' + this.totalPages);
            // smallState
            this.elementChild.smallState && this.elementChild.smallState.html('<i class="">' + this.pageNo + '</i> / ' + this.totalPages);
            // pageInput
            this.elementChild.pageInput.val('');
            // totalCount
            this.elementChild.totalCount.html(this.totalCount);

            this.targetElement.show();
            if (this.smallPapogation.isShow) {
                this.smallPapogation.elem.show();
            }

            if (this.pageNo === '1') {
                this.elementChild.firstPage.addClass('disable');
                this.elementChild.prePage.addClass('disable');
               // this.elementChild.smallPrePage.addClass('disable');

            } else {
                this.elementChild.firstPage.removeClass('disable');
                this.elementChild.prePage.removeClass('disable');
               // this.elementChild.smallPrePage.removeClass('disable');
            }
            if (this.pageNo === this.totalPages) {
                this.elementChild.lastPage.addClass('disable');
                this.elementChild.nextPage.addClass('disable');
               // this.elementChild.smallNextPage.addClass('disable');
            } else {
                this.elementChild.lastPage.removeClass('disable');
                this.elementChild.nextPage.removeClass('disable');
               // this.elementChild.smallNextPage.removeClass('disable');
            }
        }
    }

    /**
     * 到首页
     *
     * @method toFirstPage
     */
    Pagination.prototype.toFirstPage = function () {
        if (this.pageNo != '1') {
            this.set({
                pageNo: '1'
            });
        } else {
            return;
        }
        this.clickFirstPage && this.clickFirstPage();
    }

    /**
     * 到尾页
     *
     * @method toLastPage
     */
    Pagination.prototype.toLastPage = function () {
        if (this.pageNo != this.totalPages) {
            this.set({
                pageNo: this.totalPages
            });
        } else {
            return;
        }
        this.clickLastPage && this.clickLastPage();
    }

    /**
     * 到上一页
     *
     * @method toPrePage
     */
    Pagination.prototype.toPrePage = function () {
        if (this.pageNo > 1) {
            this.set({
                pageNo: Number(this.pageNo) - 1
            });
        } else {
            return;
        }
        this.clickPrePage && this.clickPrePage();
    }

    /**
     * 到下一页
     *
     * @method toNextPage
     */
    Pagination.prototype.toNextPage = function () {
        if (this.pageNo > 0 && Number(this.pageNo) < this.totalPages) {
            this.set({
                pageNo:  Number(this.pageNo) + 1
            });
        } else {
            return;
        }
        this.clickNextPage && this.clickNextPage();
    }

    /**
     * 到 X 页
     * @param {String}  page  [必需]
     * @method toOtherPage
     */
    Pagination.prototype.toOtherPage = function (page) {
        if (!X.prototype.isString(page)) {
            page = this.elementChild.pageInput.val();
            if (!Number(page)) {
                return;
            }
        }
        if (this.pageNo != page && page > 0 && page <= Number(this.totalPages)) {
            var isInteger = function (obj) {
                return obj%1 === 0;
            };
            if(isInteger(page) == true){
                this.set({
                    pageNo: page
                });
            };
        } else {
            return;
        }
        this.clickOtherPage && this.clickOtherPage();
    };

    /**
     * 设置 更新具体数据
     * @param {Obejct}  _opt  [必需]
     *     @param {String}    _opt.pageNo  [可选]  重置当前所在页数
     *     @param {String}    _opt.pageSize  [可选]  重置每页显示条数
     *     @param {String}    _opt.totalCount  [可选]  重置总共的条数
     *     @param {String}    _opt.totalPages  [可选]  重置总页数
     * @method set
     */
    Pagination.prototype.set = function (_opt) {
        if (_opt.pageNo) {
            this.pageNo = _opt.pageNo;
        }
        if (_opt.pageSize) {
            this.pageSize = _opt.pageSize;
        }
        if (_opt.totalCount != undefined) {
            this.totalCount = _opt.totalCount;
        }
        if (_opt.totalPages != undefined) {
            this.totalPages = _opt.totalPages;
        }

        this.reRender();
    }


    return Pagination;

});

})(jQuery,this.Xbn);
