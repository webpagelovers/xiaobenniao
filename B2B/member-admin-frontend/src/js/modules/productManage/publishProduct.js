X.define('modules.productManage.publishProduct', ['model.productsManageModel', 'common.layer', 'adapter.webuploader', 'adapter.ueditor'], function(model, layer) {
	var view = X.view.newOne({
		el: $('.xbn-content'),
		url: X.config.productManage.tpl.publishProduct
	})

	var ctrl = X.controller.newOne({
		view: view
	})

	var validate = {
		rules: {
            title:   					{ required: true, rangelength: [1, 250] },
            tagKeyword1: 				{ required: true, rangelength: [1, 20] },
            tagKeyword2: 				{ 				  rangelength: [1, 20] },
            tagKeyword3: 				{ 				  rangelength: [1, 20] },						
            specificationsAndModels: 	{ required: false, rangelength: [1, 20] },
           	commodityDescription: 		{ required: true, rangelength: [1, 1500] },				
            price:      				{ required: false, rangelength: [1, 50], isIntFloat2: 10 },                     
            port:    					{ required: false, rangelength: [1, 50] },
            issuanceStationId:    		{ required: true  					   },
            commodityAttachmentList:    { required: true, rangelength: [1, 20] },
            currency:    				{ required: false  					   },
            priceClause:    			{ 				  rangelength: [1, 50] }, 					 
            texture: 					{ 				  rangelength: [1, 20] },
            weight:    					{ 				  rangelength: [1, 20] },		 
            size:     					{ 				  rangelength: [1, 20] },  					 
            colour: 					{ 				  rangelength: [1, 20] },
            peculiarity:  				{ 				  rangelength: [1, 20] },
            hscode:     				{ 				  rangelength: [1, 10], isIntGteZeroExtend: true }
        },
        messages: {
            title:   					{ required: "请输入标题", 				rangelength: "字数在250字以内" },
            tagKeyword1:   				{ required: "请输入标签/关键词", 		rangelength: "字数在20字以内" },
            tagKeyword2:   				{ 										rangelength: "字数在20字以内" },
            tagKeyword3:   				{ 										rangelength: "字数在20字以内" },
            specificationsAndModels:   	{ required: "请输入规格型号", 			rangelength: "字数在20字以内" },
            commodityDescription:  		{ required: "请输入产品描述", 			rangelength: "字数在1500字以内" },
            price:   					{ required: "请输入价格", 				rangelength: "字数在50字以内", isIntFloat2: "必须数字且小数点前最多十位,后两位" },
            port:   					{ required: "请输入港口", 				rangelength: "字数在50字以内" },
            issuanceStationId:   		{ required: "请选择发布网站"											},
            commodityAttachmentList:   	{ required: "请上传图片", 			rangelength: "图片数量在1-20张" },
            currency:   				{ required: "请选择货币类型"											},
            priceClause:   				{  										rangelength: "字数在50字以内" },
            texture:   					{  										rangelength: "字数在20字以内" },
            weight:   					{  										rangelength: "字数在20字以内" },
            size:   					{  										rangelength: "字数在20字以内" },
            colour:   					{  										rangelength: "字数在20字以内" },
            peculiarity:   				{  										rangelength: "字数在20字以内" },
            hscode:   					{  										rangelength: "字数在10字以内", isIntGteZeroExtend: "必须为正整数" }
        },
        onkeyup: false,
        onfocusout: function (element) {
            var elem = $(element);
            elem.valid();
        },
        errorPlacement: function (error, element) {
            element.after(error)
        }
	}

	var submitClicked = false

	var events = {
		init: function() {
			var me = this
			ele = $('.purchaseInfoDetail', view.el)

			id && me.isEdit()

			UE.delEditor('publishProEditor')
			editor = UE.getEditor('publishProEditor',{maximumWords:1500, toolbars:[["bold", "forecolor", "fontsize", "paragraph", "link"]], errorClass: 'pro-man-edi-err', afterBlur: function() {
				var val = editor.getContent(),
					len = val.substr(0, editor.getContentLength(true))
				$('input[data-property-name=commodityDescription]', view.el).val(val).next().val(len).valid()
			}});
			//UE.delEditor()
			
			$('.js-submit', ele).on('click', me.save)

			ele.validate(validate)
		},
		isEdit: function() {
			this.fillData()
			submitType = 'PUT'
			$('.now', view.el).html('自营商品 > 编辑商品')
		},
		save: function() {
			//ele.find('[name=commodityDescription]').val(editor.getContent())
			if (ele.valid()) {
				
				var data = events.dataConvert.call(this, ctrl.vm.collectData())

				if (!submitClicked) {
					submitClicked = true
					model.save(data, submitType, function(res) {
						if (res.statusCode === X.constant.statusCode.SUCCESS) {
							layer.successMsg('提交成功', function() {
								history.go(-1)
							})
						} else {
							layer.alert('提交失败, 请联系服务人员')
						}
						submitClicked = false
					})
				}
			}
		},
		dataConvert: function(data) {
			data.commodityDescription = editor.getContent()
			data.commodityStatus = this.getAttribute('stype')
			data.commodityAttachmentList.forEach(function(item) {
				if (item.url) {
					item.filePath = item.url
					delete item.url
				}
			})
			data.tagKeyword = data.tagKeyword1  
								+ (data.tagKeyword2? ',' + data.tagKeyword2.trim(): '')
								+ (data.tagKeyword3? ',' + data.tagKeyword3.trim(): '')
			
			delete data.tagKeyword1
			delete data.tagKeyword2
			delete data.tagKeyword3

			data.issuanceStationList = []
			//{issuanceStationId: data.issuanceStationId}
			data.issuanceStationId.split(',').forEach(function(item) {
				data.issuanceStationList.push({issuanceStationId: item})
			})
			delete data.issuanceStationId

			submitType === 'PUT' && (data.commodityId = id)

			return data
		},
		fillData: function() {
			model.query(id, function(res) {
				data = res.data[0]
				data.tagKeyword.split(',').forEach(function(item, i) {
					data['tagKeyword' + (i + 1)] = item
				})

				for (var i in data) {
					var dom = ele.find('[name='+ i +']')
					dom.val(data[i])
				}
				events.extraDataTransform()
			})
		},
		extraDataTransform: function() {
			//upload.setValue(data.commodityAttachmentList)
			editor.ready(function() {
				editor.setContent('<p>'+ data.commodityDescription +'</p>')	
			})
			ctrl.vm.getControl('currency').setValue(data.currency)
			var issuanceStationId = ctrl.vm.getControl('issuanceStationId')
			data.issuanceStationList.forEach(function(item) {
				issuanceStationId.setValue(item.issuanceStationId)
			})
			ctrl.vm.getControl('commodityAttachmentList').renderAll(data.commodityAttachmentList)
			data.commodityStatus == '1' && $('.js-submit[stype=0]', ele).remove()
		}
	}

	var id, ele, data, upload, editor, submitType

	ctrl.load = function(para) {
		submitType = 'POST'
		id = para.id
		view.render(data,function() {
            events.init()

            var meta = {
            	'currency': {dataSource : model.currency},
            	'issuanceStationId': {dataSource : model.issuanceStationId},
            	'commodityAttachmentList': {
	                size: 2,
	                type: 14,
	                //min:  3,
	                max:  20,
	                duplicate: false,
	                accept: {extensions: 'jpg,jpeg,png'}
	            }
            }
            ctrl.vm = ctrl.getViewModel(ele,{ meta: meta});
            ctrl.vm.initControl()
		})
	}

	return ctrl
})