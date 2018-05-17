<html><head></head><body><div>
    <a class="js-home ml20"><img src="images/indexLogo.png" class="va_15 w185 mt10"></a>
    <label class="searchBox h40 lh40 fr" style="border:1px solid #b7b6b6;width:430px; margin-right: 20px" id="buyingRequest-searchBox">
        <input class="js-serarchKeyword h40 lh40 f16" type="text" placeholder="Search your product keywords">
        <a class="js-serarch ls2 col66 h40 lh40 f16" target="_blank" style="background: #f2f2f2">Search</a>
    </label>
    <div class="clear"></div>
    <h1 class="f32 tac js-title" style="color:#5567d1">Tell Us Your Buying Request</h1>
    <form class="js-form">
        <div style="background: url('images/registerBG.png') no-repeat center center;height:606px" class="mt40">
            <div class="fl ml200 tac mt30">
                <p class="Raleway bold f18 col66">Attach Photo</p>
                <div data-property-name="productImage" data-control-type="Upload">
                    <div class="mt30 mb30"><img src="images/resPhoto.png" class="w160 h160"></div>
                    <a style="color:#4c77cd;cursor:pointer" class="f16 filePicker"></a>
                    <span><label class="js-error redFont"></label></span>
                </div>
                <p class="Raleway bold f16 col66 mt50 mb10">(Only gif , png , jpeg , jpg file types</p>
                <p class="Raleway bold f16 col66">are supported and maximum file size is no more than 2 MB)</p>
            </div>
            <div class="fr mr230 mt30">
                <label class="Raleway col66 f18 bold">The Product You Want to Buy*</label>
                <p class="mt10 mb30 por">
                    <input type="text" name="productName" class="w400 lh36 h34 pl10 f18" style="border:1px solid #827e7b" maxlength="250" data-property-name="productName" data-control-type="TextBox">
                    <label class="js-error redFont poa l0 b_16"></label>
                </p>
                <label class="Raleway col66 f18 bold">keywords</label>
                <div class="mt10 mb30">
                    <div class="por inlineb">
                        <input type="text" name="keyword" class="w120 lh36 h34 pl10 f18" style="border:1px solid #827e7b" maxlength="125" data-property-name="keyword" data-control-type="TextBox">
                        <label class="js-error redFont poa l0 b_30 h30"></label>
                    </div>
                    <div class="por inlineb">
                        <input type="text" name="keyword1" class="w120 lh36 h34 pl10 f18" style="border:1px solid #827e7b" maxlength="125" data-property-name="keyword1" data-control-type="TextBox">
                        <label class="js-error redFont poa l0 b_30 h30"></label>
                    </div>
                    <div class="por inlineb">
                        <input type="text" name="keyword2" class="w120 lh36 h34 pl10 f18" style="border:1px solid #827e7b" maxlength="125" data-property-name="keyword2" data-control-type="TextBox">
                        <label class="js-error redFont poa l0 b_30 h30"></label>
                    </div>
                </div>
                <label class="Raleway col66 f18 bold">Required Quantity*</label>
                <div class="mt10 mb20">
                    <div class="por inlineb">
                        <input type="text" name="quantity" class="w230 lh36 h34 pl10 f18" style="border:1px solid #827e7b" maxlength="19" placeholder="Enter product quantity" data-property-name="quantity" data-control-type="TextBox">
                        <label class="js-error redFont poa l0 b_16"></label>
                    </div>
                    <div class="por inlineb">
                        <input type="text" name="unit" class="w150 lh36 h34 pl10 f18" style="border:1px solid #827e7b" maxlength="19" placeholder="Unit" data-property-name="unit" data-control-type="TextBox">
                        <label class="js-error redFont poa l0 b_16"></label>
                    </div>
                </div>
                <label class="Raleway col66 f18 bold">More Details*</label>
                <div class="mt10 por">
                    <textarea name="description" maxlength="1500" cols="30" rows="7" class="w400 js-description" data-property-name="description" data-control-type="TextBox"></textarea>
                    <span style="bottom:-31px;left:-94px;width:394px" class="pl10 col99 pr10 poa ml94 inlineb bgcf5 h34 lh32 cccBorder" id="buyingRequestDescriptionInfo">Please enter 1-1500 characters</span>
                    <span class="js-error inlineb poa tar redFont b_55 l2"></span>
                </div>
            </div>
            <div class="clear"></div>
            <input type="button" class="default_button w300 f22 Raleway bold poa l50p js-submit mt60" style="margin-left: -150px" value="Submit">
        </div>
    </form>
    <div class="js-success innerContent eeeBorder mh480 mt20  bgcff pb130 displayNone">
        <!--<p class="col66 f20 Raleway borbot bold w97p center pb10 pt10" data-i18n="submitSuccessfully_Complete">Complete Your
            RFQ</p>-->
        <div class="tac mt177">
            <img src="images/success.png" class="mr30 va27">
            <div class="disib tal">
                <span class="Raleway f42 col66 bold">Submitted successfully</span>
                <p class="tac mt10 f16 col848899">Your Buying Request has been approved. We will feedback in 12 hours.</p>
                <p class="tar mt16">
                    <a class="f16 bold col6487cd js-href">Back Homepage></a>
                </p>
            </div>

        </div>
        <!--<p class="Raleway f16 col33 mt70 fr mr30" data-i18n="submitSuccessfully_Global">Global B2B Marketplace</p>-->
        <div class="clear"></div>
    </div>
</div></body></html>