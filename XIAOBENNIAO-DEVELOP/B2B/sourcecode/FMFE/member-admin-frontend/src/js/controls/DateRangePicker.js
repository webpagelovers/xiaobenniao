/*dateRangePicker begin*/

(function ($,X) { 

  var $, Calendar, DAYS, DateRangePicker, MONTHS, TEMPLATE;

    $ = jQuery;

    //DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    DAYS = ['日', '一', '二', '三', '四', '五', '六'];

    //MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

    TEMPLATE = "<div class=\"drp-popup\">\n  <div class=\"drp-timeline none\">\n    <ul class=\"drp-timeline-presets none\"></ul>\n    <div class=\"drp-timeline-bar none\"></div>\n  </div>\n  <div class=\"drp-calendars\">\n    <div class=\"drp-calendar drp-calendar-start\">\n     <div class=\"drp-month-picker\">\n    <div class='tac'>开始时间</div>    <div class=\"drp-arrow disib ml10\"><</div>\n        <div class=\"drp-month-title disib\"></div>\n        <div class=\"drp-arrow drp-arrow-right disib\">></div>\n      </div>\n      <ul class=\"drp-day-headers\"></ul>\n      <ul class=\"drp-days\"></ul>\n      <div class=\"drp-calendar-date\"></div>\n   <div class=\"mask\"></div>\n   </div>\n    <div class=\"drp-calendar-separator\"></div>\n    <div class=\"drp-calendar drp-calendar-end\">\n     <div class=\"drp-month-picker\">\n    <div class='tac'>结束时间</div>    <div class=\"drp-arrow disib ml10\"><</div>\n        <div class=\"drp-month-title disib\"></div>\n        <div class=\"drp-arrow drp-arrow-right disib\">></div>\n      </div>\n      <ul class=\"drp-day-headers\"></ul>\n      <ul class=\"drp-days\"></ul>\n      <div class=\"drp-calendar-date\"></div>\n  <div class=\"mask\"></div>\n   </div>\n  </div>\n  <div class=\"drp-tip\"></div>\n<div class=\"drp-calendar-btn\"><a class=\"clear\">清除</a><div><a class=\"ok\">确定</a><a  class=\"js-cancel\">取消</a></div></div></div>";

    var CustomerDate = {
           "Range" : 0,
           "Start" : 1,
           "End" : 2,
           "Week" : 3,
           "Month" : 4,
           "Season" : 5,
           "Year" : 6
    }


    DateRangePicker = (function() {       

      var Position = {
          "Left" : 0,
          "Right" : 1
      }    

      function DateRangePicker($select,options) {   
        this.$select = $select;
        this.$dateRangePicker = $(TEMPLATE);
        this.$dateRangePicker.hide();
        this.$select.attr('tabindex', '-1').before(this.$dateRangePicker);
        this.$ok = this.$dateRangePicker.find(".ok");
        this.$cancel = this.$dateRangePicker.find(".js-cancel");
        this.$clear = this.$dateRangePicker.find(".clear");

        this.initOptions(options);
        this.isHidden = true;      
        this.initBindings();
        this.setRange(this.$select.val());

        //箭头
        this.$arrow = this.$dateRangePicker.find(".drp-tip");       
      }
      
      DateRangePicker.prototype.initOptions = function (options) {
        var defaultOptions = {
          showTimeline : true,
          separator : "-",
          onOk : null,
          position: Position.Left
        }  

        this.options = $.extend(defaultOptions,options);

        (this.options["showTimeline"]==true) ? this.$dateRangePicker.find(".drp-timeline").show(): this.$dateRangePicker.find(".drp-timeline").hide();

        var innerOp =  this.options.dataSource || [];
        if($.isArray(innerOp)){
           innerOp.unshift({"value" : "","text":"--请选择--","selected":"selected" },{"value" : "","text":"范围"},{"value" : "","text":"起始"},{"value" : "","text":"终止"})

           var optionHTML = "";
           for (var i = 0,len = innerOp.length ; i < len; i++) {
             var item = innerOp[i];
             if(item.selected){
                optionHTML += "<option value='"+ item.value  +"' selected>"+item.text+"</option>";
             }
             else{
                 optionHTML += "<option value='"+ item.value  +"'>"+item.text+"</option>";
             }
           }
           this.$select.append(optionHTML);  
        }          
      }

      DateRangePicker.prototype.initBindings = function() {
        var self;
        self = this;

        var setValue = function (index) {
           var presetIndex = index || self.$dateRangePicker.find('.drp-timeline-presets li.drp-selected').index();
           return self.showCustomDate(presetIndex);        
        }

        this.$ok.on("click",function (argument) {
           if(setValue()){
             self.hide();
             if(self.options.onOk){
               self.options.onOk(self,self.value());
             }
           }
        });
        this.$cancel.on("click",function (argument) {
           self.hide();
        });

        this.$clear.on("click",function (argument) {
           self.$select[0].selectedIndex = 0;
           self.hide();
        });

        this.$select.on('focus mousedown', function(e) {
          var $select;
          $select = this;
          setTimeout(function() {
            return $select.blur();
          }, 0);
          return false;
        });
        this.$dateRangePicker.click(function(evt) {
          return evt.stopPropagation();
        });
        $('body').click(function(evt) {
          if (evt.target === self.$select[0] && self.isHidden) {
            return self.show();
          } else if (!self.isHidden) {
            return self.hide();
          }
        });
        /*时间线*/
        (function () {
            var avwidth = Math.floor((self.$dateRangePicker.find(".drp-calendars").width()-10)/self.$select.children().length) ;
            var width = avwidth + "px";
            var left = avwidth/2 - 6 + "px";
            
            self.$select.children().each(function(index,element) {
              if(index!=0){              
                self.$dateRangePicker.find('.drp-timeline-presets').append($("<li style='width:"+ width +"' class='" + (((index==CustomerDate.Range+1) && 'drp-selected') || '') + "'>" + ($(this).text()) + "<div style='left:"+left+"' class='drp-button'></div></li>"));
              }
            }); 
          
        })();

        
        this.$dateRangePicker.find('.drp-timeline-presets li').click(function(evt) {        
          $(this).addClass('drp-selected').siblings().removeClass('drp-selected');   
          
          var presetIndex = $(this).index();
          if(presetIndex==CustomerDate.Start){
            self.startCalendar.Disabled(false);
            self.endCalendar.Disabled(true);                
          }else if(presetIndex==CustomerDate.End) {
            self.startCalendar.Disabled(true);
            self.endCalendar.Disabled(false);                                    
          }
          else{
            //选择了范围，周，月，季，年
            self.startCalendar.Disabled(false);
            self.endCalendar.Disabled(false);            
          }
          self.customerIndex = presetIndex;
          var cd = self.getCustomDate(presetIndex);
          self.setRange(cd.value);
          self.draw();                       
        });
      };

      DateRangePicker.prototype.hide = function() {
        this.isHidden = true;
        return this.$dateRangePicker.hide();
      };


      DateRangePicker.prototype.orien = function(obj, offsetWidth, offsetHeight, pos){
          var tops, rect = this.$select[0].getBoundingClientRect();

          // 判断位置是否超过window的宽度
          if((rect.left + offsetWidth)>document.body.offsetWidth){
              obj.style.left = rect.right- offsetWidth + 'px';
          }else{
              obj.style.left = rect.left + (pos ? 0 : DateRangePicker.scroll(1)) + 'px';
          }

          if(rect.bottom + offsetHeight/1.5 <= DateRangePicker.winarea()){
              tops = rect.bottom - 1;
          } else {
              tops = rect.top > offsetHeight/1.5 ? rect.top - offsetHeight+ 1 : DateRangePicker.winarea() - obj.offsetHeight;
          }
          obj.style.top = tops + (pos ? 0 : DateRangePicker.scroll()) + 'px';
      };

      DateRangePicker.scroll = function(type){
          type = type ? 'scrollLeft' : 'scrollTop';
          return document.body[type] | document.documentElement[type];
      };

      DateRangePicker.winarea = function(type){
          return document.documentElement[type ? 'clientWidth' : 'clientHeight']
      };

      DateRangePicker.prototype.setPosition = function () {

          var that = this;
          var offset = 30;

          var outerWidth = this.$dateRangePicker.outerWidth();          


          var sp , ap ;

          var pos = this.options.position;       

          var setRightPosition = function () {
              sp = { left : that.$select.width() - outerWidth };
              ap = { left : outerWidth - (44 + offset) };  // 44 = padding(8)*2 + 自身width(28) + 偏移量 20
          }

          if(pos == Position.Right){
              setRightPosition();
              this.$dateRangePicker.css(sp)
              this.$arrow.css(ap); 
          }  
      };

      DateRangePicker.prototype.show = function() {
        this.isHidden = false;
        this.setPosition();
        
      
        return this.$dateRangePicker.show();
      };

      DateRangePicker.prototype.setCustomDate = function() {
         if(this.$dateRangePicker.find('.drp-timeline-presets li:nth('+CustomerDate.Start+')').hasClass("drp-selected") || 
            this.$dateRangePicker.find('.drp-timeline-presets li:nth('+CustomerDate.End+')').hasClass("drp-selected")){
           return;     
        }
        return this.$dateRangePicker.find('.drp-timeline-presets li:nth('+CustomerDate.Range+')').addClass('drp-selected').siblings().removeClass('drp-selected');  
      }

      DateRangePicker.prototype.getCustomDate = function(presetIndex){
        var text,sd,ed,value;                  
        switch(presetIndex){
          case CustomerDate.Range: 
            sd = this.formatDate(this.startDate());
            ed = this.formatDate(this.endDate());         
            break;
          case CustomerDate.Start:
            sd = this.formatDate(this.startDate());
            ed="";
            break;
          case CustomerDate.End:
            sd = "";
            ed = this.formatDate(this.endDate());         
            break;
          case CustomerDate.Week:
            sd = new Date(); ed = new Date();
            sd.setDate(sd.getDate()-7)
            sd = this.formatDate(sd);
            ed = this.formatDate(ed);
            break;
          case CustomerDate.Month:
            sd = new Date(); ed = new Date();
            sd.setMonth(sd.getMonth()-1);
            sd = this.formatDate(sd);
            ed = this.formatDate(ed);
            break;
          case CustomerDate.Season:
            sd = new Date(); ed = new Date();
            sd.setMonth(sd.getMonth()-3);
            sd = this.formatDate(sd);
            ed = this.formatDate(ed);
            break;
          case CustomerDate.Year:
            sd = new Date(); ed = new Date();
            sd.setFullYear(sd.getFullYear()-1);
            sd = this.formatDate(sd);
            ed = this.formatDate(ed);
            break;
        }
        text = sd + ' 至 ' + ed;
        value = sd + "@" + ed;
        return {text:text,value:value};
      };


      DateRangePicker.prototype.showCustomDate = function(presetIndex) {
        var text,value,cd;
        this.$dateRangePicker.find('.drp-timeline-presets li:nth('+ presetIndex +')').addClass('drp-selected').siblings().removeClass('drp-selected');
        cd = this.getCustomDate(presetIndex);      
        text = cd.text;
        value = cd.value;

        if(value.indexOf("&")!=-1){
            return false;
        }

        var opIndex = presetIndex + 1;

        this.$select.find('option:nth('+ opIndex +')').attr("value",value)
        this.$select.find('option:nth('+ opIndex +')').text(text);        
        this.$select[0].selectedIndex = opIndex


        this.setRange(this.$select.val());

        return true;
      };

      DateRangePicker.prototype.value = function (value) {
            if(value!=undefined){
                  var option = this.$select.find("[value='"+value+"']");
                  if(option.length>0){
                        option.siblings().removeAttr("selected");
                        option.attr("selected","selected");
                  }
                  else{
                        var range = value.split("@");
                        var text = range[0] + "至" + range[1];
                        this.$select.append("<option selected value='"+value+"'>"+text +"</option>")
                  }
                  this.setRange(this.$select.val());
            }
            else{
                return this.$select.val()=="" ? null : this.$select.val();
            }          
      };

      DateRangePicker.prototype.formatDate = function(d) {
        var padding = function function_name(num) {
            if(num<10){
              return "0" + num;
            }
            return num + "";
        }
        if(Date.parse(d)){
            var separator = this.options.separator;
            return (d.getFullYear().toString()) + separator + padding((d.getMonth() + 1)) + separator + padding(d.getDate());
        }
        else{
            return "&";
        }
      };

      DateRangePicker.prototype.toDate = function(d) {      
        var separator = this.options.separator;
        var temp =  d.split(separator);

        return new Date(temp[0],temp[1],temp[2]);
      };

      DateRangePicker.prototype.setRange = function(daysAgo) {
        var endDate, startDate;        

        if(daysAgo.indexOf(this.options.separator)!=-1){
           var temp = daysAgo.split("@");
           startDate = this.toDate(temp[0]);
           endDate = this.toDate(temp[1]);
        }
        else{
          if (isNaN(daysAgo)) {
            return false;
          }   
          daysAgo = (daysAgo.length===0)? 0 : daysAgo -= 1;      
          endDate = new Date();
          startDate = new Date();
          startDate.setDate(endDate.getDate() - daysAgo);  
        }

        
        if(this.startCalendar==undefined){
          this.startCalendar = new Calendar(this, this.$dateRangePicker.find('.drp-calendar:first-child'), startDate, true);
        }
        else{
          this.startCalendar.setDate(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
        }
        if(this.endCalendar==undefined){
          this.endCalendar = new Calendar(this, this.$dateRangePicker.find('.drp-calendar:last-child'), endDate, false);
        }
        else{
          this.endCalendar.setDate(endDate.getFullYear(),endDate.getMonth(),endDate.getDate()); 
        }
        
        return this.draw();
      };

      DateRangePicker.prototype.endDate = function() {
        return this.endCalendar.date;
      };

      DateRangePicker.prototype.startDate = function() {
        return this.startCalendar.date;
      };

      DateRangePicker.prototype.draw = function() {
        this.startCalendar.draw();
        return this.endCalendar.draw();
      };

      DateRangePicker.prototype.CustomerDate = function () {
         return this.customerIndex || 0;
      }

      DateRangePicker.prototype.reset = function () {
          this.$select[0].selectedIndex = 0;
          this.hide();
      }
      return DateRangePicker;

    })();

    Calendar = (function() {
      function Calendar(dateRangePicker, $calendar, date, isStartCalendar) {
        var self;
        this.dateRangePicker = dateRangePicker;
        this.$calendar = $calendar;
        this.date = date;
        this.isStartCalendar = isStartCalendar;
        self = this;
        this.date.setHours(0, 0, 0, 0);
        this._visibleMonth = this.month();
        this._visibleYear = this.year();
        this.$title = this.$calendar.find('.drp-month-title');
        this.$dayHeaders = this.$calendar.find('.drp-day-headers');
        this.$days = this.$calendar.find('.drp-days');
        this.$dateDisplay = this.$calendar.find('.drp-calendar-date');
        $calendar.find('.drp-arrow').click(function(evt) {
          if ($(this).hasClass('drp-arrow-right')) {
            self.showNextMonth();
          } else {
            self.showPreviousMonth();
          }
          return false;
        });
      }

      Calendar.prototype.showPreviousMonth = function() {
        if (this._visibleMonth === 1) {
          this._visibleMonth = 12;
          this._visibleYear -= 1;
        } else {
          this._visibleMonth -= 1;
        }
        return this.draw();
      };

      Calendar.prototype.showNextMonth = function() {
        if (this._visibleMonth === 12) {
          this._visibleMonth = 1;
          this._visibleYear += 1;
        } else {
          this._visibleMonth += 1;
        }
        return this.draw();
      };

      Calendar.prototype.setDay = function(day) {
        this.setDate(this.visibleYear(), this.visibleMonth(), day);      
        return this.dateRangePicker.setCustomDate();
      };

      Calendar.prototype.setDate = function(year, month, day) {
        this.date = new Date(year, month - 1, day);
        return this.dateRangePicker.draw();
      };

      Calendar.prototype.draw = function() {
        var day, _i, _len;
        this.$dayHeaders.empty();
        this.$title.text("" + (this.visibleYear()) + "年" + (this.nameOfMonth(this.visibleMonth())) + " " );
        for (_i = 0, _len = DAYS.length; _i < _len; _i++) {
          day = DAYS[_i];
          this.$dayHeaders.append($("<li>" + (day.substr(0, 2)) + "</li>"));
        }
        this.drawDateDisplay();
        return this.drawDays();
      };

      Calendar.prototype.dateIsSelected = function(date) {
        return date.getTime() === this.date.getTime();
      };

      Calendar.prototype.dateIsInRange = function(date) {
        return date >= this.dateRangePicker.startDate() && date <= this.dateRangePicker.endDate();
      };

      Calendar.prototype.dayClass = function(day, firstDayOfMonth, lastDayOfMonth) {
        var classes, date;
        date = new Date(this.visibleYear(), this.visibleMonth() - 1, day);
        classes = '';
        switch(this.dateRangePicker.CustomerDate()){        
          case CustomerDate.Start:
            if (this.dateIsSelected(date)) {
              classes = 'drp-day-selected';
            }else if(date > this.dateRangePicker.startDate()){
              classes += 'drp-day-in-range';
            }
          break;
          case CustomerDate.End:
            if (this.dateIsSelected(date)) {
              classes = 'drp-day-selected';
            }else if(date < this.dateRangePicker.endDate()){
              classes += 'drp-day-in-range';
            }
          break;
          default:
            if (this.dateIsSelected(date)) {
              classes = 'drp-day-selected';
            } else if (this.dateIsInRange(date)) {
              classes = 'drp-day-in-range';
              if (date.getTime() === this.dateRangePicker.endDate().getTime()) {
                classes += ' drp-day-last-in-range';
              }
            } else if (this.isStartCalendar) {
              if (date > this.dateRangePicker.endDate()) {
                classes += ' drp-day-disabled';
              }
            } else if (date < this.dateRangePicker.startDate()) {
              classes += ' drp-day-disabled';
            }          
          break;
        }

        if ((day + firstDayOfMonth - 1) % 7 === 0 || day === lastDayOfMonth) {
              classes += ' drp-day-last-in-row';
        }

        
        return classes;
      };

      Calendar.prototype.drawDays = function() {
        var firstDayOfMonth, i, lastDayOfMonth, self, _i, _j, _ref;
        self = this;
        this.$days.empty();
        firstDayOfMonth = this.firstDayOfMonth(this.visibleMonth(), this.visibleYear());
        lastDayOfMonth = this.daysInMonth(this.visibleMonth(), this.visibleYear());
        for (i = _i = 1, _ref = firstDayOfMonth - 1; _i <= _ref; i = _i += 1) {
          this.$days.append($("<li class='drp-day drp-day-empty'></li>"));
        }
        for (i = _j = 1; _j <= lastDayOfMonth; i = _j += 1) {
          this.$days.append($("<li class='drp-day " + (this.dayClass(i, firstDayOfMonth, lastDayOfMonth)) + "'>" + i + "</li>"));
        }
        return this.$calendar.find('.drp-day').click(function(evt) {
          var day;
          if ($(this).hasClass('drp-day-disabled')) {
            return false;
          }
          day = parseInt($(this).text(), 10);
          if (isNaN(day)) {
            return false;
          }
          return self.setDay(day);
        });
      };

      Calendar.prototype.drawDateDisplay = function() {      
        return this.$dateDisplay.text([this.year(),this.month(), this.day()].join(this.dateRangePicker.options.separator));
        //return this.$dateDisplay.text([this.month(), this.day(), this.year()].join('/'));
      };

      Calendar.prototype.month = function() {
        return this.date.getMonth() + 1;
      };

      Calendar.prototype.day = function() {
        return this.date.getDate();
      };

      Calendar.prototype.dayOfWeek = function() {
        return this.date.getDay() + 1;
      };

      Calendar.prototype.year = function() {
        return this.date.getFullYear();
      };

      Calendar.prototype.visibleMonth = function() {
        return this._visibleMonth;
      };

      Calendar.prototype.visibleYear = function() {
        return this._visibleYear;
      };

      Calendar.prototype.nameOfMonth = function(month) {
        return MONTHS[month - 1];
      };

      Calendar.prototype.firstDayOfMonth = function(month, year) {
        return new Date(year, month - 1, 1).getDay() + 1;
      };

      Calendar.prototype.daysInMonth = function(month, year) {
        month || (month = this.visibleMonth());
        year || (year = this.visibleYear());
        return new Date(year, month, 0).getDate();
      };

      Calendar.prototype.Disabled = function (disable) {
        if(disable){
          this.$calendar.find(".mask").show();
        }
        else{
          this.$calendar.find(".mask").hide();
        }
      };

      return Calendar;

    })();


    X.prototype.controls.widget("DateRangePicker",function (controlType) {    
        var DateRangePickerWrap = function (elem,options) {
            X.prototype.controls.getControlClazz("BaseControl").call(this,elem,options);
            this.dateRangePicker = new DateRangePicker(elem,options);
        };     

        
        X.prototype.controls.extend(DateRangePickerWrap,"BaseControl");

        DateRangePickerWrap.prototype.val = function (value) {
            return this.dateRangePicker.value(value);                   
        };

      /**
       @method 获取日期区间控件模板
       @static 类静态方法
       @return 获取日期区间控件模板
       */
      DateRangePickerWrap.getTemplate = function (item) {
          return '<div style="position:relative"><select style="width:185px" type="text" placeholder="'+ (item["placeholder"] || "") +'" class="default_input w210 fL js-'+ item["name"] +'" />';
      };


      /**
      @method init 重置下拉框，设置为-1
      */
      DateRangePickerWrap.prototype.reset = function () {
          this.dateRangePicker.reset();
      };
      return DateRangePickerWrap;

    });     

  

})(jQuery,this.Xbn);

/*dateRangePicker ENd*/