<!--顶部-->
<div style="background: #265999;" class="h80 w100p">

</div>
<!--顶部-->
<div class="innerContent mt20 w94p" style="width:1250px">
    <form class="js-buyRequestAtProduct-form">
        <p class="col66 f20 Raleway bold pb10 pt10 ls2">Complete Your RFQ</p>
        <div class="pb40">
            <p class="disib mr70 por w64p">
                <input type="text" class="eeeBorder h45 lh45 pl10 f16 w100p js-prodName"
                       name="productTitle" data-property-name="productTitle" data-control-type="TextBox" placeholder="buyingRequestAtProduct_prodName">
                <label class="js-error redFont poa l0 t52"></label>
            </p>
            <p class="disib por w15p">
                <input type="text" class="eeeBorder h45 lh45 pl10 f16 w100p"  placeholder="buyingRequestAtProduct_quantity"
                       name="quantity" data-property-name="quantity" data-control-type="TextBox">
                <label class="js-error redFont poa w200 l0 t52"></label>
            </p>
            <p class="disib por w15p">
                <input type="text" class="eeeBorder h45 lh45 pl10 f16 w100p ml_4"  placeholder="buyingRequestAtProduct_unit"
                       name="unit" data-property-name="unit" data-control-type="TextBox">
                <label class="js-error redFont poa w200 l0 t52"></label>
            </p>

        </div>

        <div class="bgcff eeeBorder mh600 por" style="padding:40px">
            <div>
                <div class="w200 h200 dashedCc por inlineb vat request-img-delete">
                    <div class="request-img-delete-box">
                        <span class="request-img-delete-icon">X</span>
                    </div>
                    <a class="block tac pt40 w200 h160">
                        <p class="w100 colcc f16 lh26 tac center"></p>
                    </a>
                    <img class="w200 h200 poa l0 t0 js-imgs" name="productImageDefault"
                         data-property-name="productImageDefault"
                         data-control-type="TextBox">
                </div>
                <div class="w200 h200 dashedCc por inlineb ml20 vat" name="productImage"
                     data-property-name="productImage"
                     data-control-type="Upload">
                    <a class="block tac pt40 w200 h160 curp" style="margin-bottom: -200px;">
                        <i class="iconfont icon-add f48 inlineb mb15" style="color:#526da4"></i>
                        <p class="w100 colcc f16 lh26 tac center" data-i18n="buyingRequestAtProdct_upload">Upload Attachments</p>
                        <img src="../../images/transparent.png" class="w200 h200 poa l0 t0">
                    </a>
                    <a style="color:#4c77cd;cursor:pointer" class="f16 filePicker"></a>
                    <p class="w300"><label class="js-error error js-productImage-err"></label></p>
                </div>
            </div>
            <div class="por mt20" style="height: 385px;">
                <textarea  class="eeeBorder poa l0 t0  js-description"
                           name="description" data-property-name="description" data-control-type="TextBox"
                           style="padding: 1px;height:345px;width:100%;"></textarea>
                <label class="js-error redFont poa b_16 w200" style="left:160px;bottom: 5px;"></label>
            </div>
            <p style="color:#526da4;" class="poa f22 b40">Remain <span class="js-remain">1500</span></p>
        </div>

        <input type="button" class="default_button w300 f22 mt30 js-submit" value="Submit RFQ">
    </form>
</div>
