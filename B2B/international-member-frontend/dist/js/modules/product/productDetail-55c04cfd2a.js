X.define("modules.productDetail", ["modules.common.global","model.productsModel","adapter.searchValidate"], function (global, productsModel,searchValidate) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-myProductDetail"),
        url: X.config.product.tpl.productDetail,
        res : X.config.product.res.productDetail
    });

    //初始化控制器
    var productDetail = X.controller.newOne({
        view: view
    });

    $.addTemplateFormatter({
        hrefFormater: function (value, template) {
            return X.config.PATH_FILE.path.root+"products/"+value+".html";
        },
        imgFormater: function (value, template) {
            if(X.isString(value)){
                value = JSON.parse(value);
            }
            return X.isArray(value)&&value.length>0? X.config.PATH_FILE.path.rootImgDisplayUrl+value[0]:"";

        },
        prodNameFormater :function (value, template) {
            if(value){
                if(value.length>80){
                    return value.substring(0,80)+"...";
                }
                return value;
            }
        },
        RecommendImgFormater:function (value, template) {
            if(value){
                return X.constructor.prototype.config.PATH_FILE.path.rootImgDisplayUrl + value;
            }
        }
    });

    function getParam(paramName) {
        var url = window.location.href;
        var id = url.substring(url.lastIndexOf("/")+1).replace(".html","");
        return id;
    }

    productDetail.rendering = function () {

        var data = {
            productId:getParam("productId")
        };

        var callback = function(result){
            if(result.statusCode == X.constructor.prototype.CONSTANT.statusCode.SUCCESS){
                return view.render(result.data[0], function () {

                    $(document).attr("title","productDetail-Weintrade");
                    productDetail.view.el.find(".js-productDisplayNone").css("display","displayNone")

                    if(result.data[0].description){
                        var arr = productDetail.transform(JSON.parse(result.data[0].description));
                        var moreButton = productDetail.view.el.find(".js-moreButton");
                        (arr.length < 13 && !result.data[0].details) ? '' : moreButton.removeClass('displayNone');
                        productDetail.renderAttribute(arr, productDetail.view.el.find(".js-productDescription"));

                        if(result.data[0].details){
                            productDetail.view.el.find(".js-productDetailsWrap").removeClass("displayNone");
                            var height = 370 - 69 - Number(productDetail.view.el.find(".js-productDescription").height());
                            productDetail.view.el.find(".js-productDetailsContent").html(result.data[0].details).css("height",height + "px");
                        }

                        /*
                         //两列显示
                         var leftArr = [], rightArr = [], arrWrap = [];
                         for(var i=0,len=arr.length;i< len/2;i++){
                         arrWrap.push(arr.splice(i,1)[0]);
                         }
                         if(arrWrap.length >= arr.length){
                         leftArr = arrWrap;
                         rightArr = arr;
                         }else{
                         leftArr = arr;
                         rightArr = arrWrap;
                         }

                         productDetail.renderAttribute(leftArr, productDetail.view.el.find(".js-left"));
                         productDetail.renderAttribute(rightArr, productDetail.view.el.find(".js-right"));*/
                    }
                    productDetail.getRecommendList(result.data[0].category);

                    productDetail.slideShow(result.data[0]);

                    productDetail.enterSearch()
                });
            }else if(result.statusCode == X.constructor.prototype.CONSTANT.statusCode.INVALIDPRODUCT){
                return view.render({}, function () {
                    $(document).attr("title","productDetail-Weintrade");
                    productDetail.view.el.find(".js-productDisplay").css("display","none")
                    productDetail.view.el.find(".js-productDisplayNone").css("display","block")
                    productDetail.getRecommendList('');

                    productDetail.enterSearch()
                });
            }
        };

        productsModel.getProductDetail(data,callback);

    };

    productDetail.transform = function(obj){
        var arr = [];
        for(var item in obj){
            var o = new Object();
            o[item] = obj[item];
            arr.push(o);
        }
        return arr;
    }
    /*
     * @todo 产品的关联推荐
     * @param   category  产品的末级分类
     * @method  productsModel.getProductList 推荐结果为“0”时展示热销产品
     * */
    productDetail.getRecommendList = function(category){
        var list = [];
        var needNum =28;//28为常量
        list.push(category);

        var recommendData = $.extend(false,{},{list:list},{needNum:needNum});
            recommendData .index = "index_weintrade";
            recommendData.productId = getParam("productId");
        productsModel.getsearchRecommend(recommendData,function(result){
            var result =JSON .parse(result);
            if (result.list.length === 0){
                productDetail.view.el.find(".js-wrapList,.js-prompt-mayAlso").hide();
                productDetail.view.el.find(".js-searchRecommendNo,.js-prompt-Buyerslike").show();
                productsModel.getProductList(function(result){
                    if(result.statusCode == X.constructor.prototype.CONSTANT.statusCode.SUCCESS){
                         var wrapList = productDetail.view.el.find(".js-searchRecommendNo");
                         wrapList.loadTemplate($(".js-search-searchList-recommend-tpl"),result.data);
                     }
                })
            }else{
                var wrapList = productDetail.view.el.find(".js-wrapList");
                wrapList.loadTemplate(productDetail.view.find(".js-product-productList-tpl"),result.list);
            }
        });
    };
    productDetail.slideShow = function(data){
        var imageArray = data.imgs;

        var imageHtml = '';
        for (var i = 0, len = imageArray.length; i < len; i++) {
            imageHtml += '<li><img src="' + X.config.PATH_FILE.path.rootImgDisplayUrl + imageArray[i] +'" /></li>'
        }
        productDetail.view.el.find('#slider').find('.js-bigImage').html(imageHtml);
        productDetail.view.el.find('#carousel').find('.js-smallImage').html(imageHtml);
        var sliderIndex = 0;
        productDetail.view.el.find('#slider').flexslider({
            animation: "fade",
            controlNav: false,
            animationLoop: false,
            directionNav: false,
            slideshow: false,
            sync: "#carousel",
            after: function (slider) {
                sliderIndex = slider.animatingTo;
            }
        });
        productDetail.view.el.find('#carousel').flexslider({
            animation: "slide",
            controlNav: false,
            animationLoop: false,
            slideshow: false,
            itemWidth: 74,
            itemMargin:3,
            asNavFor: '#slider'
        });

        var type = '';
        productDetail.view.el.find(".js-bigImage").click(function () {
            var width = $(window).width() + 17;
            width = width > 1366 ? width : 1366;
            var widthLayer = width + 'px';
            var height = $(window).height();
            height = height > 670 ? height : 670;
            var heightLayer = height + 'px';
            var that = $(this.that);
            var content = $('.js-layer').html();
            that.attr("disabled", true);
            var layerIndex = layer.open({
                    id: 'layer',
                    title: '',
                    content: content,
                    btn: [],
                    closeBtn: 0,
                    fixed: true,
                    resize: false,
                    move: false,
                    scrollbar: false,
                    area: [widthLayer, heightLayer],
                    success: function () {
                        var imageArray = data.imgs;
                        var imageHtml = '';
                        for (var i = 0, len = imageArray.length; i < len; i++) {
                            imageHtml += '<li><img src="' + X.config.PATH_FILE.path.rootImgDisplayUrl + imageArray[i] +'" /></li>'
                        }
                        $('#layer').find('#layerSlider').find('.js-bigImage').html(imageHtml);
                        $('#layer').find('#layerCarousel').find('.js-smallImage').html(imageHtml);
                        $('#layer').find('#layerSlider').flexslider({
                            animation: "fade",
                            controlNav: false,
                            animationLoop: false,
                            slideshow: false,
                            startAt: sliderIndex,
                            sync: "#layer #layerCarousel"
                        });
                        if (sliderIndex < 14) {
                            $('#layer').find('#layerCarousel').flexslider({
                                animation: "slide",
                                controlNav: false,
                                animationLoop: false,
                                slideshow: false,
                                itemWidth: 57,
                                itemMargin: 6,
                                asNavFor: '#layer #layerSlider'
                            });
                            $('#layer').find('#layerCarousel').find('.js-smallImage li').removeClass("flex-active-slide").eq(sliderIndex).addClass("flex-active-slide");
                        } else {
                            $('#layer').find('#layerCarousel').flexslider({
                                animation: "slide",
                                controlNav: false,
                                animationLoop: false,
                                slideshow: false,
                                startAt: sliderIndex,
                                itemWidth: 57,
                                itemMargin: 6,
                                asNavFor: '#layer #layerSlider'
                            });
                        }

                        if (imageArray.length < 14) {
                            setTimeout(function () {
                                $('#layer').find('#layerCarousel ul:first').css('width', '100%');
                                $('#layer').find('#layerCarousel ul:first').css('text-align', 'center');
                                $('#layer').find('#layerCarousel ul:first').css('visibility', 'visible');
                                $('#layer').find('#layerCarousel ul:last').css('height', '0');
                                $('#layer').find('#layerCarousel li').css('display', 'inline-block');
                                $('#layer').find('#layerCarousel li').css('float', 'none');
                            }, 500);
                        } else {
                            $('#layer').find('#layerCarousel ul:first').css('visibility', 'visible');
                        }
                        $('#layer').parent().css('background-color', 'transparent');
                        $('#layer').parent().css('left', '0px');
                        $('#layer').parent().css('top', '0px');
                        $('#layer').parent().prev().css('background-color', '#000');
                        $('#layer').parent().prev().css('opacity', '0.88');
                        $('#layer').find('.js-bigImage li').css('height', (height - 180) + 'px');
                        $('#layer').find('.js-bigImage li').css('line-height', (height - 180) + 'px');
                        $('#layer').find('.js-bigImage li img').css('max-height', (height - 180) + 'px');
                        $('#layer').find('.js-layer-flexslider-right').css('height', (height - 120) + 'px');
                        $('#layer').find(".js-close").click(function () {
                            layer.close(layerIndex);
                        });
                        var href = X.config.PATH_FILE.path.root + "request/buyrequestatproduct.html?productId=" + getParam("productId");
                        $('#layer').find('.js-submitRFQ').attr("href", href).attr('target', '_blank');
                        type = 'image';
                        responseLayout();
                        $('#layer').click(function (event) {
                            productDetail.controlClose(event);
                        });
                    },
                    end: function () {
                        that.removeAttr("disabled");
                    }
                }
            );
            $(window).resize(function() {
                width = $(window).width();
                // width = $(window).width() + 25;
                width = width > 1366 ? width : 1366;
                widthLayer = width + 'px';
                height = $(window).height();
                height = height > 670 ? height : 670;
                heightLayer = height + 'px';
                $('#layer').parent().css('left', '0px');
                $('#layer').parent().css('top', '0px');
                $('#layer').parent().css('width', widthLayer);
                $('#layer').parent().css('height', heightLayer);
                responseLayout();
            });
        });

        productDetail.view.el.find(".js-moreButton").click(function () {
            var width = $(window).width() + 17;
            width = width > 1366 ? width : 1366;
            var widthLayer = width + 'px';
            var height = $(window).height();
            height = height > 670 ? height : 670;
            var heightLayer = height + 'px';
            var that = $(this.that);
            var content = $('.js-layer-learn-more').html();
            that.attr("disabled", true);
            var layerIndex = layer.open({
                    id: 'layerLearnMore',
                    title: '',
                    content: content,
                    btn: [],
                    closeBtn: 0,
                    fixed: true,
                    resize: false,
                    move: false,
                    scrollbar: false,
                    area: [widthLayer, heightLayer],
                    success: function () {
                        var imageArray = data.imgs;
                        var imageHtml = '';
                        for (var i = 0, len = imageArray.length; i < len; i++) {
                            imageHtml += '<li><img src="' + X.config.PATH_FILE.path.rootImgDisplayUrl + imageArray[i] +'" /></li>'
                        }
                        var layerLearnMore =  $('#layerLearnMore');
                        layerLearnMore.find('#layerSliderLearnMore').find('.js-bigImage').html(imageHtml);
                        layerLearnMore.find('#layerCarouselLearnMore').find('.js-smallImage').html(imageHtml);
                        layerLearnMore.find('#layerSliderLearnMore').flexslider({
                            animation: "fade",
                            controlNav: false,
                            animationLoop: false,
                            slideshow: false,
                            startAt: sliderIndex,
                            sync: "#layerLearnMore #layerCarouselLearnMore"
                        });
                        if (sliderIndex < 14) {
                            layerLearnMore.find('#layerCarouselLearnMore').flexslider({
                                animation: "slide",
                                controlNav: false,
                                animationLoop: false,
                                slideshow: false,
                                itemWidth: 57,
                                itemMargin: 6,
                                asNavFor: '#layerLearnMore #layerSliderLearnMore'
                            });
                            layerLearnMore.find('#layerCarouselLearnMore').find('.js-smallImage li').removeClass("flex-active-slide").eq(sliderIndex).addClass("flex-active-slide");
                        } else {
                            layerLearnMore.find('#layerCarouselLearnMore').flexslider({
                                animation: "slide",
                                controlNav: false,
                                animationLoop: false,
                                slideshow: false,
                                startAt: sliderIndex,
                                itemWidth: 57,
                                itemMargin: 6,
                                asNavFor: '#layer #layerSliderLearnMore'
                            });
                        }

                        if (imageArray.length < 14) {
                            setTimeout(function () {
                                layerLearnMore.find('#layerCarouselLearnMore ul:first').css('width', '100%');
                                layerLearnMore.find('#layerCarouselLearnMore ul:first').css('text-align', 'center');
                                layerLearnMore.find('#layerCarouselLearnMore ul:first').css('visibility', 'visible');
                                layerLearnMore.find('#layerCarouselLearnMore ul:last').css('height', '0');
                                layerLearnMore.find('#layerCarouselLearnMore li').css('display', 'inline-block');
                                layerLearnMore.find('#layerCarouselLearnMore li').css('float', 'none');
                            }, 500);
                        } else {
                            layerLearnMore.find('#layerCarouselLearnMore ul:first').css('visibility', 'visible');
                        }
                        layerLearnMore.parent().css('background-color', 'transparent');
                        layerLearnMore.parent().css('left', '0px');
                        layerLearnMore.parent().css('top', '0px');
                        layerLearnMore.parent().prev().css('background-color', '#000');
                        layerLearnMore.parent().prev().css('opacity', '0.88');
                        layerLearnMore.find('.js-bigImage li').css('height', (height - 180) + 'px');
                        layerLearnMore.find('.js-bigImage li').css('line-height', (height - 180) + 'px');
                        layerLearnMore.find('.js-bigImage li img').css('max-height', (height - 180) + 'px');
                        layerLearnMore.find('.js-layer-flexslider-right').css('height', (height - 120) + 'px');
                        layerLearnMore.find(".js-close").click(function () {
                            layer.close(layerIndex);
                        });
                        var href = X.config.PATH_FILE.path.root + "request/buyrequestatproduct.html?productId=" + getParam("productId");
                        layerLearnMore.find('.js-submitRFQ').attr("href", href).attr('target', '_blank');
                        type = 'learnMore';
                        responseLayout();
                        layerLearnMore.click(function (event) {
                            productDetail.controlClose(event);
                        });
                        $(".layer-flexslider-right").mCustomScrollbar("destroy");
                        $(".layer-flexslider-right").mCustomScrollbar({
                                //theme:"dark-2"
                            }
                        );
                    },
                    end: function () {
                        that.removeAttr("disabled");
                    }
                }
            );
            $(window).resize(function() {
                width = $(window).width();
                // width = $(window).width() + 25;
                width = width > 1366 ? width : 1366;
                widthLayer = width + 'px';
                height = $(window).height();
                height = height > 670 ? height : 670;
                heightLayer = height + 'px';
                var layerLearnMore =  $('#layerLearnMore');
                layerLearnMore.parent().css('left', '0px');
                layerLearnMore.parent().css('top', '0px');
                layerLearnMore.parent().css('width', widthLayer);
                layerLearnMore.parent().css('height', heightLayer);
                responseLayout();
            });
        });
        
        function responseLayout() {
            var layer;
            if (type === 'image') {
                layer = $('#layer');
                var width = $(window).width();
                if (width < 1366) {
                    layer.find('.layerSlider').css('width', '750px');
                    layer.find('#layerCarousel').css('width', '680px');
                    var rightWidth = (1366 - width + 30) + 'px';
                    layer.find('.js-close').css('right', rightWidth);
                    if (width < 1264) {
                        layer.find('.js-close').hide();
                    } else {
                        layer.find('.js-close').show();
                    }
                    layer.find('.flexslider-main img').css('max-width', '750px');
                } else {
                    layer.find('.layerSlider').css('width', '950px');
                    layer.find('#layerCarousel').css('width', '880px');
                    layer.find('.js-close').css('right', '30px');
                    layer.find('.flexslider-main img').css('max-width', '950px');
                    layer.find('.js-close').show();
                }
            } else if (type === 'learnMore') {
                layer = $('#layerLearnMore');
                var width = $(window).width();
                if (width < 1366) {
                    var rightWidth = (1366 - width + 30) + 'px';
                    layer.find('.js-close').css('right', rightWidth);
                    if (width < 1264) {
                        layer.find('.js-close').hide();
                    } else {
                        layer.find('.js-close').show();
                    }
                    layer.find('.flexslider-main img').css('max-width', '750px');
                } else {
                    layer.find('.layerSlider').css('width', '950px');
                    layer.find('#layerCarousel').css('width', '880px');
                    layer.find('.js-close').css('right', '30px');
                    layer.find('.flexslider-main img').css('max-width', '950px');
                    layer.find('.js-close').show();
                }
            }
        }

        var description = '';
        // if (data.quotations) {
        //     description += '<li><span>Price:</span><span>' + data.quotations + '</span></li>';
        // }
        // if (data.category) {
        //     description += '<li><span>Category:</span><span>' + data.category+ '</span></li>';
        // }
        // if (data.rmdTags) {
        //     description += '<li><span>Tag:</span><span>' + data.rmdTags+ '</span></li>';
        // }
        var arr = productDetail.transform(JSON.parse(data.description));
        for (var i = 0, len = arr.length; i < len; i++) {
            for (var x in arr[i]) {
                description += '<li><span class="colcc f16">' + x + ': </span><span class="colcc f16">' + arr[i][x] + '</span></li>';
            }
        }
        productDetail.view.el.find('.js-details').html(description);
        productDetail.view.el.find('.js-description').html(data.details);

        if (description === '') {
            productDetail.view.el.find('.js-details-content').hide();
        } else {
            productDetail.view.el.find('.js-details-content').show();
        }
        if (data.details === '') {
            productDetail.view.el.find('.js-description-content').hide();
        } else {
            productDetail.view.el.find('.js-description-content').show();
        }

    };

    /*
     * @method  gblen 判断中英文字符长度
     * @param  data  判断的数据
     * */
    productDetail.gblen = function(data) {
        var len = 0;
        for (var i=0; i<data.length; i++) {
            if (data.charCodeAt(i)>127 || data.charCodeAt(i)==94) {
                len += 2;
            } else {
                len ++;
            }
        }
        return len;
    };

    /*
     * @method  intercept 字符串截取函数
     * @param  data  截取的数据
     * @param  num 截取的字数
     * */
    productDetail.intercept = function (data, num) {
        var dataDesc;
        if(data){
            data.length>num ? dataDesc = data.substring(0,num)+"..." : dataDesc = data
        }
        return dataDesc
    };

    productDetail.controlClose = function (event) {
        var temp = $(event.target);
        var flg = true;
        for (var i = 0; i < 10; i++) {
            if (temp.hasClass('js-center')) {
                flg = false;
                break;
            } else {
                temp = temp.parent();
            }

        }
        if (flg) {
            layer.closeAll();
        }
    };

    productDetail.renderAttribute = function(data, parent){
        var dataLen = data.length > 12 ? 12 : data.length;
        for (var i = 0, len = dataLen;  i < len; i++) {
            for (var x in data[i]) {
                var temp = '<p class="f14 lh30 w720"><span class="col66 vat js-aa" style="width: 148px;display: inline-block;" title="'+ x +'" >'+ productDetail.intercept(x,16) + ":"+ '</span>' +
                  '<span class="col66 inlineb js-bb" style="width: 505px;display: inline-block;margin-left: 12px;" title=" '+ data[i][x] +'">'+ productDetail.intercept(data[i][x],65) +'</span></p>';
                $(parent).append(temp);
            }
        }
    };

    productDetail.renderImg = function(data, parent){
        $.each(data, function(i, item){
            var temp = '<li><img src="'+X.config.PATH_FILE.path.rootImgDisplayUrl + data[i] +'" /></li>';
            $(parent).append(temp);
        });
    };

    productDetail.getBuyingRequest = function(){
        window.open(X.config.common.link.buyingRequest);
    };
    productDetail.getBuyingRequestProduct = function(){
        window.location.href = X.config.PATH_FILE.path.root+"requests/"+getParam('productId')+".html";
    };

    productDetail.getSearchList = function(){
        var key = productDetail.view.el.find(".js-serarchKeyword").val();
        searchValidate.keyValidate(key);
    };

    productDetail.enterSearch = function(){
        productDetail.view.el.find(".js-serarchKeyword").on('keyup',function(e){
            if(e && e.keyCode==13){
                productDetail.getSearchList()
            }
        })
    };

    productDetail.addEvent("click", ".js-serarch", "getSearchList");
    productDetail.addEvent("click", ".js-postButton", "getBuyingRequest");
    productDetail.addEvent("click", ".js-submitButton", "getBuyingRequestProduct");



    productDetail.load = function (argument) {
        productDetail.rendering();
    };

    productDetail.load();

    return productDetail;
});