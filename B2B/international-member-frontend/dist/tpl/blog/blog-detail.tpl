<html><head></head><body><div class="aboutPage innerContent mh480 mt40">
    <div style="width:940px;" class="fl">
        <div style="padding:28px;" class="mb20 bgcff por">
	        <p>
                <a href="/">Home</a>  >  
                <a href="./blog">Blog</a>  >  
                <a href="javascript:void(0);" id="blogDetailBreadcrumbsTitle" class="word-cut" style="max-width: 800px; cursor: default;"><%=postTitle%></a>
            </p>
            <div class="tac mt20 mb20"><img data-src="headPic" id="blogDetailHeadPic" src="<%=headPic%>" style="max-width:924px;max-height:360px;"></div>
            <p class="col44 f24 mb20 wordBreakAll" data-content="postTitle" id="blogDetailPostTitle"><%=postTitle%></p>
            <span class="col99 f14 fl mb20">
                By <span data-content="postAuthor"><%=postAuthor%></span>   |   <span data-content="postDate"></span>
            </span>
            <div class="shareBtns fr mt_5"></div>
            <div class="clear mb30" style="height:1px;background:#e4e4e4;"></div>
            <iframe class="f16 col44 blogDetailIframe" id="postContentIframe" frameborder="no" border="0"></iframe>
        </div>
        <div style="padding:28px;" class="bgcff">
            <img src="../../images/comment.png" alt="">
            <span style="color:#2896ff" class="f18 ml10 va5">Comments
                <span class="ml5">(</span><span data-content="commentsNum" id="blogDetailCommentsNum"></span><span>)</span>
            </span>
            <div id="commentsListBox">
                <div data-list="comments">
                    <div class="col99" style="padding:28px 0;border-bottom:1px solid #e4e4e4">
                        <p class="f14 mb15">
                           <span>By </span> <span data-list-commentauthor="" class="showEllipsis safari-vv disib" style="max-width: 190px;vertical-align: -3px;"> </span>  |  <span data-list-commentdate=""> </span>
                        </p>
                        <p class="f14 w97p wordBreakAll" data-list-commentcontent=""></p>
                    </div>
                </div>
            </div>
            <p class="tac"><input type="button" id="loadMoreComments" class="articleDetail-loadMoreBtn mt40 curp none" value="Load More"></p>
            <form id="commentForm">
                   <textarea rows="10" style="border:1px solid #e2e2e2" id="commentTextarea" name="commentTextarea" class="w100p hidden f16 mt60 p10" maxlength="1500" placeholder="Leave a comment,you can also type in 1500 words"></textarea>
            </form>
            <input type="button" value="Post" id="postComments" class="default_button h45 w120 lh45 f16 fr mt20 curp">
            <div class="clear"></div>
        </div>
    </div>
    <div class="fl ml14 bgcff" style="width:258px;padding:16px;">
        <h2 class="f24 col44 mt20 pb10 mb20" style="border-bottom:1px solid #e4e4e4">Hot Article</h2>
        <ul class="articleDetail-hotArticle ml20" data-list="hot">
            <li><a data-list-href="" data-list-posttitle="" style="word-break:break-word"></a></li>
        </ul>
    </div>
    <div class="clear"></div>
</div></body></html>