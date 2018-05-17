X.define('modules.purchaseInfo.matchInfo', ['model.purchaseInfoModel', 'modules.purchaseInfo.matchInfo_columns', 'modules.common.InitHelper', 'common.router', 'adapter.laydate'], function(model, columns, InitHelper, routerHelper) {
	var view = X.view.newOne({
		el: $('.xbn-content'),
		url: X.config.purchaseInfo.tpl.matchInfo
	})

	var ctrl = X.controller.newOne({
		view: view
	})

    var events = {
        init: function() {
            this.bind()
            
            model.queryAll()
            jQuery.extend(submitData, model.fillData)
            for (var i in submitData) {
                submitData[i] = []
            }
            model.clickOtherPage = events.clickOtherPage
        },
        bind: function() {
            var me = this
            page.doms.bottomBtn.on('click', me.prevOrNext)
            page.doms.matchInfoBox.on('change', '[type=checkbox]', me.selectCheckbox)
            page.doms.matchInfoBox.on('click', '.filterDataDetail', function() {
                X.router.run('m=purchaseInfo.infoDetail&id=' + this.id)
            })
        },
        submit: function() {
            var newData = {}
            for (var i in submitData) {
                var arr = newData[ model.submitDataRef[i] ] = []
                var dd = submitData[i]
                dd.forEach(function(item) {
                    arr.push(item.purchaseInfoId || item.supplierCompanyId)
                })
            }
            model.submit(newData, function(res) {
                if (res.statusCode == X.constant.statusCode.SUCCESS) {
                    layer.alert('提交成功', function() { 
                        location.reload()
                    })
                } else {
                    layer.alert('服务器出错')
                }
            })
        },
        prevOrNext: function() {
            var me    = $(this),
                type  = me.attr('type'),
                box   = page.doms.matchInfoBox,
                index = box.children('.active').index(),
                key   = box.children().eq(index).attr('for')

            switch (type) {
                case 'prev':
                    index--
                    show()
                    break
                case 'next':
                    if (submitData[key].length) {
                        index++
                        show()
                        events.fillList()
                    } else {
                        layer.alert('请至少勾选一条信息')
                        return
                    }
                    break
                case 'submit':
                    events.submit()
                    break
            }



            function show() {
                box.children('.active').removeClass('active')
                box.children().eq(index).addClass('active')
            }

            'matchInfoStep matchInfoPos'.split(' ').forEach(function(item) {
                item = page.doms[item]
                item.children('.active').removeClass('active')
                item.children().eq(index).addClass('active')
            })
        },
        selectCheckbox: function() {
            var me      = $(this),
                kind    = me.attr('kind'),
                checked = this.checked,
                currLi  = page.doms.matchInfoBox.children('.active'),
                type    = currLi.attr('for'),
                checkboxs = currLi.find('table').find('[type=checkbox]')

            tempId = currLi.attr('refId')

            switch (kind) {
                case 'itemsAll':
                    checked? checkboxs.attr('checked', true): checkboxs.attr('checked', false)
                    checkboxs.each(function(i, item){
                        var key = item.id
                        key && events.pushData(type, key, checked)
                    })
                    !checked && (currLi.find('[kind="allAll"]')[0].checked = false)
                    break
                case 'allAll':
                    if (checked) {
                        checkboxs.attr('checked', true)
                        jQuery.extend(submitData[type], model.fillData[type])
                    } else {
                        checkboxs.attr('checked', false)
                        submitData[type] = []
                    }
                    break
                default:
                    var key = this.id
                    key && events.pushData(type, key, checked)
                    !checked && 
                        (
                            currLi.find('[kind="allAll"]')[0].checked = false,
                            currLi.find('thead').find('[type=checkbox]')[0].checked = false
                        )
                    break
            }
        },
        pushData: function(type, key, checked) {
              var id   = tempId,
                  add  = true,
                  data = submitData[type]

              checked
                ?
                (
                    data.forEach(function(item, i){
                        key == item[id] && (add = false)

                    }),
                    add && model.fillData[type].forEach(function(item, i) {
                            item[id] == key && data.push(item)
                        })
                )
                :
                (
                    data.forEach(function(item, i) {
                        item[id] == key && data.splice(i, 1)
                    })
                )
        },
        fillList: function() {
            for (var i in submitData) {
                var list = typeof submitData[i] === 'object'? submitData[i]: model.fillData[i]
                page.listIntances[i].option.dataSource = list
                page.listIntances[i].loadData()
                $('#' + i + 'Len').html(list.length)
            }
        },
        clickOtherPage: function() {
            var currLi  = page.doms.matchInfoBox.children('.active'),
                type    = currLi.attr('for'),
                data    = submitData[type],
                matchLen  = 0,

                checkboxs = currLi.find('tbody').find('[type=checkbox]')

            checkboxs.each(function(i, item) {
                data.forEach(function(dd){
                    item.id == dd[tempId] && (item.checked = true, matchLen++)
                })
            })
            matchLen && matchLen === checkboxs.length && (currLi.find('thead').find('[type=checkbox]')[0].checked = true)
        }
    }

	var page = {
		el: view.el,
		list: columns,
        doms: {
            matchInfoBox:  '.matchInfoBox',
            bottomBtn:     'button.default_button',
            matchInfoStep: '.matchInfoStep',
            matchInfoPos:  '.matchInfoPos'
        }
	}

    var getRoute = function () {
        var route = {panel: 'filterData', ldata: page.listIntances.filterData.val()};
        return route;
    };

    //var route = new routerHelper("purchaseInfo.matchInfo", {filterData: columns.filterData}, getRoute);

    var submitData = {}

    var tempId = ''

	ctrl.load = function() {
        view.render(function() {
            //route.getRoute()
            var init = new InitHelper(page)
            page = init.data

            events.init()
        })
	}

	return ctrl
})