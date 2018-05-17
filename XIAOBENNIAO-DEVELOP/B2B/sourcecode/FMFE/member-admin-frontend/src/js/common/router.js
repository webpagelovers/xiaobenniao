/**
 * @TODO
 *     当前还存在的问题:
 *         1、不适合多个List 或 Tabpanel
 *         2、Tab切换 pagination 貌似会有点问题, 但这需求得看产品定义
 *         3、searchMeta 的获值类型还不全, 当前只支持['TextBox' 'DateRangePicker' 'ComboBox'], 有需求时再添加
 *         4、gridMeta 没写
 *         5、其他问题暂时还未发现
 * 
 */
X.define('common.router',function () {

    function Router() {
        this.props()
        this.eventBind()
    }

    Router.prototype.props = function() {
        this.mark  = '&ldata='

        var defaultParam = {
            panel: '',
            ldata: {
                searchData: {},
                pData:      {
                    pageNo:   1,
                    pageSize: 10,
                },
                gridData:   {}
            }
        }

        var search =  decodeURIComponent(location.search.split(this.mark)[1])
        this.route = search === 'undefined'? undefined: JSON.parse(search)

        this.param = this.route || defaultParam
        
    }

    Router.prototype.setRoute = function() {
        !this.param.panel && $('[tabchangeinfo].active').attr('tabchangeinfo') && (this.param.panel = $('[tabchangeinfo].active').attr('tabchangeinfo'))

        var url    =  encodeURIComponent(JSON.stringify(this.param)),
            mark   =  this.mark,
            search =  location.search.split(mark)[0]

        history.pushState(null, '', search + mark + url)
    }

    Router.prototype.eventBind = function() {
        var me = this

        $('body').on('click', function(e) {
            var tar    =  $(e.target),
                clazz  =  tar.attr('class') || '',
                key    =  null,
                par    =  null

            //搜索按钮
            if (clazz.indexOf('js-search') > -1 && (par = tar.parent('dt').parent('.screen_box.search_main')).length) {
                me._setSearchData(par)

            //页签的1 2 3 4 5等按钮
            } else if (key = tar.attr('data-num')) {
                me._setPageNoData(key)

            //页签的 "首页" 按钮
            } else if (clazz.indexOf('firstPage') > -1 && tar.parents('.js-pagination').length) {
                me._setPageNoData(1)

            //页签的 "尾页" 按钮
            } else if (clazz.indexOf('lastPage') > -1 && tar.parents('.js-pagination').length) {
                var page = tar.next().children().html().split('/')[1]
                me._setPageNoData(page)

            //页签的 "每页显示几条" 按钮
            } else if ((key = tar.parent().attr('index-data') || tar.attr('index-data')) && tar.parents('ul.dropdown').length && tar.parents('.js-changePageSize').length) {
                me._setPageSizeData(key)

            //Tab 按钮
            } else if ((key = tar.parent().attr('tabchangeinfo') || tar.attr('tabchangeinfo')) && tar.parents('.tab_btn').length) {
                me._setTab(key)
            }
        })

        //this._eventPanel()
    }

    Router.prototype._setPageNoData = function(index) {
        this.param.ldata.pData.pageNo = index
        this.setRoute()
    }

    Router.prototype._setPageSizeData = function(size) {
        this.param.ldata.pData.pageSize = size
        this.setRoute()
    }

    Router.prototype._setSearchData = function(par) {
        this.param.ldata.searchData = this._getSearchData(par)
        this.setRoute()
    }

    //为了提高使用方便性, 选择了减少与其他组件的关联, 而无法使用组件的 getValue
    Router.prototype._getSearchData = function(par) {
        var data = {}

        par.siblings('.screen_box').each(function(i, item) {
            var tar   = $(item).children(':eq(1)').children(),
                clazz = tar.attr('class'),
                key   = '',
                val   = '',
                type  = tar[0].tagName

            //TextBox
            if (type === 'INPUT') {

                val = tar.val()

            } else if (type === 'DIV') {

                if (!clazz) {
                    
                    //DateRangePicker
                    if (tar.children('select').length) {
                        clazz = tar.children('select').attr('class')
                        val   = tar.children('select').children(':eq(1)').attr('val')
                    }

                //ComboBox
                } else if (clazz.indexOf('wrapper-dropdown') > -1) {
                    val = tar.children().eq(0).val()
                }
            }

            clazz.split(' ').forEach(function(item) {
                item.indexOf('js-') === 0 && (key = item.substr(3, item.length))
            })

            if(val || val == 0) {
                data[key] = val
            }
        })

        return data
    }

    Router.prototype._setTab = function(panel) {
        this.param.panel = panel
        this.param.ldata.pData.pageNo   = 1
        this.param.ldata.pData.pageSize = 10
        this.setRoute()
    }

    window.autoRouter = new Router()

})