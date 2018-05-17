X.define("modules.blog.index",["modules.common.global","model.blogModel",'common.share'], function (global,blogModel,share) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $(".js-blog-list"),
        url: X.config.blog.tpl.index,
        res: X.config.blog.res.index
    });

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    });

    X.subscribe(X.CONSTANT.channel["navReady"],function (argument) {
        var model = X.require.getModule("modules.common.nav");
        if(model){
            model.setActive("blog");
        }
    });
    $.addTemplateFormatter({
        hrefFormater: function (value, template) {
            return X.config.PATH_FILE.path.root+"blog/"+value+".html";
        }
    });

    ctrl.rendering = function () {
        /*return view.render(function () {
            ctrl.getBlogList();
        });*/

        //之前的渲染用的是loadTemplate, 由于国际站的静态化需求, 改用node ejs渲染, 之后绑定事件
        events.init()
    };

    var events = {
        init: function() {
            //添加share图标 & 获取数量
            $('.shareBtns', view.el).each(function(i, item) {
                var me = $(item)
                share(me, X.config.PATH_FILE.path.root+"blog/"+me.attr('postId')+".html", me.attr('posttitle'))
            })

            //添加href
            /*$('.js-blog-show-list', view.el).find('a').each(function(i, item) {
                var me = $(item)
                me.attr('href', X.config.PATH_FILE.path.root + 'blogs/' + me.attr('href') + '.html')
            })*/
            
        }
    }
    ctrl.getBlogList = function(){
        var data  =  {
            "pageSize":"10",
            "pageNo":"1"
        };
        var getListCallback = function(result){
            var data = result.data.list;
            var dataLenght = result.data.list.length;
            var dataArray = [],dataImgArray = [];
            for (var i = 0;i<dataLenght;i++){
                var $div= $("<div></div>");
                $div.addClass("js-blog-list"+i);
                ctrl.view.find(".js-blog-show-list").append($div);
                var loadHt = $(".js-blog-list"+i);
                if (data[i].listImage != ""){
                    dataImgArray.push(data[i]);
                    dataImgArray[0].postDate = ctrl.transDate(dataImgArray[0].postDate);
                    loadHt.loadTemplate(ctrl.view.find(".js-blog-list-img-tpl"),dataImgArray);
                    var sharesBtn = loadHt.find('.shareBtns');
                    share(sharesBtn, X.config.PATH_FILE.path.root+"blog/"+dataImgArray[0].postId+".html",dataImgArray[0].postTitle);
                    dataImgArray.shift();
                }else{
                    dataArray.push(data[i]);
                    dataArray[0].postDate = ctrl.transDate(dataArray[0].postDate);
                    loadHt.loadTemplate(ctrl.view.find(".js-blog-list-tpl"),dataArray);
                    var sharesBtn = loadHt.find('.shareBtns');
                    share(sharesBtn, X.config.PATH_FILE.path.root+"blog/"+dataArray[0].postId+".html",dataArray[0].postTitle);
                    dataArray.shift();
                }
            }
            ctrl.view.find(".js-hover").hover(function(){
                //ctrl.view.find(this)
                ctrl.view.find(this).parent().find(".js-highlight").css("color","#00AD36")
            },function(){
                ctrl.view.find(this).parent().find(".js-highlight").css("color","")
            })

        };
        blogModel.getArticleList(data,getListCallback)
    };

    ctrl.transDate = function(date){
        var dateArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var str = date.substring(0,11);
        var arr = str.split("-");
        var month = dateArray[arr[1]-1];
        var postDate = month + " " +arr[2]+","+arr[0];
        return postDate;
    };
    ctrl.load = function () {
        ctrl.rendering();
    };
    ctrl.load();
    ctrl.addEvent(".js-load-more","click","loadMore");

    
    return ctrl;
});
