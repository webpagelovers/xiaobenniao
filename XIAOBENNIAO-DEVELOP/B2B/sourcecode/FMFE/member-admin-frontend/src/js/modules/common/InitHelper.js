X.define("modules.common.InitHelper",function () {
	
	var cons = {
		attribute: 'init',
		separate:  ' ',
		eventSep:  ':',
		eventType: 'click'
	}

	var InitHelper = function(page) {
		handle.meta = page

		//get out the constant
		var attr   = cons.attribute,
			sep    = cons.separate

		var doms   = $('['+ attr +']', page.el),
			length = doms.length

		while (length--) {
			var dom   = doms.eq(length),
				attrs = dom.attr(attr).split(sep),
				type  = attrs[0],
				tar   = attrs[1]
				
			handle[type](dom, tar)	
			//page[type + length] = dom
		}

		handle._init()

		this.data = page
	}

	var handle = {
		meta: null,
		event: function(el, invoke) {
			//check attr
			invoke = invoke.split(cons.eventSep)

			if (invoke.length !== 1) {
				cons.eventType = invoke[0]
				invoke = invoke[1]
			}

			el.on(cons.eventType, meta[invoke])
		},
		validate: function(el, invoke) {
			el.validate(this.meta.validate)
			this._add('forms', el, invoke || 'form')
		},
		datagrid: function(el, invoke) {
			var datagrid = this.meta.datagrid,
				name     = invoke,
				invoke   = datagrid[invoke]

			if (!invoke) return
			var grid 	 = X.controls.getControl('DataGrid', el[0], invoke)
			
			grid.init()

			this._add('gridIntances', grid, name)
			
			if (invoke.data) grid.loadData(invoke.data)
			if (invoke.toolbar) this.toolbar(grid, invoke.toolbar)
		},
		toolbar: function(grid, option) {
			var toolbar = X.controls.getControl("Toolbar", $(option.selector, this.meta.el), option);

            toolbar.init();
            toolbar.target = grid;
		},
		list: function(el, invoke) {
			var data = this.meta.list,
				list = X.controls.getControl('List', el, data[invoke])
			list.init()

			this._add('listIntances', list, invoke)
		},
		tab: function(el, invoke) {
			var data = this.meta.tab[invoke]
			
			//create html tab_btn & tab_content
			var lis = conts = ''
			for (var i in data) {
				var dd = data[i]

				lis += [
					//'<li class="active" tabChangeInfo="tabAll">',
					'<li>',
			        '   <a href="javascript:;">'+dd.title+'</a>',
			        '</li>',
				].join('')

				conts += [
					'<div class="listWrap">',
			        (dd.seachMeta?'	<div class="screen_search_box fix js-searchbox"></div>':''),
			        (dd.toolbar?'	<div class="operation_btn js-operation"></div>':''),
			        (dd.gridMeta?'	<div class="table_main js-datagrid"></div>':''),
			        (dd.pageInfo?'	<div class="papogation js-pagination pagination"></div>':''),
			        '</div>',
				].join('')

			}

			var html = [
				'<div class="tab_btn"><ul class="fix fL">'+ lis +'</ul></div>',
		        '<div class="tab_content js-tabContent">'+ conts +'</div>'
			].join('')
			
			if (!el.children('.tab_btn').length) {
				el.append(html)
				el.find('li').eq(0).addClass('active')
			}

			tab  = X.controls.getControl('TabPanel', el, data)

			this._add('tabIntances', tab, invoke)
		},
		//add object into meta
		_add: function(key, val, name) {
			var tar = this.meta[key]
			if (!tar) this.meta[key] = {}
			this.meta[key][name] = val
		},
		_init: function() {
			//set doms by selector
			var doms
			if (doms = this.meta.doms) {
				for (var i in doms) {
					doms[i] = $(doms[i].selector || doms[i])
				}
			}
		}
	}

	return InitHelper
})