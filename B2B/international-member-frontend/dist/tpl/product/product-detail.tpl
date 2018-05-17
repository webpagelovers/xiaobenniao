<!--顶部--><html><head></head><body><div style="background: #265999;" class="h80 w100p">

</div>
<!--顶部-->



<div class="innerContent mh480 por mt20">


    <p class="f20 col66">
        <span style="background:#526da4;" class="colff disib pl50 pr30 h40 lh40">Request Quotations for This Product</span>
            <span class="disib" style="width:0;
    height:0;
    border-width:0 40px 40px;
    border-style:solid;
    border-color:transparent transparent #526da4;
    position:relative;left:-45px;top:12px;"></span>
        <!--<label class="por fr w400 inlineb h30 lh30">-->
        <!--<i class="iconfont icon-fangdajing poa r0 mt5 curp inlineb eeeBorder"></i>-->
        <!--<input type="text" class=" h30 lh30 f14 w300 pl10 mr40 eeeBorder" placeholder="productDetail_searcgFor">-->
        <!--</label>-->
        <label class="searchBox fr h40 lh40 w365" style="background: #ededed;margin:0">
            <span class="disib" style=" width:0;
    height:0;
    border-width:40px 40px 0;
    border-style:solid;
    border-color:#ededed transparent transparent;/*灰 透明 透明 */
    position:relative;left:-41px;"></span>
            <!--<span class="disib" style="width:0;-->
    <!--height:0;-->
    <!--border-width:0 40px 40px;-->
    <!--border-style:solid;-->
    <!--border-color:transparent transparent #fff;z-index:9999;/*透明 透明  灰*/-->
    <!--position:relative;left:-41px"></span>-->
            <input class="h40 lh40 f16 js-serarchKeyword col33 w80p" type="text" placeholder="What are you searching for?" style="background: #ededed">
                <span class="js-serarch">
                    <i class="iconfont icon-fangdajing fr curp mr10 colcc f30"></i>
                </span>
        </label>
    </p>
    <div class="bgcff mh600 pt20" style="border:1px solid #b3b3b3">

        <div class="js-productDisplay por">
            <div class="fl ml45">
                <div id="main">
                    <div class="mainSlider">
                        <div id="slider" class="flexslider flexslider-main">
                            <ul class="slides js-bigImage">
                            </ul>
                        </div>

                        <div id="carousel" class="flexslider flexslider-carousel">
                            <ul class="slides js-smallImage">
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fl ml60">
                <p class="f20 col33 mb10 inlineb w720 pb20 mt10" style="border-bottom:2px solid #ccc" data-content-text="productTitle" data-title="productTitle">Bulk buy from China,OEMt shirt factory  Bulk buy from China,OEMt Bulk buy </p>
                <div class="js-productDescription pl40">
                    <!--<div class="js-left"></div>
                    <div class="js-right"></div>-->
                </div>
                <div class="js-productDetails" style="width:730px">
                    <div class="js-productDetailsWrap displayNone">
                        <h2 class="col99 f18 mb15 mt50">Description：</h2>
                        <div class="js-productDetailsContent lh30 pl40 col99 f14 hidden"></div>
                    </div>

                </div>


                <!-- <p class="f18 col99 ls2 mt20"><span class="colOrange mr10" data-content-text="buyersPrefer">226</span>Buyers Prefer</p> -->
                <p class="poa w720" style="bottom:-20px">
                    <input type="button" class="fl productDetail-defBtn js-submitButton f22 default_button w300 curp mt40 bgcOran" value="Submit Buying Request">
                <a class="js-moreButton f20 colMainBlue curp fr mt50 displayNone">Learn more></a>
                </p>


            </div>
            <div class="clear mb30"></div>
        </div>
        <div class="js-productDisplayNone displayNone f24 col99 tac mt220">Sorry，This Product is no longer available.</div>
    </div>
    <div class=" bgcff mt20 ">
        <p class="col66 tac f35 pt30 mb34 js-prompt-mayAlso">
            <span class="col99 f20">——————————————</span>
            <span class="ml90 mr90 ">You may also be interested in</span>
            <span class="col99 f20">——————————————</span>
        </p>
        <p class="col66 tac f35 pt30 mb34 js-prompt-Buyerslike displayNone">
            <span class="col99 f20">——————</span>
            <span class="ml90 mr90  ">Buyers like you are purchasing these hot products</span>
            <span class="col99 f20">——————</span>
        </p>
        <!--<p class="f20 col66 h45 lh45 pl30 cccBorder" style="border-bottom:none">You may also be interested in</p>-->
        <ul class="productList disib js-wrapList pl10"> </ul>
        <ul class="productList disib js-searchRecommendNo displayNone pl10"> </ul>
        <!--<table border="1"  style="border-color:#ccc;" class="productTableList w100p" bordercolor="#ccc" cellpadding="30">
        </table>-->
    </div>
    <div style="background: url('images/productDetailBanner.jpg') no-repeat center  center;height:242px" class="mt50">
        <p class="f35 colff tac pt40 ls2">The Safest Place for Global Trade</p>
        <p class="f35 colff tac ">Find suppliers and trade services you can trust</p>
        <p class="tac"><input type="button" class="js-postButton f22 default_button w300 curp mt40 bgcOran " value="Post Buying Request"></p>
    </div>
</div>

<!-- 产品列表模板 -->
<script type="text/html" class="js-product-productList-tpl">
<li>
    <a data-href="id" data-format="hrefFormater" target="_blank" data-format-target="href">
        <div class="imgWrap" style="width:270px;height:270px;display: table-cell;vertical-align: middle">
            <img  data-src="images" data-format-target="src" data-format="imgFormater" class="disib" style="max-width:270px;max-height:270px;" >
        </div>
        <p data-content-text="productTitle" data-title="productTitle"> </p>
    </a>
</li>
</script>

<!-- 产品关联推荐无结果时 -->
<script type="text/html" class="js-search-searchList-recommend-tpl">
<li>
    <a data-href="commodityId" data-format="hrefFormater" data-format-target="href">
        <div class="imgWrap" style="width:270px;height:270px;display: table-cell;vertical-align: middle">
            <img  data-src="imgUrl" data-format-target="src" data-alt="prodNameFormater" data-format="RecommendImgFormater" class="disib" style="max-width:270px;max-height:270px;">
        </div>
        <p data-content-text="title" data-title="title" data-format="prodNameFormater"></p>
    </a>
</li>

</script>
<div style="display: none;" class="js-layer">
    <a type="button" class="poa js-close colff curp f24" style="right: 30px">X</a>
    <div id="layerMain" class="text-center">
        <div class="layerSlider inlineb js-center">
            <div id="layerSlider" class="flexslider flexslider-main">
                <ul class="slides js-bigImage">
                </ul>
            </div>

            <div id="layerCarousel" class="flexslider flexslider-carousel layer-flexslider-carousel">
                <ul class="slides js-smallImage" style="visibility: hidden">
                </ul>
            </div>
        </div>
    </div>
</div>

<div style="display: none;" class="js-layer-learn-more">
    <a type="button" class="poa js-close colff curp f24" style="right: 30px">X</a>
    <div id="layerMainLearnMore" class="text-center">
        <div class="inlineb ver_top inlineb tal layer-flexslider-right js-layer-flexslider-right js-center" style="width: 950px;overflow-y: auto">
            <p class="mb10"><label class="inlineb f20 mr10 colff ml10">Product Name:</label></p>
            <span class="block colcc f16 ml35 mb30" style="width: 885px" data-content-text="productTitle"></span>
            <p class="mb10 js-details-content"><label class="inlineb f20 mr10 colff ml10">Quick Details:</label></p>
            <div class="ml35 mb30 colcc f16 js-details-content"><ul class="colcc js-details" style="width: 885px"></ul></div>
            <p class="mb10 js-description-content"><label class="inlineb f20 mr10 colff ml10">Description:</label></p>
            <span class="block colcc f16 ml35 mb30 js-description js-description-content" style="width: 885px"></span>
        </div>
    </div>
</div>
</body></html>