
import merge from 'deepmerge';
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

// 初始化
async function initBaseDictionary(callback) {
    let dictionary = null;
    let statusEnum = null;
    try {
        dictionary = await this.ctx.models.mail.getGcfsDictionary();
        statusEnum = await this.ctx.models.mail.getEnum();
        // dictionary.customsPort = statusEnum.data['51'];
        // dictionary.orderStatus = statusEnum.data['50'];
        // dictionary.exchangeStatus = statusEnum.data['52'];
        // dictionary.invoiceStatus = statusEnum.data['53'];
        dictionary = merge(dictionary, statusEnum);
        this.base = dictionary;
    } catch (err) {
        //交给框架处理的异常
        this.ctx.onerror(err);
    }
    return dictionary;
}




export default {
    methods: {
        deepCopy,
        routeTo,
        goBack,
        initBaseDictionary,
    }
}
