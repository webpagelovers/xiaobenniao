    <h3 class="f32 ml30 colf1 ml30 js-request-header displayNone mt40">Inquire Form</h3>
    <form class="pb70 pt25">
        <div class="mb25 js-box por">
            <span class="disib f14 tar w130">*  Product Name</span>
            <input type="text"  class="shadow-input w410 pl10 h34 lh34 br3 ml14" name="productName" maxlength="128" data-property-name="productName"
                   data-control-type="TextBox">
        </div>
        <div class="mb25 ">
            <span class="disib f14 tar w130">Quantity</span>
            <input type="text" class="shadow-input w410 pl10 h34 lh34 br3 ml14" name="quantity" maxlength="128" data-property-name="quantity"
                   data-control-type="TextBox">
        </div>
        <div class="mb25 js-box por">
            <span class="disib f14 tar w130 vat">* Details</span>
            <textarea class="br3 insetShadow ml14 w420 d1Border f14 col7f js-description" data-property-name="details" data-control-type="TextBox" name="details" 
                      maxlength="10000" cols="30" rows="7"  placeholder="promotion_category_Detail_placeholder"></textarea>
            <span style="bottom: -32px; left: 95px; width: 405px; border-width: 0px 1px 1px; border-style: solid; border-color: rgb(204, 204, 204);display: none;" class="pl10  col99 pr10 poa ml94 displayNone inlineb bgcf5 h34 lh32 tal" id="buyingRequestDescriptionInfo">You can also continue to enter <span class="redFont">0</span> characters</span>
            <label class="js-error"></label>          
        </div>
         <div class="h45" id="myUpload" >            
            <div data-property-name="productImage" data-control-type="Upload" class="por fl tal">
                <div class="js-wrapData pt7"></div>
                <div class="showUpload mb15">
                    <label class="block f16 tar fl w125 pt7 pr30">File</label>
                    <div class="fl">
                        <a class="f16 myFilePicker pr request col666 curp"></a>
                    </div>
                    <div class="fr ml10 mt5 col666">
                        <span class="f12 block mb10">You can upload picture/video/document/ in any normal</span>
                        <span class="f12 block">format,and the file size should be no more than 10MB</span>
                    </div>
                </div>
                <span>
            </div>
        </div>

        <div class="clear"></div>
        <div class="mb25 mt25">
            <span class="disib f14 tar w130">Name</span>
            <input type="text" class="shadow-input w410  pl10 h34 lh34 br3 ml14" name="name" maxlength="128" maxlength="19"
                   data-property-name="name" data-control-type="TextBox">
        </div>
        <div class="mb28 js-box por">
            <span class="disib f14 tar w130">* E-mail</span>
            <input type="text" class="shadow-input w410 pl10 h34 lh34 br3 ml14" name="email" maxlength="128"
                   data-property-name="email" data-control-type="TextBox">
        </div>
        <div class="mb30">
            <span class="disib f14 tar w130 mr15 ">Phone Number</span>
            <p class="disib shadow-input w410 h34 lh34 br3 bgcff js-change-border commonRequest-countrySelect">
                <span class="f16 col66  js-dialCode" style="position: absolute;margin-left: 52px;margin-top: 1px;z-index: 10;"></span>
                <input type="tel" id="phone" class="w30 noBorder " style="background: none;" />
                <input  type="text" name="phone" maxlength="128" class="w305 ml35" data-property-name="phone" data-control-type="TextBox" style="background: none;">
            </p>
            
        </div>
        <input type="button" class="default_button w420 f16 ml150 js-submit" value="SUBMIT">
    </form>
    <div style="display: none" class="js-layer">
        <div class="mt30 tac">
            <p class="col33 mb25" style="font-size:38px!important;font-weight: bold">Submit Successfully</p>
            <p class="f16 col66 mb10">Thank you for posting your request.We will reply you in 24 hours.</p>
            <!-- <p class="f16 col66 mb25">we will feedback in 12 hours</p> -->
            <input type="button" value="Jump Now" class="w100 mt25 js-close" style="height:40px;line-height:32px;color:#00ad36;border: 1px solid #00ad36;background-color: white;">
            <p class="f16 colGrayBar mt20">Jump to home page in <span id="timer">15</span> sec.</p>
        </div>
    </div>
