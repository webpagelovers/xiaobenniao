X.define('modules.blog.blogDetail', ['modules.common.global','model.blogModel', 'common.share', 'modules.user.login', 'modules.user.regist'], function (global, model, share, loginView, registView) {
    //初始化视图对象
    var view = X.view.newOne({
        el: $('.js-blog-detail'),
        url: X.config.blog.tpl.blogDetail,
        res: X.config.blog.res.detail
    })

    //初始化控制器
    var ctrl = X.controller.newOne({
        view: view
    })
    var data, 
        blogPostId,
        validate,
        comments,
        commentForm,
        loadCommentsBtn,
        postCommentsBtn,
        commentsListBox,
        commentsListTar,
        commentTextarea,
        blogCommentsNum,
        blogDetailPic,
        commentsPageNo   = 0,
        commentsPageSize = model.commentsPageSize

    var events = {
        init: function() {
            //bind events
            var el = view.el

            commentForm      =  $('#commentForm', el)
            loadCommentsBtn  =  $('#loadMoreComments', el)
            postCommentsBtn  =  $('#postComments', el)
            commentTextarea  =  $('#commentTextarea', el)
            commentsListBox  =  $('#commentsListBox', el)
            blogCommentsNum  =  $('#blogDetailCommentsNum', el)
            blogDetailPic    =  $('#blogDetailHeadPic', el)
            commentsListTar  =  commentsListBox.children()

            postCommentsBtn.on('click', this.postComments)
            comments = []//data.comments
            data.comments && data.comments.length === commentsPageSize && loadCommentsBtn.on('click', this.loadComments).removeClass('none')
            
            this.loadComments()
            //this.loadHot()
            blogCommentsNum.html(data.commentsNum)

            share($('.shareBtns', el), null, data.postTitle)
            //this.setIframeContent()
            this.setValidate()

            commentForm.validate(validate)

            $('#blogDetailBreadcrumbsTitle', el).html($('#blogDetailPostTitle').html())
            !blogDetailPic.attr('src') && blogDetailPic.hide()

            var agent = navigator.userAgent 
            agent.indexOf('Safari') > -1 && agent.indexOf('Chrome') === -1 && commentsListBox.find('.showEllipsis').css('vertical-align', 0)

            //解决ie10 的placehoder bug
            commentTextarea.val('')
        },
        loadComments: function() {
            var query = {
                    pageNo: ++commentsPageNo,
                    pageSize: commentsPageSize,
                    query: {
                        blogPostId: blogPostId
                    }
                }
            model.loadComments(query, function(res) {
                var res = events.formateCommentTime(res.data.list)

                comments = comments.concat(res)

                commentsListTar.attr('data-list', 'comments')
                commentsListTar.html(commentsListTar.children()[0].outerHTML)
                commentsListBox.loadTemplate(commentsListTar, {comments: comments}, function() { })

                res.length < commentsPageSize || comments.length > model.commentsPageSize? loadCommentsBtn.hide(): loadCommentsBtn.show()
            })
        },
        postComments: function() {
            if (commentForm.valid()) {
                var data = {
                    commentContent: commentTextarea.val(),
                    blogPostId: blogPostId
                }
                model.postComments(data, function(result) {
                    if (result.statusCode === X.CONSTANT.statusCode.SUCCESS){
                        commentTextarea.val('')
                        layer.alert('submit success', function(index) {
                            layer.close(index)
                            comments = []
                            commentsPageNo = 0
                            events.loadComments()
                            commentsListTar.show()
                            scrollTo(0, commentsListBox.offset().top - 400)
                        })
                        var num = blogCommentsNum.html()
                        num = isNaN(num)? num: 1 + parseInt(num)
                        num > model.commentsNum && (num = '10000+')
                        blogCommentsNum.html(num)
                    } else if (result.statusCode === X.CONSTANT.statusCode.NOLOGIN) {
                        loginView.showView()
                    }
                    
                })
            }
        },
        setIframeContent: function() {
            var iframe = $('#postContentIframe')[0],
                docum  = iframe.contentWindow.document,
                conten = $('#postContentHidden', view.el)[0].innerText
                

            //由于后台的发布的宽度比前台宽，所以去掉文章的高度
            var content = conten.replace(/<style type="text\/css">body{background-color:#ffffff; background-image:;.*<\/style>/, '')
            
            var userAgent = navigator.userAgent
            if (userAgent.indexOf('Firefox') > -1) {
                //firefox, 不知道什么原因, 先这样吧 
                setTimeout(function() {
                    $('#postContentIframe')[0].contentDocument.body.innerHTML = content
                    $('#postContentIframe')[0].style.height = $('#postContentIframe')[0].contentDocument.documentElement.offsetHeight + 'px'
                }, 100)
            } else if(userAgent.indexOf('MSIE') > -1) {
                //ie8, 9
                setTimeout(function() {
                    var bod = document.frames['postContentIframe'].document.body
                    $(bod).html(content)
                    iframe.style.height  = bod.scrollHeight + 30 + 'px'
                }, 200)
            } else {
                docum.body.innerHTML = content
                iframe.style.height  = docum.documentElement.offsetHeight + 'px'
            }
        },
        setValidate: function() {
            validate = {
                rules: {
                    commentTextarea:    { required: true, /*rangelength: [1, 1500],*/ ridCh: true}
                },
                messages: {
                    commentTextarea:    { required: "You forgot to enter a comment.", rangelength: "a comment limit 1500 words", ridCh: "Please enter English and commonly used symbols. Special symbols are not accepted."}
                },
                onkeyup: false,
                onfocusout: function (element) {
                    $(element).valid()
                },
                errorPlacement: function (error, element) {
                    element.after(error)
                }
            }
        },
        transformData: function(res) {
            res.comments  = this.formateCommentTime(res.comments)
            res.postDate  = this.subTime(res.postDate)
            res.postAuthor.length > 25 && (res.postAuthor = res.postAuthor.substr(0,25) + '...')
            res.commentsNum > model.commentsNum && (res.commentsNum = '10000+')

            return res
        },
        formateCommentTime: function(list) {
            var me = this
            if (list && list.length) {
                list.forEach(function(item) {
                    var dd = item.commentDate
                    item.commentDate = me.subTime(dd)
                })
            }

            return list
        },
        subTime: function(time) {
            time = time.replace(/-/g, '/')
            return new Date(time).toUTCString().split(' ').splice(1, 3).join(', ').replace(',', '')
        },
        loadHot: function() {
            $('#hotArticleBox').loadTemplate($('#hotArticleBoxTem'), data.hot, function() { })
        }
    }

    ctrl.load = function(para) {
        var paras = location.pathname.split('/')
        blogPostId = paras[paras.length - 1].replace('.html', '')
        model.blogDetail(blogPostId, function(res) {
            data = events.transformData(res)
            //view.render(data, function() {
                events.init()
            //})
        })

        $(".js-canonical-link").attr("href","https://m.weintrade.com"+location.pathname);
    }

    ctrl.load()

    //events.setIframeContent()
    
    return ctrl
});
