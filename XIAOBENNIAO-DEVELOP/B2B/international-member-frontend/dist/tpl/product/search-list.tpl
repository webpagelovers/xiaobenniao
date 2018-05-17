<html><head></head><body><div style="margin-top: -108px;">
    <div style="background: url('images/productList_p.jpg') no-repeat center center;height:432px" class="js-searchListImg">
        <!--<p class="colff f44 Raleway tac pt68 bold" data-i18n="searchList_Findtheright"></p>-->
        <!--<p class="colff f35 Raleway tac mt40" data-i18n="searchList_SearchAmong"></p>-->
        <div class="innerContent pt30">
            <p class="colff f35 Raleway pt165 bold ml210">FIND THE RIGHT PRODUCTS QUICKLY AND EASILY</p>
            <p class="colff f28 Raleway ml210">Search among millions of products</p>
        </div>
    </div>
    <div class="innerContent mh480 por" style="margin-top: -150px">
        <div class="w88p center h140 bgcff mt75" style="border:1px solid #e8e8e8;box-shadow: 3px 3px 2px #ccc">
            <label class="searchBox cccBorder br5 disib h45 lh45 index-searchBox" style="margin:47px 45px; width: 63%">
                <input class="js-searchVal br5 h45 lh45" type="text" placeholder="Search product keywords">
                <a class="js-searchBtn ls2 col66 bgcOran colff borderLft h45 lh45" style="width:130px;border-radius: 0 5px 5px 0">Search</a>
            </label>
            <span class="f20 colcc va60 ml14">OR</span>
            <a href="" target="_blank" class="js-buttonRFQ f22 default_button w220 curp poa mt50 ml60">Submit RFQ</a>
        </div>
        <div class="eeeBorder bgcff mt20 tac js-hotWords w97p ml10">
            <h2 class="col66 f18 mt30 mb30">Hot Search Words</h2>
            <p class="searchHot por js-hotWord"> </p>
        </div>

        <div class=" bgcff mt20 ">
            <div class="js_tabPannel1">
                <div class="tab_btn">
                    <ul class="fix fL none">
                        <li class="active" tabchangeinfo="tabAll">
                            <a href="javascript:;">全部用户</a>
                            <span class="tab_line"></span>
                        </li>
                    </ul>
                </div>
                <p class="f16 col66 js-total-num ml10 displayNone">
                    <span>View</span>
                    <span class="js-view-num"> </span>
                    <span>Product(s) Below</span>
                </p>
                <div class="tab_content js-tabContent">
                    <div class="listWrap">
                        <div class="screen_search_box fix js-searchbox none"></div>
                        <div class="operation_btn js-operation"></div>
                        <div class="table_main js-datagrid"></div>
                        <p class="js-recommend-num f16 col66 mt30 ml10"> </p>
                        <ul class="productList disib js-searchRecommend " style="padding-left: 10px"> </ul>
                        <div class="searchList papogation js-pagination pagination displayNone"> </div>
                        <div class="js-searchRecommendNo displayNone">
                            <div class="eeeBorder bgcff mt_20  w97p ml10 h140 tac lh146">
                                <span class="mb30 f16 col66 inlineb ml20 ">If you have demand for this product, try to send these requirements to our suppliers.</span>
                                <a href="" target="_blank" class="js-buttonRFQ f16 col66 disib curp search-no-result h38 lh38 lh40 w180 ml20" style="border: 1px solid #e6e6e6">Submit RFQ</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="background: url('images/productListBanner2_p.jpg') no-repeat center  center;height:256px" class="mt30 js-productListBanner2Img">
            <p class="f35 colff tac pt40">Our advanced search function</p>
            <p class="f35 colff tac">will help you find the right products</p>
            <p class="f35 colff tac">quickly and easily</p>
        </div>
    </div>


</div>
<!--搜索结果-->
<script type="text/html" class="js-search-searchList-tpl">

    <li>
        <a data-href="id" data-format="hrefFormater" data-format-target="href">
            <div class="imgWrap" style="width:270px;height:270px;display: table-cell;vertical-align: middle">
                <img  data-src="images" data-format-target="src" data-alt="productTitle" data-format="imgFormater" class="disib" style="max-width:270px;" />
            </div>
            <p data-content-text="productTitle" data-title="productTitle"> </p>
        </a>
    </li>
</script>
<!-- 关联搜索 -->

<script type="text/html" class="js-search-recommendList-tpl">
<li>
    <a data-href="id" data-format="hrefFormater" data-format-target="href">
        <div class="imgWrap" style="width:270px;height:270px">
            <img  data-src="images" data-format-target="src" data-alt="productTitle" data-format="imgFormater" class="disib" style="max-width:270px;" >
        </div>
        <p data-content-text="productTitle" data-title="productTitle"> </p>
    </a>
</li>
</script>

</body></html>