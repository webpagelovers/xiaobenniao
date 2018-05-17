(function ($,X) { 

X.prototype.controls.widget("TextBox",function (controlType) {      
    /**
    @class TextBox 文本框
    @constructor 构造函数
    @param elem {DomNode} Dom节点
    @param option {Object} 配置信息
    */
    function TextBox(elem,options) {
        this.elem = elem;
        this.option = options;
        if(this.option){
            if(this.option.money){
                this.setMoney();
            }else if(this.option.positiveNumber){

            }
            if(this.option["maxLength"]){
                this.elem.attr("maxlength",this.option["maxLength"])
            }

        } 

    }




    /**
    @method 获取文本框控件模板
    @static 类静态方法
    @return 获取文本框控件模板
    */
    TextBox.getTemplate = function (item) {
        var input = document.createElement('input')
        input.type = 'text'
        input.className = 'default_input w250 fL js-'+ item.name
        item.maxLength? input.maxLength = item.maxLength: 1
    item.placeholder? input.placeholder = item.placeholder: ""

        var result = input.outerHTML

        if (item.positiveNumber) {
          TextBox.positiveNumber(input)
          result = input
        }

        /*for (var i in item.attrs) {
          TextBox[i]? TextBox[i](input): input[i] = item.attrs[i]
        }*/

        return result
    };


    X.prototype.controls.extend(TextBox,"BaseControl");    
    TextBox.prototype.constructor = TextBox;

    /**
    @method init 重置文本框，设置为false
    */
    TextBox.prototype.reset = function () {
        this.setValue("");
    }; 

    /*
    @method positiveNumber 设置文本框，只能正数
    */
    TextBox.positiveNumber = function (ele) {
      ele.onkeyup = function() {
          //(event.keyCode<48 || event.keyCode>57) && 
          var val = this.value
          if ( isNaN(val) || val < 0) {
              event.returnValue=false
              this.value = ''  
          } else if (/\d+.\d\d\d$/.test(val)) {
              this.value = /\d+.\d\d/.exec(val)
          }
      }

      ele.onblur = function() {
         if (this.value == 0) {
            this.value = ''
         }
      }
    }

    /*
    @method setMoney 设置文本框，只能输入金额
    */
    TextBox.prototype.setMoney = function () {
        //千分位处理函数 
        var departNum = function(textVal,the_other){
            var the_array = [];
            var i = 0;
            the_array.push(textVal.slice(textVal.length-2,textVal.length));
            for(i=textVal.length-5;i>=0;i-=3){
               the_array.push(textVal.slice(i,i+3));
            }
            if(0-i<3){the_array.push(textVal.slice(0,3+i));}
            for(var k=the_array.length-1;k>=0;k--){
                   the_other.push(the_array[k]);
            }
        }
        //输入限制
        this.elem.keypress(function(event){
            var current = $(this).val();
            if(event.keyCode&&(event.keyCode<45||(event.keyCode>45&&event.keyCode<48)||event.keyCode>57)){
                if(event.keyCode == 46&&!/\./.test(current)){
                   if(!isNaN(parseInt($(this).val().replace(/,/,"")))){
                       $(this).val(current+".");  
                   }else{
                       $(this).val($(this).val()+"0.");
                   }
                }
                event.preventDefault();
           }else{
             if(event.keyCode == 45&&/-/.test(current)){event.preventDefault();}
             else if(event.keyCode != 45){
               if(!/\./.test(current)){
                var the_new = $(this).val().replace(/,/g,"");
                var theArray = [];
                var theFlag = "";
                if(/-/.test(current)){theFlag = the_new.slice(0,1);the_new = the_new.slice(1);}
                if(parseInt(the_new) >= 100){
                  departNum(the_new,theArray);
                  $(this).val(theFlag+theArray.join(","));
                }
               }
             }
           }
         })
        .keyup(function(event){
           var the_Real = $(this).val();
           if(event.keyCode == 109&&$(this).val().slice(0,1) != "-"){
              the_Real = the_Real.replace(/-/,"");
              $(this).val(the_Real);              
           }
           $(this).val(the_Real.replace(/[^\w\.\/]/ig,''));              
         })
        .blur(function(){
            var the_Val = $(this).val().replace(/,/g,"");
            if(!isNaN(parseFloat(the_Val))){
            if(!/\./.test(the_Val)){
              var theArray = [];
              var theFlag = "";
              var the_one = the_Val.slice(-1);
              var the_new = the_Val.replace(/\d$/,"");
              if(/-/.test(the_Val)){theFlag = the_new.slice(0,1);the_new = the_new.slice(1);}
              if(parseInt(the_new) >= 100){
                departNum(the_new,theArray);
                $(this).val(theFlag+theArray.join(",")+the_one+".00");
              }
              else{
                $(this).val(the_Val+".00");
              }
            }
            else{
              var theArray = [];
              var theFlag = "";
              var the_now = parseFloat(the_Val).toFixed(2);
              var the_nowStr = String(the_now).slice(-4);
              var the_new = String(the_now).replace(/\d\.\d\d/,"");
              if(/-/.test(the_Val)){theFlag = the_new.slice(0,1);the_new = the_new.slice(1);}
              if(parseInt(the_new) >= 100){
                departNum(the_new,theArray);
                $(this).val(theFlag+theArray.join(",")+the_nowStr);
              }
              else{
                $(this).val(String(the_now));
              }
            }
           }
         });
    }

    TextBox.prototype.getValue = function () {
        if(this.option && this.option.money){
            return this.elem.val().replace(",","");
        }
        else{
            return this.elem.val();
        }
        
    }

    return TextBox;
});


})(jQuery,this.Xbn);