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