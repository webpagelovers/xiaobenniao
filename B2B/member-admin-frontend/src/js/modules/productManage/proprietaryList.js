X.define('modules.productManage.proprietaryList', ['model.productsManageModel', 'modules.common.InitHelper', 'common.layer', 'data.currencyData'], function(model, InitHelper, layer, currencyData) {
	var view = X.view.newOne({
		el: $('.xbn-content'),
		url: X.config.productManage.tpl.proprietaryList
	})

	var ctrl = X.controller.newOne({
		view: view
	})

	var list = {
        searchMeta: {
            search: {
            	onSearch: function(data) {
                    return data
                }
            },
            reset: {
                show: false
            },
            schema: {
                simple: [
                    {
                        name:"tagKeyword",
                        title:"关键字",
                        ctrlType: "TextBox",
                        className: "w130"
                    },
                    {
                        name:"commodityNumber",
                        title:"商品编号",
                        ctrlType: "TextBox",
                        className: "w130"
                    }
                ]
            }
        },
        gridMeta: {
            columns: [
				{
		            field:{
		                name:"title",
		                title:'<input type="checkbox" class="checkboxSelectAll">'
		            },
		            itemRenderer: {
		                render: function(data) {
		                    return '<input type="checkbox" class="checkboxSelectItem" id="'+ data.commodityId +'">'
		                }
		            },
		            width:"6%"
		        },
				{
		            field:{
		                name:"commodityAttachmentList",
		                title:"商品图片"
		            },
		            itemRenderer: {
		            	render: function(data) {
		            		var list = data.commodityAttachmentList[0]
		            		return list? '<img src="'+ rootImg + list.filePath +'" class="productManage-pro-img">': ''
		            	}
		            },
		            width:"12%"
		        },
		        {
		            field:{
		                name:"commodityNumber",
		                title:"商品编号"
		            },
		            width:"12%"
		        },
		        {
		            field:{
		                name:"title",
		                title:"标题"
		            },
		            itemRenderer: {
		            	render: function(data) {
		            		return '<span class="word-cut w210 ib" title="'+ data.title +'">'+ data.title +'</span>'
		            	}
		            },
		            width:"15%"
		        },
		        {
		            field:{
		                name:"price",
		                title:"价格"
		            },
		            width:"8%"
		        },
		        {
		            field:{
		                name:"currency",
		                title:"币种"
		            },
		            itemRenderer: {
		            	render: function(data) {
		            		return currencyData.getCurrency(data.currency)
		            	}
		            },
		            width:"8%"
		        },
		        {
		            field:{
		                name:"commodityStatus",
		                title:"状态"
		            },
		            itemRenderer: {
		            	render: function(data) {
		            		return model.proStatus[data.commodityStatus]
		            	}
		            },
		            width:"8%"
		        },
		        {
		            field:{
		                name:"purchaseNum",
		                title:"操作"
		            },
		            itemRenderer: {
		                render: function(data) {
		                	var html = ''
		                	data.commodityStatus == 1 && (html += '<span class="colBlue curp mr20 listOperate" type="check" id="'+ data.commodityId +'">查看</span>')
		                	html += '<span class="colBlue curp listOperate" type="edit" id="'+ data.commodityId +'">编辑</span>'
		                    return html
		                }
		            },
		            width:"12%"
		        }
			]
        },
        toolbar: {
            items: [
                {
                    ctrlType: "ToolbarButton",
                    name: "add",
                    title: "新增商品",
                    icon: "icon-add",
                    click: function (item) {
                        X.router.run("m=productManage.publishProduct", "");
                    }
                },
                {
                    ctrlType: "ToolbarButton",
                    name: "delete",
                    title: "删除",
                    icon: "icon-delete",
                    click: function() {
                    	events.deleteProduct()
                    }
                }
            ]
        },
        pageInfo: {
            pageNo: '1',
            pageSize: '10'
        },
        url: X.config.productManage.api.proprietaryList
    }

	var page = {
		doms: {
			proprietaryList: '#proprietary-list'
		},
		list: {
			'list': list
		}
	}

	var container, selectAll,
		rootImg = X.config.PATH_FILE.path.rootCrawlingImgUrl

	var events = {
		init: function() {
			container = page.doms.proprietaryList
			selectAll = $('.checkboxSelectAll', container)

			var me = this
			container.on('click', function(e) {
				//console.log(container,selectAll)
				for (var i in me.fnList) {
					if (e.target.className.indexOf(i) > -1) {
						me.fnList[i].call(e.target)
						break
					}
				}	
			})
		},
		fnList: {
			listOperate: function() {
				var type   = this.getAttribute('type'),
					id     = this.id
					module = type === 'check'? 'productDetail': 'publishProduct'

				X.router.run("m=productManage."+ module +"&id=" + id, "")
			},
			checkboxSelectAll: function() {
				var checked   = this.checked,
					checkboxs = $('.js-datagrid', container).find('tbody').find('input[type=checkbox]') 

				checkboxs.attr('checked', checked)
			},
			checkboxSelectItem: function() {
				var checkboxs = $('.js-datagrid', container).find('tbody').find('input[type=checkbox]'),
					flag      = true

				for (var i = checkboxs.length;i--;) {
					if (!checkboxs[i].checked) {
						flag = false
						break
					}
				}
				$('.checkboxSelectAll', container)[0].checked = flag
			}
		},
		deleteProduct: function() {
			var checkboxs = page.doms.proprietaryList.find('input[type=checkbox]:checked')
			if (checkboxs.length) {
				var arr = []
				checkboxs.each(function(i, item) {
					arr.push(item.id)
				})
				model.remove({commodityIds: arr}, function(res) {
					if (res.statusCode === X.constant.statusCode.SUCCESS) {
						layer.successMsg('删除成功', function() {
							ctrl.load()
						})
					} else {
						layer.alert('删除失败, 请联系服务人员')
					}
				})
			} else {
				layer.alert('至少选择一个商品')
			}
		}
	}

	ctrl.load = function() {
		view.render(function() {
			var init = new InitHelper(page)
            page = init.data
            events.init()
		})
	}

	return ctrl
})