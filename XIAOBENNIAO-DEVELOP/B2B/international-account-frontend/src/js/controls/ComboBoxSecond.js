(function ($,X) { 
/**
 * 这个只针对地址的, 默认三级
 */

X.prototype.controls.widget("ComboBoxSecond",function (controlType) {

    var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

    /**
     @class ComboBox 下拉框
     @constructor 构造函数
     @param elem {DomNode} Dom节点
     @param option {Object} 配置信息
     */
    function ComboBoxSecond(elem,option){
        BaseControl.call(this,elem,option);
        this.elem    = elem;
        this.option  = option;
        this.hasHtml = this.elem.html() === ''
        
        this.props()
        this.hasHtml && this.loadTemplate()
        this.init()
    }


    X.prototype.controls.extend(ComboBoxSecond,BaseControl);


    /**
     @method init 初始化下拉框
     @param field {Object} 下拉数据源配置，数据从服务器获取
     @param callback {function} 回调函数，初始化完成后调用
     */
    ComboBoxSecond.prototype.init = function() {
        var that = this;
        var ds =[];
        var getDataSource = function (source,target,id,name) {
            $.each(source,function(index,item){
                target.push({key:item[id],value:item[name]});
            });
        };

        var addressData = this.option.dataSource;
        if(addressData){
            getDataSource(addressData["pro"],ds,"ProID","ProName");
        }        
       

        this.province = X.prototype.controls.getControl("ComboBox", this.subComboBox.eq(0),{dataSource:ds,selectedChanged: function (item) {
            var key = item.key;
            var citys =[];
            $.each(addressData.city, function(index,city){
                if(city["ProID"] == key){
                    citys.push({key:city["CityID"],value:city["CityName"]})
                }
            });

            that.city.setDataSource(citys);
            that.district.setDataSource();
            if(that.options.provinceSelectedChanged){
                that.options.provinceSelectedChanged.call(that, {text:that.province.selectItem.value,key:that.province.selectItem.key});
            }
        }});

        this.city = X.prototype.controls.getControl("ComboBox", this.subComboBox.eq(1),{selectedChanged: function (item) {
            var key = item.key;

            var countrys =[];
            $.each(addressData.dis, function(index,district){
                if(district["CityID"] == key){
                    countrys.push({key:district["Id"],value:district["DisName"]})
                }
            });

            that.district.setDataSource(countrys);
            if(that.options.citySelectedChanged){
                that.options.citySelectedChanged.call(that, {text:that.city.selectItem.value,key:that.city.selectItem.key});
            }
        }});

        this.district = X.prototype.controls.getControl("ComboBox", this.subComboBox.eq(2),{selectedChanged:function (item) {
            if(that.options.districtSelectedChanged){
                that.options.districtSelectedChanged.call(that,{text:that.district.selectItem.value,key:that.district.selectItem.key});
            }
        }});

        var dvProvince,dvCity,dvDistrict
        if(this.option.defaultValue){
            dvProvince = this.option.defaultValue.province;
            dvCity = this.option.defaultValue.city;
            dvDistrict = this.option.defaultValue.district;
            this.province.setValue(dvProvince);
            this.city.setValue(dvCity);
            this.district.setValue(dvDistrict);
        }


    };

    /**
     @method props 获取属性
     @param value {string} 获取属性
     */
    ComboBoxSecond.prototype.props = function(){
        this.level = this.option.level || 3
        this.name  = this.elem.attr('data-property-name') || this.elem.attr('name')
        this.clazz = this.elem.attr('subClazz')

        this.subComboBox = this.elem.children('.wrapper-dropdown')
    };

    /**
     @method loadTemplate 添加html
     @param value {string} 添加html
     */
    ComboBoxSecond.prototype.loadTemplate = function(){
        var html = '<div class="wrapper-dropdown selected '+ this.clazz +'" data-property-name="{{name}}"></div>'

        var i = 0, nHtml = ''
        while (i < this.level) {
            nHtml += html.replace('{{name}}', this.name + i++)
        }

        this.elem.html(nHtml)
        
        this.subComboBox = this.elem.children()
    };

    /**
     @method getValue 获取下拉框的值
     @param value {string} 获取下拉框选中值
     */
    ComboBoxSecond.prototype.getValue = function(){
        return  {
            province:this.province.val(),
            city: this.city.val(),
            district :this.district.val()
        }
    };

    /**
     @method setValue 设置（获取）下拉框的值
     @param value {string} 设置下拉框选中值
     */
    ComboBoxSecond.prototype.setValue = function(value){
        if (!value) return
        var province = value["province"];
        var city = value["city"];
        var district = value["district"];

        if(province){
            this.province.setValue(province);
        }
        if(city){
            this.city.setValue(city);
        }
        if(district){
            this.district.setValue(district);
        }
    };

    return ComboBoxSecond;

});

})(jQuery,this.Xbn);