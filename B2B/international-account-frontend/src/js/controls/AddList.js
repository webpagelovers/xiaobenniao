(function ($,X) { 

  X.prototype.controls.widget("AddList",function (controlType) {  

      var BaseControl = X.prototype.controls.getControlClazz("BaseControl");    
      
      function AddList(elem,options) {
          BaseControl.call(this,elem,options);
          this.props()
          this.init()
      }

      X.prototype.controls.extend(AddList,"BaseControl");    
      AddList.prototype.constructor = AddList;

      AddList.prototype.init = function() {

          !this.options.gridMeta   && this.generateGridMeta()
          !this.options.searchMeta && this.generateSearchMeta()
          !this.options.pageInfo   && this.generatePageInfo()

          this.loadTemplate()
      }

      AddList.prototype.props = function() {
          this.options      = this.options.dataSource
          this.templateType = this.options.templateType || 'productTemplate'
          this.name         = this.elem.attr('data-property-name') || this.elem.attr('name')
          this.checkedItem  = []
          this.key          = this.options.idKey || 'productId'
          this.inputHidden  = this.elem.find('input[type=hidden]')
          this.mixColumns   = this.options.gridMeta.mixColumns
      }

      AddList.prototype.generateGridMeta = function() {

      }

      AddList.prototype.generateSearchMeta = function() {
        var columns    = this.mixColumns,
            simple     = [],
            searchMeta = {
              schema: {
                simple: simple
              },
              search: {
                onSearch: function (data, searcher, click) {
                  return data;
                }
              },
              reset: false
            }


        columns.forEach(function(item) {
            item = item.field

            if (item.isSearch) {
              var searchObj = {
                  name:     item.name,
                  title:    item.title,
                  ctrlType: "TextBox"
              }

              simple.push(searchObj)
            }

        })

        this.options.searchMeta = searchMeta
      }

      AddList.prototype.generatePageInfo = function() {
          var pageInfo = {
              pageSize: 5,
              pageNo:   '1'
          }
          this.options.pageInfo = pageInfo
      }

      AddList.prototype.loadTemplate = function() {
          var me = this
          this.elem.append(this.templates()).append('<div class="js-datagrid drawerDetailTable addList-showProductList"></div>')

          this.checkDiv   =   this.elem.children(':eq(1)')
          this.showDiv    =   this.elem.children(':eq(2)')
          this.checkList  =   null
          this.showList   =   null

          this.eventBind()
          this.generateList()
          this.getSources()
      }

      AddList.prototype.render = function() {
          
      }

      AddList.prototype.eventBind = function() {
          var me = this
          this.elem.on('click', '[eventType]', function(e) {
              var eventType = this.getAttribute('eventType')
              me[eventType] && me[eventType].call(me, this)
          })

         /* this.checkDiv.on('click', 'input[type=checkbox]', function() {
              me._eventCheckBox.call(me, this)
          })*/

      }

      AddList.prototype.templates = function() {
          var productTemplate = [
            '<div class="none">',
            '    <div class="productList addList-productList">',
            '       <div class="addProduct addProduct-close por" eventType="_eventShowList">X</div>',
            '       <div class="clear"></div>',
            '           <span class="f14 ml20 inlineb mt10">从产品库中选择产品</span>',
            '       <div class="listWrap por list-elem">',
            '           <div class="screen_search_box fix js-searchbox inlineb tar pr70 fr"></div>',
            '           <div class="table_main js-datagrid ml20 w96p"></div>',
            '           <div class="js-pagination pagination clearance-productList-pagination fr mr20"></div>',
            '       </div>',
            '       <div class="mt30 ml30">',
            '           <span class="addProduct default_button disib pr10 pl10" eventType="_eventCheckProduct">添加已选择产品</span>',
            '           <span>（产品中没有找到，添加新产品）</span>',
            '           <span class="ml20 colff6 curp" eventType="_eventAddProduct"><i class="iconfont icon-add mr5"></i>添加新产品</span>',
            '       </div>',
            '    </div>',
            '    <p class="addList-cover"></p>',
            '</div>'
          ].join('')

          var _templates = {
              productTemplate: productTemplate
          }

          return _templates[this.templateType]
      }

      AddList.prototype.generateList = function() {
          var me = this
          this.options.gridMeta.afterRowRender = function(row, data, index) {
              me.afterRowRender.call(me, row, data, index)
          }
          this.options.gridMeta.afterTableRender = function(row, data, index) {
              me.afterTableRender.call(me, row, data, index)
          }
          this.separateColumns()

          this.checkList = window.X.controls.getControl('List', this.checkDiv.find('.list-elem'), this.options)
          this.checkList.init()

          var meta = {
              gridMeta: this.options.gridMeta
          }
          this.showList  = window.X.controls.getControl('DataGrid', this.showDiv[0], this.showGridMeta)
          this.showList.init()
      }

      AddList.prototype.separateColumns = function() {
          var showColumns   = [],
              checkColumns  = [],
              columns       = this.mixColumns

          columns.forEach(function(item, i) {
              item.isShowItem   && showColumns.push(item)
              !item.notCheckItem && checkColumns.push(item)
          })

          this.showGridMeta = {columns: showColumns}
          this.options.gridMeta.columns = checkColumns
      }

      AddList.prototype.getSources = function() {
          var me          =  this,
              option      = {}

          option.url      = this.options.url
          option.type     = 'POST'
          option.data     = {"query":{}, "pageSize": 5000000, pageNo: 1}
          option.callback = function(res) {
              me.sources  = res.data.list
          }

          window.X.loadData(option)
      }

      AddList.prototype.afterRowRender = function(row, data, index) {
          var me = this
          //this.selectCheckbox()
          /*this.checkedItem.forEach(function(item) {
              item[me.key] == data[me.key] && $(row.dom).find("input[type=checkbox]").attr("checked", true)
          })*/
      }

      AddList.prototype.afterTableRender = function(row, data, index) {
          var me = this
          this.selectCheckbox()
      }

      AddList.prototype.valueChanged = function(input) {
          var id      = input.id,
              checked = input.checked

          if (checked) {
              for (var i = this.sources.length; i--;) {
                  var item = this.sources[i]
                  if (id == item[this.key]) {
                      this.checkedItem.push(item)
                      break
                  }
              }
          } else {
              for (var i = this.checkedItem.length; i--;) {
                  var item = this.checkedItem[i]
                  if (id == item[this.key]) {
                      this.checkedItem.splice(i, 1)
                      break
                  }
              }
          }

          this.setHiddenValue()
      }

      AddList.prototype.setHiddenValue = function() {
          var validVal = ''
          this.checkedItem.forEach(function() {
              validVal += 'a'
          })
          this.inputHidden.val(validVal)
          validVal && this.inputHidden.valid()
      }

      AddList.prototype.selectCheckbox = function() {
          var checkbox = this.checkDiv.find('.js-datagrid > table'),
              thead    = checkbox.children('thead'),
              tbody    = checkbox.children('tbody'),
              headBox  = thead.find('input[type=checkbox]'),
              bodBox   = tbody.find('input[type=checkbox]')

          var me   = this,
              flag = true

          bodBox.each(function(i, item) {
              item.checked = false
          })

          this.checkedItem.forEach(function(item) {
              var id = item[me.key]
              tbody.find('#' + id).attr('checked', true)
          })

          bodBox.each(function(i, item) {
              !item.checked && (flag = false)
          })

          bodBox.length && (headBox[0].checked = flag)

          this.setHiddenValue()
      }

      AddList.prototype._eventShowList = function() {
          this.checkDiv.toggleClass('none')
      }

      AddList.prototype._eventCheckProduct = function() {
          this.checkDiv.toggleClass('none')
          this.showList.loadData(this.checkedItem)
          this.selectCheckbox()
      }

      AddList.prototype._eventAddProduct = function() {
          var hrefs = location.href.split('m=')
          open(hrefs[0] + 'm=customerClearance.addDeclareProduct');
      }

      AddList.prototype._eventRemove = function(dom) {
          dom.checked = false
          this.valueChanged(dom)
          this.showList.loadData(this.checkedItem)
          this.selectCheckbox()
      }

      AddList.prototype._eventCheckBox = function(input) {
          var me        =   this,
              par       =   $(input).parent().parent().parent(),
              type      =   par[0].tagName,
              table     =   par.parent(),
              thead     =   table.children('thead'),
              tbody     =   table.children('tbody'),
              checked   =   input.checked
          
          switch (type) {
              case 'THEAD':
                tbody.find('input[type=checkbox]').each(function(i, item) {
                    item.checked = checked
                    me.valueChanged(item)
                })
                break
              case 'TBODY':
                var flag = true
                tbody.find('input[type=checkbox]').each(function(i, item) {
                    !item.checked && (flag = false)
                })
                thead.find('input[type=checkbox]')[0].checked = flag
                me.valueChanged(input)
                break
          }
      }

      AddList.prototype.setValue = function(val) {
          this.checkedItem = val
          this.showList.loadData(this.checkedItem)
          this.selectCheckbox()
      }

      AddList.prototype.getValue = function() {
          return this.checkedItem
      }

      return AddList;
  });


})(jQuery,this.Xbn);