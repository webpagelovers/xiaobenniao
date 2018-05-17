
// 路由到
function routeTo(url) {
    this.$router.push(url);
}
function goBack() {
    this.$router.go(-1);
}
function deepCopy(obj) {
    let tempObj = Object.assign({}, obj);
    function deep(object) {
        for (let name in object) {
            if (Object.prototype.toString.call(object[name]).indexOf('[object Object]') > -1) {
                // 对象类型
                if (Object.keys(object[name]).length === 1) {
                    // 只有一个属性
                    for (let one in object[name]) {
                        let oldObj = object[name];
                        object[name] = {};
                        object[name][one] = oldObj[one];
                        deep(object[name]);
                    }
                } else {
                    // 多个属性
                    object[name] = Object.assign({}, object[name]);
                    deep(object[name]);
                }
            }
            if (Object.prototype.toString.call(object[name]).indexOf('[object Array]') > -1) {
                // 数组类型
                let oldObj = object[name];
                object[name] = [];
                for (let one in oldObj) {
                    object[name][one] = oldObj[one];
                    deep(object[name]);
                }
            }

        }
    }
    deep(tempObj);
    return tempObj;
}


//格式化金额
function outputmoney(number) {
    number = String(number).replace(/\,/g, "");

    if(isNaN(number) || number == ""){
        return "";
    }

    number = Math.round(number * 100) / 100;

    /*if (number < 0){
        return '-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0);
    }else{
        return '+' + this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0);
    }*/

    return outputdollars(Math.floor(number - 0) + '') + outputcents(number - 0);
}
function outputdollars(number) {
    if (number.length <= 3){
        return (number == '' ? '0' : number);
    }else {
        let mod = number.length % 3;
        let output = (mod == 0 ? '' : (number.substring(0, mod)));
        for (let i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0))
                output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
                output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    }
}
function outputcents(amount) {
    amount = Math.round(((amount) - Math.floor(amount)) * 100);
    return (amount < 10 ? '.0' + amount : '.' + amount);
}

//截取秒
function spliceDateFun(data){
    let date = "";
    let dateMatch = /^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/;
    if (data && data.match(dateMatch)) {
        date = data.match(/^\d{4}(\-\d{2}){2}\s+\d{2}\:\d{2}/)[0];
    } else {
        date = "";
    }
    return date;
}


export default {
    methods: {
        deepCopy,
        routeTo,
        goBack,
        spliceDateFun,
    },
}
