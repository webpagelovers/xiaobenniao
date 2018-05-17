/**
@author weijz
@module 控件库，此模块封装了常用的控件。内置了 TextBox, DateTimeBox, ComboBox, CheckBox。提供了控件注册，获取控件等方法
*/

(function ($,X) {     

    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

    /**
    @class DataGrid 表格
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息 {columns:[{field:{name:"栏目名称","title":"栏目显示名称","type":"数据类型"},width:"栏目宽度"}]}
    */
    var DataGrid = function (element, config) {
        this.config = config || {};
        this.config.showCheckbox = this.config.showCheckbox || false;

        this.columns = (config && config.columns) || [];
        this.rows = [];

        element.innerHTML = '<table cellspacing="0" cellpadding="0" rules="rows" border="1"><thead><tr></tr></thead><tbody></tbody></table>';

        this.header = element.firstChild.tHead;
        this.tbody = element.firstChild.tBodies[0];

        this.$table = $(element);

        this.initTableClass();
        this.showHeader();

        this.selectedRow = null;


        this.variables = {};

        this.primary = (config && config.primary) || "id";
    };


    DataGrid.prototype = X.prototype.createObject(BaseControl.prototype);

    /**
    @method prototype 定义DataGrid原型
    */
    DataGrid.prototype = $.extend(DataGrid.prototype,{        

        /**
        @method init 初始化，构建DataGrid表头
        @param columns {Array} 栏目数组
        */
        init : function (columns) {
            this.loadColumns(columns);
        },

        /**
        @method init 初始化，构建DataGrid表头
        @param data {Array} 表体数据，可选值，有则设值，否则返回数据
        */
        val : function (data) {
            if(data){
                this.loadData(data);
            }
            else{
                var result =[];
                for(var i = 0, il = this.rows.length; i<il; i++){
                    result.push(this.rows[i].data);
                }
                return result;
            }
        },

        /**
        @method loadColumns 构建DataGrid表头
        @param columns {Array} 栏目数组
        */
        loadColumns: function (columns) {
            columns = columns || this.columns;
            this.columns = columns;

            if (this.header.rows.length > 0) {
                this.header.removeChild(this.header.rows[0]);
            }
            var tr = this.header.insertRow(0);


            for (var i = 0; i < columns.length; i++) {
                var th = document.createElement("th");
                if(columns[i].width){
                    th.width = columns[i].width;
                }
                tr.appendChild(th);
            }


            if (this.config && this.config.showCheckbox) {
                this.columns[0].headerRenderer = HeaderRenderer;
                this.columns[0].itemRenderer = CheckboxRenderer;
            }

            this.renderHeader();
        },

        /**
        @method loadData 构建DataGrid
        @param data {Array 二维数组} 表体数据
        */
        loadData: function (data) {

            this.clear();

            if(data.length>0){
                for (var i = 0; i < data.length; i++) {
                    data[i]['_index'] = i
                    this.insertRow(data[i]);
                }
            }
            else{
                if(this.config.isRenderEmpty==true){
                    this.renderEmpty();
                }                
            }

            this.renderHeader();

            if(X.prototype.isFunction(this.config.afterTableRender)){
                this.config.afterTableRender(this);
            }

            var event = {
                type: "loadCompleted",
                target: this
            };
            this.trigger(event);
        },

        renderEmpty: function () {
            var row = DataRow.getEmptyRow(this.columns.length,"没有符合条件的数据",this.config["emptyRowRender"]);
            this.tbody.appendChild(row);
        },


        /**
        @method clear 清空表体行
        @param data {Array} 表体行数据
        */
        clear : function () {
            this.tbody.innerHTML = "";
            if(this.rows.length>0){
                this.rows.forEach(function (item,index,rows) {
                    item.destroy();
                });
            }
        },

        getNewRow: function (data) {
            return new DataRow(data,this);
        },

        /**
        @method insertRow 插入表体行
        @param data {Array} 表体行数据
        */
        insertRow: function (data) {
            var row = this.getNewRow(data);
            //this.tbody.appendChild(row.dom);
            $(this.$table).find("table").append(row.dom);

            this.rows.push(row);

            var that = this;
            row.on("selected", function (event) {
                that.select(event.row);
            });

            var event = {
                type: "rowInserted",
                newRow: row,
                target: this
            };
            this.trigger(event);
            if(this.config.afterRowRender){
                this.config.afterRowRender(row,data,this.rows.length-1);
            }
        },

        /**
        @method removeRow 删除表体行
        @param data {Array} 表体行对象
        */
        removeRow: function (row) {
            if (row === this.selectedRow) {
                this.selectedRow = null;
            }

            this.tbody.removeChild(row.dom);
            row.destroy();

            for (var i = 0; i < this.rows.length; i++) {
                if (this.rows[i] == row) {
                    this.rows.splice(i, 1);
                    break;
                }
            }

            var event = {
                type: "rowRemoved",
                target: this
            };
            this.trigger(event);
        },

        /**
        @method select 设置选中行
        @param row {DataRow} 表体行对象
        */
        select: function (row) {
            var event = {
                type: "changed",
                target: this,
                oldRow: this.selectedRow,
                newRow: row
            };

            if (this.selectedRow) {
                this.selectedRow.select(false);
            }

            if (row) {
                row.select(true);
            }

            this.selectedRow = row;

            this.trigger(event);
        },

        set: function (key, value) {
            this.variables[key] = value;
            this.renderHeader();
        },

        get: function (key) {
            return this.variables[key];
        },

        /**
        @method refresh 刷新表头
        */
        refresh: function () {
            this.renderHeader();
        },

        /**
        @method renderHeader 渲染表头
        */
        renderHeader: function () {
            var columns = this.columns;
            var temp = "";
            for (var i = 0; i < columns.length; i++) {
                var th = this.header.firstChild.childNodes[i];
                th.innerHTML ="";
                if (columns[i].headerRenderer) {
                    temp = columns[i].headerRenderer.render(this, columns[i].field, i);
                    if(temp){
                        (typeof temp === "string") ? (th.innerHTML = temp) : th.appendChild(temp);
                    }
                }
                else if (this.headerRenderer) {
                    temp = this.headerRenderer.render(this, columns[i].field, i);
                    if(temp){
                        (typeof temp === "string") ? (th.innerHTML = temp) : th.appendChild(temp);
                    }
                }
                else {
                    temp = OHeaderRenderer.render(this,columns[i],columns[i].field, i);
                    if(temp){
                        (typeof temp === "string") ? (th.innerHTML = temp) : th.appendChild(temp);
                    }
                }
            }
        },

        /**
        @method showHeader: is to show datagrid table header? default yes
        */
        showHeader: function() {
            var me = this;
            if (me.config.showHeader === false) {
                me.header.style.display = 'none';
            }
        },
        /**
        @method renderHeader 获取所有选中的行
        @return 表格行信息
        */
        getSelectedRows: function () {
            return CheckboxRenderer.getSelectedRows(this);
        },

        /**
        @method renderHeader 获取所有选中的行
        @return 表格行信息
        */
        initTableClass: function () {
            if(this.config.tableClass!=undefined){
                this.$table.find("table").addClass(this.config.tableClass);
            }else{
                //默认样式
                this.$table.find("table").addClass("table");
            }
            if(this.config.isRenderEmpty==undefined){
                this.config.isRenderEmpty = true;
            }
        },


        /**
        @method getReorderColumn 获取所有排序字段
        @return 表格行信息
        */
        getReorderColumn: function () {
            var result = {};
            for (var i = 0; i < this.columns.length; i++) {
                var column = this.columns[i];
                if(column["field"] && column["reorder"] &&  column["reorder"]["__className__"] && column["reorder"]["__className__"]!=""){
                    result[column["field"].name] = column["reorder"]["order"];
                }
            }

            return result;
        },

        /**
        @method collectData 获取所有行数据
        @return 表格行信息
        */
        collectData : function () {
            var result = [];
            for (var i = 0; i < this.rows.length; i++) {
                result.push(this.rows[i].getValue());
            }
            return result;
        }
    });



    /**
    @class DataRow 表格行对象
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息 {columns:[{field:{name:"栏目名称","title":"栏目显示名称","type":"数据类型"},width:"栏目宽度"}]}
    */
    var DataRow = function (data, grid) {
        this.data = data;
        this.grid = grid;

        //for edit
        this._controls = {};

        this.create();


    };

    DataRow.getEmptyRow = function (colspan,innerHTML,emptyRowRender) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        row.appendChild(cell);
        cell.setAttribute("colspan",colspan);

        if(emptyRowRender){
            emptyRowRender(cell);
        }
        else{
            cell.innerHTML='<img class="mT100 mB100 noDataImg" src="images/nodata_icon.png">';
        }
        return row;
    },

    DataRow.prototype = X.prototype.createObject(X.prototype.event);

    /**
    @method prototype 定义DataRow原型
    */
    DataRow.prototype = $.extend(DataRow.prototype,{
        /**
        @method create 构建表体行,并绑定事件
        */
        create: function () {
            var row = this.createRow();
            this.dom = row;

            this.renderRow();

            var that = this;
            row.onclick = function (event) {
                var newEvent = {
                    type: "selected",
                    target: that,
                    row: that
                };
                that.trigger(newEvent);
            }
        },

        /**
        @method create 构建表体行
        */
        createRow : function () {
            var row = document.createElement("tr");
            var column = null;
            for (var i = 0; i < this.grid.columns.length; i++) {
                column = this.grid.columns[i];

                var cell = document.createElement("td");
                if(column.className){
                    cell.className = column.className;
                }
                if(this.grid.config.editable==true){
                    this.renderEdit(cell, this.data, column.field, column, i);
                }else{
                    this.render(cell, this.data, column.field, column, i);
                }
                row.appendChild(cell);
            }
            return row;
        },

        renderRow: function () {
            if (this.grid.config.afterRowRender) {
                this.grid.config.afterRowRender(this, this.data);
            }
        },

        /**
        @method destroy 销毁表体行
        */
        destroy: function () {
            //todo: 要把渲染器也destroy
            this.dom = null;
            this.data = null;
            this.grid = null;
        },

        /**
        @method select 设置选中行
        @param flag {boolean} 设置行为选中/不选中
        */
        select: function (flag) {
            if (flag) {
                this.dom.className = "info";
            }
            else {
                this.dom.className = "";
            }
        },

        /**
        @method set 修改行数据，并更新
        @param key {string} 要设置的数据的key
        @param value {string} 要设置的数据的value
        */
        set: function (key, value) {
            this.data[key] = value;

            this.refresh(null,[key]);
        },

        /**
        @method get 获取行数据
        @return 返回行数据
        */
        get: function (key) {
            return this.data[key];
        },

        /**
        @method render 渲染行
        @param cell {domNode} 单元格对象
        @param data {Object} 要设置的数据的value
        @param field {Object} 字段信息
        @param column {Number} 栏目信息
        */
        render: function (cell, data, field, column, index) {
            var temp ="";
            cell.innerHTML ="";  //清空内容
            if(data){
                if (column.itemRenderer) {
                    if(column.itemRenderer===CheckboxRenderer){
                        temp = column.itemRenderer.render(this, field, index);
                    }
                    else{
                        temp = column.itemRenderer.render(data, field, index, this);
                    }

                    if(temp){
                        (typeof temp==="string") ? (cell.innerHTML=temp) : cell.appendChild(temp);
                    }
                }
                else if (column.titleFunction) {
                    cell.innerHTML = "";
                    cell.innerHTML = this.grid.columns[index].titleFunction(data, field);
                }
                else if (this.grid.itemRenderer) {
                    temp = this.grid.itemRenderer.render(data, field, index, this);
                    if(temp){
                        (typeof temp==="string") ? (cell.innerHTML=temp) : cell.appendChild(temp);
                    }
                }
                else if(column.dataFormater) {
                    cell.innerHTML = column.dataFormater.format(data,field);
                }
                else{
                    cell.innerHTML = DataFormater.format(data,field);
                }
            }
        },

        /**
        @method render 渲染行
        @param cell {domNode} 单元格对象
        @param data {Object} 要设置的数据的value
        @param field {Object} 字段信息
        @param column {Number} 栏目信息
        */
        renderEdit: function (cell, data, field, column, index) {
            var temp ="",formatResult="";
            cell.innerHTML ="";  //清空内容

            var ctrlType,ctrlClazz,ctrl,ctrlHtml;
            ctrlType = field["ctrlType"];
            if(ctrlType){
                ctrlClazz = X.prototype.controls.getControlClazz(ctrlType);
                if(ctrlClazz){
                    ctrlHtml = ctrlClazz.getTemplate(field);
                    ctrl = X.prototype.controls.getControl(ctrlType,$(ctrlHtml),field);

                    this._controls[field["name"]] = ctrl;
                }                                        
            }

            if (column.itemRenderer) {
                if(column.itemRenderer===CheckboxRenderer){
                    temp = column.itemRenderer.render(this, field, index);
                }
                else{
                    temp = column.itemRenderer.render(data, field, index, this);
                }

                if(temp){
                    (typeof temp==="string") ? (cell.innerHTML=temp) : cell.appendChild(temp);
                }
            }
            else if (column.titleFunction) {
                var title = this.grid.columns[index].titleFunction(data, field);
                if(ctrl){
                    ctrl.setValue(title);
                    cell.appendChild(ctrl.elem[0]);
                }
                else{
                    cell.innerHTML = title;
                }
            }
            else if (this.grid.itemRenderer) {
                temp = this.grid.itemRenderer.render(data, field, index, this);
                if(temp){
                    (typeof temp==="string") ? (cell.innerHTML=temp) : cell.appendChild(temp);
                }
            }
            else if(column.dataFormater) {
                formatResult = column.dataFormater.format(data,field);
                if(ctrl){
                     ctrl.val(formatResult);
                     cell.appendChild(ctrl.elem[0]);                
                }
                else{
                    cell.innerHTML = formatResult;
                }                
            }
            else{
                formatResult = DataFormater.format(data,field);
                if(ctrl){
                     ctrl.val(formatResult);
                     cell.appendChild(ctrl.elem[0]);                
                }
                else{
                    cell.innerHTML = formatResult;
                } 
            }
        },

        /**
        @method refresh 刷新行数据
        @param data {Array} 行数据
        */
        refresh: function (data,keys) {
            if (data) {
                this.data = data;
            }

            if(keys){
                if(keys.length==1 && keys[0]==="__checked"){
                    this.render(this.dom.childNodes[0], this.data, this.grid.columns[0].field, this.grid.columns[0], i);
                }
                else{
                    for (var i = 0; i < this.grid.columns.length; i++) {
                        var column = this.grid.columns[i];
                        if(column.field){
                            if($.inArray(column.field["name"],keys)!=-1){
                                this.render(this.dom.childNodes[i], this.data, this.grid.columns[i].field, this.grid.columns[i], i);
                            }
                        }
                    }
                }
            }
            else{
                for (var i = 0; i < this.grid.columns.length; i++) {
                    this.render(this.dom.childNodes[i], this.data, this.grid.columns[i].field, this.grid.columns[i], i);
                }
            }
        },

        /**
        @method refresh 刷新行数据
        @param data {Array} 行数据
        */
        getValue : function () {
           var result = {};
            for (var i = 0; i < this.grid.columns.length; i++) {
                var column = this.grid.columns[i];
                if(column["field"] && !(column["nodata"]==true)){
                    var fieldName = column["field"]["name"];
                    if(column.itemCollector){
                        result[fieldName] = column.itemCollector(column["field"], i, this,this.dom.childNodes[index].firstChild);
                    }
                    else{
                        var ctrl = this._controls[fieldName];
                        if(ctrl){
                            result[fieldName] = ctrl.val();    
                        }
                        else{
                            result[fieldName] = this.dom.childNodes[i].innerHTML;
                        }    
                    }                   
                }
                if(this.data && this.data[this.grid.primary]){
                    result[this.grid.primary] = this.data[this.grid.primary];
                }
            }


            return result;    
        }
    });


    var CheckboxRenderer = {
        render: function (row, field, columnIndex) {
            var grid = row.grid;
            var data = row.data;

            var div = document.createElement("div");
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = data["__checked"];

            checkbox.onclick = function () {
                data["__checked"] = !data["__checked"];

                var checkedItems = 0;

                var rowLength = grid.rows.length;
                for (var i = 0; i < rowLength; i++) {
                    if (grid.rows[i].get("__checked")) {
                        checkedItems++;
                    }
                }

                if (checkedItems === 0) {
                    grid.set("checkState", "unchecked");
                }
                else if (checkedItems === rowLength) {
                    grid.set("checkState", "checked");
                }
                else {
                    grid.set("checkState", "indeterminate");
                }
            };
            div.appendChild(checkbox);

            var span = document.createElement("span");
            span.innerHTML = data[(field && field["name"] )] || "";
            div.appendChild(span);

            return div;
        },

        getSelectedRows : function (grid) {
            var checkState = grid.get("checkState");
            if(checkState==="checked"){
                return grid.rows;
            }
            else if (checkState==="unchecked"){
                return [];
            }
            else{
                var result = [];
                for (var i = 0; i < grid.rows.length; i++) {
                    var row = grid.rows[i];
                    if(row.data["__checked"]){
                        result.push(row);
                    }
                }
                return result;
            }
        }
    };

    var HeaderRenderer = {
        render: function (grid, field, columnIndex) {
            var rows = grid.rows;
            var div = document.createElement("div");
            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            switch (grid.get("checkState")) {
                case "checked":
                {
                    checkbox.checked = true;
                    break;
                }
                case "unchecked":
                {
                    checkbox.checked = false;
                    break;
                }
                case "indeterminate":
                {
                    checkbox.indeterminate = true;
                    break;
                }
            }
            div.appendChild(checkbox);

            checkbox.onclick = function () {
                var checked = this.checked;
                for (var i = 0; i < rows.length; i++) {
                    rows[i].set("__checked", checked);
                }
            };

            var span = document.createElement("span");
            span.innerHTML = (field && field["title"]) || "";
            div.appendChild(span);

            return div;
        },

        destroy: function () {

        }
    };


    var OHeaderRenderer ={
        createReorder : function (grid,column,field,columnIndex) {
            var div = document.createElement("div");

            var $div = $(div);



            //var span = document.createElement("span");
            var title =  (field && field["title"]) || "";

            $div.append(title);




            //span.innerHTML = title;

            var reorder = column["reorder"];



            if(reorder && reorder["order"] !="no"){
                var order = reorder["order"];
                (order==="asc") ? reorder["__className__"] = "up" : reorder["__className__"] = "down";
                if(reorder["__className__"]==="up"){
                    $div.append('<span class="sort"><em class="sort_up icon-100 on"></em><em class="sort_down icon-101"></em></span>');
                }
                else if(reorder["__className__"]==="down"){
                    $div.append('<span class="sort"><em class="sort_up icon-100"></em><em class="sort_down icon-101 on"></em></span>');
                }


                $div.on("click",function () {
                    //排序
                    (order==="asc") ? column["reorder"]["order"]="desc" : column["reorder"]["order"]="asc";

                    if(grid.config["orderMode"]==1){
                        //如果只允许同时只有一列排序。
                        for (var i = 0; i < grid.columns.length; i++) {
                            if(grid.columns[i]["reorder"]){
                                grid.columns[i]["reorder"]["__className__"] = "";
                            }
                        }
                    }


                    (order==="asc") ? reorder["__className__"] = "up" : reorder["__className__"] = "down";


                    grid.renderHeader();

                    //执行排序后抛出事件
                    if(X.prototype.isFunction(grid.config.beforeReorder)){
                        grid.config.beforeReorder(grid,column,field,columnIndex);
                    }
                });
            }


            return div;
        },


        render: function (grid, column, field, columnIndex) {
            if(column["reorder"]){
                return this.createReorder(grid,column,field,columnIndex);
            }
            else{
                return field.title;
            }
        }
    };


    var DataFormater = {
        format : function (data,field){
            var result = "";
            if(field && data){
                result = data[field["name"]];
                switch(field["type"]){
                    case "string":
                        break;
                    case "date":
                        break;
                    case "currency":
                        break;
                    case "image":
                        //此处需要根据实际，从文件服务器取到数据后，回填
                        result = '<img src="'+ data[field["name"]]+'">';
                        break;
                    default:
                        break;
                }
            }
            return result;
        }
    };

    //X.controls.registerControl("DataGrid",DataGrid)


    /**
    @class SDataGrid 标准主子表对象
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息 {columns:[{field:{name:"栏目名称","title":"栏目显示名称","type":"数据类型"},width:"栏目宽度"}]}
    */
    var SDataGrid = function (element,config) {

        DataGrid.call(this,element,config);


        element.innerHTML = '<table cellspacing="0" cellpadding="0" rules="rows" border="1"><thead><tr></tr></thead></table>';

        this.header = element.firstChild.tHead;
        this.tbody = element.firstChild;

        this.initTableClass();
    };

    SDataGrid.prototype = X.prototype.createObject(DataGrid.prototype);

    $.extend(SDataGrid.prototype,{
        /**
        @method clear 清空表体行
        @param data {Array} 表体行数据
        */
        clear : function () {
            $(this.tbody).find("tbody").remove();
            if(this.rows.length>0){
                this.rows.forEach(function (item,index,rows) {
                    item.destroy();
                });
                this.rows.length = 0;
            }
        },

        getNewRow: function (data) {
            return new SDataRow(data,this);
        },

        renderEmpty: function () {
            var row = SDataRow.getEmptyRow(this.columns.length,"没有符合条件的数据",this.config["emptyRowRender"]);

            this.tbody.appendChild(row);
        }
    });


    function Expand(colspan,row) {
        this.$elem = $('<tr class="more_show_btn">'+
                                        '<td colspan="'+ colspan +'" class="">'+
                                            '<div class="more_show_conts js-more_show_conts"><span>展开</span><em class="icon-95"></em></div>'+
                                        '</td>'+
                                    '</tr>');
        this.$elem.on("click",$.proxy(function (argument) {
             this.trigger("click");
        },this));

        this.row = row;
        $(row.dom).append(this.$elem);
    }

    $.extend(Expand.prototype,{
        setTitle : function (title) {
            this.$elem.find(".js-more_show_conts").find("span").html(title);
        },
        hide : function () {
            this.$elem.hide();

        },
        show : function () {
            this.$elem.show();
        },
        changeState : function (show) {
            show ? this.$elem.find(".js-more_show_conts").find("em").addClass("icon-96") : this.$elem.find(".js-more_show_conts").find("em").removeClass("icon-96");
        }

    },X.event);


    var SDataRow = function (data,grid) {
        DataRow.call(this,data,grid);

        this.items = [];
    };

    SDataRow.getEmptyRow = function (colspan,innerHTML,emptyRowRender) {
        var row = document.createElement("tbody");

        $(row).append(DataRow.getEmptyRow(colspan,innerHTML,emptyRowRender));

        return row;
    },

    SDataRow.prototype = X.prototype.createObject(DataRow.prototype);

    $.extend(SDataRow.prototype,{
        /**
        @method create 构建表体行
        */
        create: function () {
            var row = document.createElement("tbody");

            this.dom = row;

            this.renderRow(this.data);

            var that = this;
            row.onclick = function (event) {
                var newEvent = {
                    type: "selected",
                    target: that,
                    row: that
                };
                that.trigger(newEvent);
            }
        },

        /**
        @method destroy 销毁表体行
        */
        destroy: function () {
            //todo: 要把渲染器也destroy
            this.dom = null;
            this.data = null;
            this.grid = null;
        },
        /**
        @method renderRow 渲染行
        @param cell {domNode} 单元格对象
        @param data {Object} 要设置的数据的value
        @param field {Object} 栏目信息{}
        @param index {Number} 列索引
        */
        renderRow: function (data) {

            var that = this;

            var row = $(this.dom);
            var colspan = this.grid.columns.length;


            row.html();

            //标准的主子表结构
            var tr = this.createRow(this.render);
            $(this.dom).append(tr);

            this.expand = new Expand(colspan,this);

            this.expand.on("click",function () {
                if(that.items && that.items.length>0){
                    if(that.items.is(":visible")){
                        if(X.prototype.isFunction(that.grid.config.onSlideUp)){
                           var ok = that.grid.config.onSlideUp(that.expand);
                           if(ok){
                                that.items.hide();
                                that.expand.changeState(false);
                           }
                        }
                        else{
                            that.expand.setTitle("收起");
                            that.items.hide();
                            that.expand.changeState(false);
                        }
                    }
                    else{
                        if(X.prototype.isFunction(that.grid.config.onSlideDown)){
                           var ok = that.grid.config.onSlideDown(that.expand);
                           if(ok){
                                that.items.show();
                                that.expand.changeState(true);
                           }
                        }
                        else{
                            that.expand.setTitle("展开");
                            that.items.show();
                            that.expand.changeState(true);
                        }
                    }
                }
                else{
                    if(X.prototype.isFunction(that.grid.config.beforeRowExpand)){
                        that.grid.config.beforeRowExpand(that.data,that);
                    }
                    else{
                        console.log("没有定义展开处理事件")
                    }
                    if(X.prototype.isFunction(that.grid.config.onSlideDown)){
                        that.grid.config.onSlideDown(that.expand);
                        that.expand.changeState(true);
                    }
                }
            });
            
            if (this.grid.config.afterRowRender) {
                this.grid.config.afterRowRender(this, data);
            }
        },



        /**
        @method refresh 刷新行数据
        @param data {Array} 行数据
        */
        refresh: function (data,keys) {

            if (data) {
                this.data = data;
            }

            if(keys){
                for (var i = 0; i < this.grid.columns.length; i++) {
                    var column = this.grid.columns[i];
                    if(column.field){
                        if($.inArray(column.field["name"],column.field["name"])!=-1){
                            this.render(this.dom.childNodes[0].cells[i], this.data, this.grid.columns[i].field, this.grid.columns[i], i);
                        }
                    }
                }
                if($.inArray("__checked",keys)!=-1){
                    this.render(this.dom.childNodes[0].cells[0], this.data, this.grid.columns[0].field, this.grid.columns[0], 0);
                }

            }else{
                for (var i = 0; i < this.grid.columns.length; i++) {
                    this.render(this.dom.childNodes[0].cells[i], this.data, this.grid.columns[i].field, this.grid.columns[i], i);
                }
            }
        },

        createItemRow : function (data) {
            // body...
            var row = document.createElement("tr");
            var column = null;
            for (var i = 0; i < this.grid.columns.length; i++) {
                column = this.grid.columns[i];

                var cell = document.createElement("td");
                if(column.className){
                    cell.className = column.className;
                }
                var childMap = this.grid.config.childMap;
                 if(childMap){
                    if(column["field"]){
                        var fieldMap = this.grid.config.childMap[column["field"].name];
                        if(fieldMap){
                            this.render(cell, data, fieldMap.field, fieldMap, i);
                        }
                    }
                }

                row.appendChild(cell);
            }

            return row;
        },

        /**
        @method createItems 创建子表
        @param data {Array} 行数据
        */
        createItems : function (data) {
            var result = [];
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var tr = this.createItemRow(row);
                result.push(tr);
            }

            return result;
        },

         getItems : function (url,postData,callback) {

            X.loadData({
                    url: url,
                    type: "POST",
                    data: postData,
                    callback: function (data) {
                        if (data.statusCode == "2000000") {
                            callback(data);
                        } else {
                            layer.alert(getErrorName(data.statusCode));
                        }
                    }
            });
        },

        loadItems : function (param) {
            var that = this;
            //标准的主子表结构
            if(param.items){
                that.appendItems(param,param.items);
             }
            else{
                this.getItems(param.url,param.postData,function (data) {
                    if(param.afterDataback){
                        var result = param.afterDataback(data);
                        if(result){
                            that.appendItems(param,result)
                        }
                    }
                    else{
                        that.appendItems(param,data);
                    }
                });
            }
        },

        appendItems : function (param,items) {
            var $row = $(this.dom);
            var nodeList = this.createItems(items);
            if(param.beforeItemAppend){
                 var  nodeList=  param.beforeItemAppend(items,nodeList,this);
                 if(nodeList){
                    this.items = $(nodeList);
                    this.items.insertBefore(this.expand.$elem);
                 }


            }else{
                this.items = $(nodeList);
                this.items.insertBefore(this.expand.$elem);
            }
            var after = param.afterItemAppend;
            if(X.prototype.isFunction(after)){
                after(this.items,nodeList,this);
            }
        }

    });


    //X.controls.registerControl("SDataGrid",SDataGrid);



    /**
    @class DataRow 表格行对象
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息 {columns:[{field:{name:"栏目名称","title":"栏目显示名称","type":"数据类型"},width:"栏目宽度"}]}
    */

    var TDataGrid = function (element,config) {
        this.$template = $(config.selector);

        SDataGrid.call(this,element,config);
    };

    TDataGrid.prototype = X.prototype.createObject(SDataGrid.prototype);

    $.extend(TDataGrid.prototype,{

        /**
        @method getNewRow 获取行对象
        @param data {Array} 表体行数据
        */
        getNewRow:function (data) {
            return new TDataRow(data, this);
        },

        /**
         @method loadData 构建DataGrid
         @param data {Array 二维数组} 表体数据
         */
        loadData: function (data) {

            this.clear();          
            if (data.length > 0) {
                var columnCount = this.config.columnCount;
                if(columnCount){                   
                    for (var i = 0; i < data.length; i+=columnCount) {                        
                        var dataRow = [];
                        for(var j = 0; j < columnCount; j++){
                            if(data[i+j]){
                               dataRow.push(data[i+j]); 
                            }
                        }
                        this.insertRow(dataRow);
                    } 
                }
                else{
                    for (var i = 0; i < data.length; i++) {
                        this.insertRow(data[i]);
                    }    
                }                
            }
            else {
                //没有数据时，显示
                this.renderEmpty();
            }

            this.renderHeader();

            if (X.prototype.isFunction(this.config.afterTableRender)) {
                this.config.afterTableRender(this);
            }

            var event = {
                type: "loadCompleted",
                target: this
            };
            this.trigger(event);
        }
    });


    var TDataRow = function (data,grid) {
        SDataRow.call(this,data,grid);
    };

    TDataRow.prototype = X.prototype.createObject(SDataRow.prototype);

    $.extend(TDataRow.prototype,{

        /**
        @method destroy 销毁表体行
        */
        destroy: function () {
            //todo: 要把渲染器也destroy
            this.dom = null;
            this.data = null;
            this.grid = null;
        },

        /**
        @method renderRow 渲染行
        @param cell {domNode} 单元格对象
        @param data {Object} 要设置的数据的value
        @param field {Object} 栏目信息{}
        @param index {Number} 列索引
        */
        renderRow: function (data) {

            var row = $(this.dom);
            var columnCount = this.grid.config.columnCount;
            if(columnCount){
                var rowTpl = $(this.grid.$template.html());
                var tdhtml = rowTpl.find('td').prop("outerHTML");
                var tr = $("<tr/>");
                data.forEach(function(item, index, array) {
                    tr.loadTemplate($(tdhtml),item,{append:true});
                });
                
                //tr.loadTemplate($(tdhtml),data);
                row.append(tr);
            }
            else{
                row.loadTemplate($(this.grid.$template.html()), data);    
            }

            if (this.grid.config.showCheckbox) {
                var checkbox = CheckboxRenderer.render(this)
                row.find(".check_boxs").empty().append(checkbox);
            }
            if (this.grid.config.afterRowRender) {
                this.grid.config.afterRowRender(this, data);
            }
        },

        /**
        @method refresh 刷新行数据
        @param data {Array} 行数据
        */
        refresh: function (data,keys) {
            if (data) {
                this.data = data;
            }

            if(keys && keys.length===1 && keys[0]=="__checked"){
                if(this.grid.config.showCheckbox){
                    var checkbox = CheckboxRenderer.render(this)
                    $(this.dom).find(".check_boxs").empty().append(checkbox);
                }
            }
            else{
                this.renderRow(this.data);
            }
        }




    });


    X.prototype.controls.widget("DataGrid",function (controlType) {
        return DataGrid;
    });

    X.prototype.controls.widget("SDataGrid",function (controlType) {
        return SDataGrid;
    });

    X.prototype.controls.widget("TDataGrid",function (controlType) {
        return TDataGrid;
    });

})(jQuery,this.Xbn);   