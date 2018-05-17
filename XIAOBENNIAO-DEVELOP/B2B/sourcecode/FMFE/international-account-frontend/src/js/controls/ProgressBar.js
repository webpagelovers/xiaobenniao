(function ($, X) {

    X.prototype.controls.widget("ProgressBar", function (controlType) {

        var BaseControl = X.prototype.controls.getControlClazz("BaseControl");

        /**
         @class ProgressBar 进度条
         @constructor 构造函数
         @param elem {DomNode} Dom节点
         @param option {Object} 配置信息
         */
        function ProgressBar(elem, options) {
            BaseControl.call(this, elem, options);

            this.progressWrap = elem;
            this.progressContent = options.progressContent;
            this.progressContentInfo = options.progressContentInfo;
            this.allSteps = options.allSteps;
            this.nowStep = options.nowStep;
            this.cancelled = options.cancelled;

            this.init();
        }

        X.prototype.controls.extend(ProgressBar, "BaseControl");

        /**
         @method createTemplate 创建进度条模板
         @return 获取所创建的模板
         */
        ProgressBar.prototype.createTemplate = function () {
            var progressBar = '<ul>';
            for (var i = 0; i < this.allSteps; i++) {
                if (i == this.allSteps - 1) {
                    progressBar += '<li class="fl progressList">' +
                        '<div class="indexCircle bgcCc mr10 ml10">' + this.progressContent[i] + '</div>' +
                        '<p class="poa t50 w80 col66 l6">' + this.progressContentInfo[i] + '</p>' +
                        '</li>';
                } else {
                    progressBar += '<li class="fl progressList">' +
                        '<div class="indexCircle bgcCc mr10 ml10">' + this.progressContent[i] + '</div>' +
                        '<p class="poa t50 w80 col66 l6">' + this.progressContentInfo[i] + '</p>' +
                        '</li>' +
                        '<li class="fl"><div class="progress_hr mt10"></div></li>'
                }
            }
            progressBar += '</ul>';

            return progressBar;
        };
        /**
         @method setProgressWidth 设置进度条的宽度
         */
        ProgressBar.prototype.setProgressWidth = function (count) {
            if (count === 3) {
                var aLi = this.progressWrap.find(".progress_hr").width(400);
            } else if (count === 4) {
                var aLi = this.progressWrap.find(".progress_hr").width(255);
            }
        };
        /**
         @method getNowStep 获取当前的进度
         */
        ProgressBar.prototype.getNowStep = function () {
            var aLi = this.progressWrap.find(".progressList");
            var aHr = this.progressWrap.find("hr");

            for (var i = 0; i < this.nowStep; i++) {
                if (i == this.nowStep - 1) {
                    var html = '<div class="indexCircleWrap mt_9"><div class="indexCircle bgcDarkOran">' + this.progressContent[i] + '</div></div>' +
                        '<p class="poa t50 w100 l6">' + this.progressContentInfo[i] + '</p>';
                    aLi.eq(i).html(html);
                } else {
                    var html = '<div class="indexCircle mr10 ml10 bgcDarkOran">' + this.progressContent[i] + '</div>' +
                        '<p class="poa t50 w100 col66 l6">' + this.progressContentInfo[i] + '</p>';
                    aLi.eq(i).html(html);
                    aHr.eq(i).attr("color", "#019be1");
                }
            }
        };
        /**
         @method getCancelledStep 获取取消订单时的进度
         */
        ProgressBar.prototype.getCancelledStep = function () {
            var aLi = this.progressWrap.find(".progressList");
            var aHr = this.progressWrap.find("hr");

            for (var i = 0; i < this.nowStep; i++) {
                if (i == this.nowStep - 1) {
                    var html = '<div class="indexCircleWrap mt_9 bdcCCC"><div class="indexCircle bgcCc">' + this.progressContent[i] + '</div></div>' +
                        '<p class="poa t50 w80 col66 l6">' + this.progressContentInfo[i] + '</p>';
                    aLi.eq(i).html(html);
                } else {
                    var html = '<div class="indexCircle mr10 ml10 bgcCc">' + this.progressContent[i] + '</div>' +
                        '<p class="poa t50 w80 col66 l6">' + this.progressContentInfo[i] + '</p>';
                    aLi.eq(i).html(html);
                    aHr.eq(i).attr("color", "#CCC");
                }
            }
        };
        /**
         @method init 初始化
         */
        ProgressBar.prototype.init = function () {
            this.progressWrap.html(this.createTemplate());
            this.getNowStep();
        };

        return ProgressBar;

    });

})(jQuery, this.Xbn);