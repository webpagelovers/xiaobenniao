var validate = {
    //规则正则集合
    regulars: {
        stringAllowSpaceNLine: { reg: /^[a-zA-Z0-9-\s]+$/, text: '只能包含空格、字母、数字、英文横杠' },
        number: { reg: /^[0-9]+$/, text: '只能为正整数' },
        numberLargerThanZero: { reg: /^\+?[1-9]\d*$/, text: '只能为大于0的正整数' },
        float: { reg: /^[0-9]+\.{0,1}[0-9]{0,9}$/, text: '请输入正确的数字' },
        price: { reg: /^[0-9]+\.{0,1}[0-9]{0,2}$/, text: '请输入正确的价格' },
    },
    regular(regular,value,source,trigger){
        trigger = trigger || 'blur';
        return {
            type: "string",
            pattern: regular,
            message: source,
            trigger: trigger
        }
    },
    rule(rule, value, callback, source, options){
        
    },
    test: function (rule, value, callback, source, options) {
        callback(new Error("提示"));
    },
    number:function (rule, value, callback, source, options) {
        debugger
        // max 最大
        var max = rule.max;
        // min 最小
        var min = rule.min;
        // integerLength 
        var integerLength = rule.integerLength;
        // decimalLength 小数长度
        var decimalLength = rule.decimalLength;
        // fixed   小数后保留（补全）
        var fixed = rule.fixed;
        // isEmpty 允许为空
        var isEmpty = rule.rule || false;
        // event  //当前元素 
        var event = rule.event 
        //判断是否为空
        if(value ==='' && isEmpty){
            callback(new Error("不能为空"));
        }
        var val = parseFloat(value);
        if(val == NaN){
            callback(new Error("只能为数字"));
        }
        //判断最大值
        if(max !== undefined){
            if(val>max){
                callback(new Error('大于最大值 '+ max));
                return;
            }
        }
        //判断最小值
        if(min !== undefined){
            if(val<min){
                callback(new Error('小于最小值 '+ min));
                return;
            }
        }
        //整数位长度
        if(integerLength !== undefined){
            if(val >= Math.pow(10,integerLength) || val <= (0 - Math.pow(10,integerLength))){
                callback(new Error('整数位长度不能超过 ' + integerLength));
                return;
            }
        }
        //小数位长度
        if(decimalLength !== undefined){
            let v = val.toString();
            if(v.indexOf('.') > -1 && v.split('.')[1].length >decimalLength){
                callback(new Error('小数位长度不能超过 ' + decimalLength));
                return;
            }
        }
        //四舍五入或者补全
        if(event !== undefined && fixed !== undefined){
            let v = val.toFixed(fixed);
            event.value = v;
            callback();
            return;
        }
        callback();
    },
    //只能包含空格、字母、数字、英文横杠
    get stringAllowSpaceNLine() {
        return {
            type: "string",
            pattern: this.regulars.stringAllowSpaceNLine.reg,
            message: this.regulars.stringAllowSpaceNLine.text,
            trigger: 'blur,change'
        }
    },
    //只能为大于0的正整数
    get numberLargerThanZero() {
        return {
            type: "string",
            pattern: this.regulars.numberLargerThanZero.reg,
            message: this.regulars.numberLargerThanZero.text,
            trigger: 'blur,change'
        }
    },
    //float
    get float(){
        return {
            type: "string",
            pattern: this.regulars.float.reg,
            message: this.regulars.float.text,
            trigger: 'blur,change'
        }
    },
    /**
     * 价格
     * @
     */
    get price(){
        return {
            type: "string",
            pattern: this.regulars.float.reg,
            message: this.regulars.price.text,
            trigger: 'blur,change'
        };
    }
}
export default validate;