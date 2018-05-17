function EnumItem(name,options) {
    this.name = name;
    for (var key in options) {
        this[key] = options[key];
    }
}
EnumItem.prototype.toString=function(){
    return this.value;
};
function Enum(options = {}) {
    for (var key in options) {
        this[key] = new EnumItem(key,options[key]);
        this[key].name = key;
    }
}
Enum.prototype = {
    get(val) {
        for (var key in this) {
            if (this[key].value == val) {
                return this[key];
            }
        }
        return {
            value: -1,
            label: '无效的值'
        };
    },
    array() {
        var arr = [];
        for (var key in this) {
            var isprot = false;
            for (var prot in this.__proto__) {
                if (this.__proto__[prot] == this[key]) {
                    isprot = true;
                }
            }
            if (!isprot) {
                arr.push(this[key]);
            }
        }
        return arr;
    }
};

export default Enum;