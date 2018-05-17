X.define("common.layer", function () {
    var popLayer = {
        successMsg: function (title, callback, area) {
            layer.alert('<div style="padding:0 0 20px;;"><i class="iconfont icon-bgcDuiguo" style="color: #00b904;margin-right: 10px"></i>' + title + '</div>', {
                title: "提示",
                area: area,
                yes: function (index) {
                    callback(index);
                }
            });
        },

        successMsgClose: function (title, callback) {
            layer.msg('<span style="margin-left:20px;">' + title + '</span>', {
                icon: 1,
                time: 2000
            }, function () {
                callback();
            });
        },

        warnMsg: function (content, callback, area) {
            layer.alert('<div style="padding:0 0 20px;"><i class="iconfont icon-bgcGanTan" style="color: orange;margin-right: 10px"></i>' + content + '</div>', {
                title: "提示",
                area: area,
                yes: function (index) {
                    callback(index);
                }
            });
        },
        successConfirm: function (content, callback, title) {
            layer.confirm(content, {title: title}, function (index) {
                callback(index);
            });
        },
        successBtn: function (content, title, callback) {
            layer.alert(content, {title: title}, function (index) {
                callback(index);
            });
        },
        successChange: function (content, title, callback, area) {
            layer.open({
                type: 1,
                content: content,
                title: title,
                area: area,
                btn: ["保存"],
                yes: function (index) {
                    callback(index);
                }
            });
        },

        layerOpen: function (opt) {
            layer.open({
                type: opt.type || 1,
                title: opt.title || false,
                closeBtn: opt.closeBtn || 0,
                area: opt.area || false,
                skin: opt.skin || false, //没有背景色
                shadeClose: opt.shadeClose || false,
                btn: opt.btn || false,
                content: opt.content || "",
                success: function () {
                    opt.callback && opt.callback();
                }
            });
        },

        custom: function (opt, callback) {
            layer.confirm("提交成功！", {
                title: false,
                content: opt.content || "自定义html内容",
                area: opt.area || ["200px", "200px"],
                btn: false,
                closeBtn: 0,
                success: function () {
                    callback();
                }
            });
        },


        closeIt: function (index) {
            layer.close(index);
        },

        closeAll: function (type) {
            layer.closeAll(type);
        }
    };


    return popLayer;
});