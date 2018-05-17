(function ($,X) { 

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
        this.elem = elem;
        this.option = option;
        this.init();
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
       

        this.province = X.prototype.controls.getControl("ComboBox", this.elem.find(".js-province"),{dataSource:ds,selectedChanged: function (item) {
            var key = item.key;
            var citys =[];
            $.each(addressData.city, function(index,city){
                if(city["ProID"] == key){
                    citys.push({key:city["CityID"],value:city["CityName"]})
                }
            });

            that.city.setDataSource(citys);
            that.district.setDataSource();
        }});

        this.city = X.prototype.controls.getControl("ComboBox", this.elem.find(".js-city"),{selectedChanged: function (item) {
            var key = item.key;

            var countrys =[];
            $.each(addressData.dis, function(index,district){
                if(district["CityID"] == key){
                    countrys.push({key:district["Id"],value:district["DisName"]})
                }
            });

            that.district.setDataSource(countrys);
        }});

        this.district = X.prototype.controls.getControl("ComboBox", this.elem.find(".js-district"));

        var dvProvince,dvCity,dvDistrict;
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
     @method init 获取下拉框的值
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
     @method init 设置（获取）下拉框的值
     @param value {string} 设置下拉框选中值
     */
    ComboBoxSecond.prototype.setValue = function(value){
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