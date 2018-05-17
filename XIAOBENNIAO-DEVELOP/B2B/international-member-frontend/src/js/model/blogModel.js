X.define("model.blogModel",function () {
    var blogModel =	X.model.create("model.blogModel"),
        blogApi   = X.config.blog.api;

    blogModel.getArticleList = function(data,callback) {
        var option = {url:blogApi.blogList,type:"POST",data:data, callback:function(result) {
            if (result.statusCode === X.CONSTANT.statusCode.SUCCESS){
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    blogModel.query = function(id, callback) {
        var option = {url:blogApi.blogDetail + id,type:"GET", callback:function(result) {
            if (result.statusCode === X.CONSTANT.statusCode.SUCCESS){
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    //这是一个那到所有 详情页需要数据的接口
    blogModel.blogDetail = function (id, callback) {
        var me   = this,
            data = {};

        
        //如果支持ES6 就用Promise
        /*if (window.Promise) {
            new Promise((res, rej) => {

                me.query(id, (result) => { 
                    data = result.data 
                    res()
                })

            }).then(() => {

                me.loadComments({pageNo: 1,pageSize: me.commentsPageSize}, function(result) {
                    data.comments = result.data.list
                })

            }).then(() => {

                me.hotPost(function(result) {
                    data.hot = result.data
                    data.hot && (
                        data.hot.forEach(function(item) {
                           item.href = 'blogs/' + item.postId + '.html'     
                        })
                    )
                    callback(data)
                })

            })


        } else {*/
            me.query(id, function(res) {
                data = res.data;

                me.loadComments({pageNo: 1,pageSize: me.commentsPageSize, query: {blogPostId: id}}, function(result) {
                    data.comments    =  result.data.list;
                    data.commentsNum =  result.data.page.totalCount;

                    me.hotPost(function(res1) {
                        data.hot = res1.data

                        if (data.hot) {
                            var len = data.hot.length
                            while (len--) {
                                var item = data.hot[len];
                                item.href = 'blogs/' + item.postId + '.html'
                            }
                        }

                        callback(data);
                    })
                    
                });
            });
        /*}*/
    };

    blogModel.postComments = function(data, callback) {
        var option = {url:blogApi.postComments,type:"POST", data: data, callback:callback};

        X.loadData(option);
    };

    blogModel.loadComments = function(query, callback) {
        var option = {url:blogApi.loadComments,type:"POST", data: query, callback:function(result) {
            if (result.statusCode === X.CONSTANT.statusCode.SUCCESS){
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    blogModel.getListPostByPage = function(data,callback) {
        var option = {url:blogApi.listPostByPage,type:"POST",data:data, callback:function(result) {
            if (result.statusCode === X.CONSTANT.statusCode.SUCCESS){
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    blogModel.hotPost = function(callback) {
        var option = {url:blogApi.hotPost,type:"POST", callback:function(result) {
            if (result.statusCode === X.CONSTANT.statusCode.SUCCESS){
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };

    blogModel.getListTenPosts = function(callback) {
        var option = {url:blogApi.blogList,type:"POST", callback:function(result) {
            if (result.statusCode === X.CONSTANT.statusCode.SUCCESS){
                callback && callback(result);
            }
        }};

        X.loadData(option);
    };



    blogModel.commentsPageSize = 10
    blogModel.commentsNum      = 10000
    return blogModel;
});