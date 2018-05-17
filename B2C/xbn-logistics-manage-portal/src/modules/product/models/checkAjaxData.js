//处理接口返回数据数据
var checkAjaxData = function (json, fail) {
    if (json.statusCode == '2000000') {
        return json.data;
    } else {
        if (fail) {
            fail(json);
        } else {
            let msg = json.errMsg || '未知错误';
            this.$notify.error({
                title: '错误',
                message: msg
            });
            throw '网络错误';
        }
    }
}
var ajaxDataMumberToString = function (json) {
    var check = function (json) {
        if (json === null) {
            return json;
        }
        switch (typeof json) {
            case 'object':
                json instanceof Object ? checkObject(json) : checkArray(json);
                break;
            case 'number':
                json = json.toString();
                break;
            default:
                break;
        }
        return json;
    }
    var checkObject = function (json) {
        for (var key in json) {
            json[key] = check(json[key]);
        }
    }
    var checkArray = function (json) {
        for (var i = 0; i < json.length; i++) {
            json[i] = check(json[i]);
        }
    }
    return check(json);
}
export {
    checkAjaxData,
    ajaxDataMumberToString
};