(function ($,X) { 	

	X.prototype.controls.widget("DatePicker",function (controlType) {	
		var DatePicker = function (elem,options) {
			X.prototype.controls.getControlClazz("BaseControl").call(this,elem,options);
			var that = this;

			that.option = {
	                 istime: (that.options && that.options.istime) ? true : false,
	                 elem : elem.get(0),
	                 event : 'focus',
	                 min: (that.options && that.options.min) ? that.options.min : "1900-01-01 00:00:00",
	                 max: (that.options && that.options.max) ? that.options.max : '2099-06-16 23:59:59',
	                 start : (that.options && that.options.min) ? that.options.min : laydate.now(),
	                 format: (that.options && that.options.istime) ? 'YYYY-MM-DD hh:mm:ss' : 'YYYY-MM-DD',
	                 fixed : false,	                     
	                 choose:function(date){	                        
	                     if(X.prototype.isFunction(that.options.afterDateChange)){
	                         that.options.afterDateChange(that,date);
	                     }
	                 },
	                 clear: function () {
	                     if(X.prototype.isFunction(that.options.afterClearDate)){
	                         that.options.afterClearDate(that);
	                     }    
	                 }
	            }  
			if(elem){								
				elem.attr("autocomplete","off");
				elem.on("focus click",function(){
					laydate(that.option);
				});				
			}
		}

		/**
	    @method 获取文本框控件模板
	    @static 类静态方法
	    @return 获取文本框控件模板
	    */
	    DatePicker.getTemplate = function (item) {
	        return '<input type="text" class="default_input w250 fL js-'+ item["name"] +'" >';
	    };   

		X.prototype.controls.extend(DatePicker,"BaseControl");
		DatePicker.prototype.constructor = DatePicker;

		/**
		 @method init 获取文本框的值
		 */
		DatePicker.prototype.getValue = function(){
			return this.elem.val();
		};

		DatePicker.prototype.setValue = function(value){
			this.elem.attr("value",value);
		};

		/**
		 @method init 重置文本框，设置为false
		 */
		DatePicker.prototype.reset = function () {
			this.setValue();
		};
				
		DatePicker.prototype.setOption = function (option) {
			var that = this
			for (var i in option) {
				that.option[i] = option[i]
			}
		};

		return DatePicker;
	});


})(jQuery,this.Xbn);