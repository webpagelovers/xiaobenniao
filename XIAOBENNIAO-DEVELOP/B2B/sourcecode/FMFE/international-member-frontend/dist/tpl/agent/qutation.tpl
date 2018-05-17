<html><head></head><body><div class="js-qutationWrap">
    <div class="w100p commonShadow">
        <div class="nav clear center" style="width:937px">
            <a class="js-home js-logo inlineb mt11" href="/" title="Weintrade">
                <img src="../../images/indexLogo.png" alt="Weintrade">
            </a>
            <!--<span class="f16 fr mt35">Already have an account? <a href="" class="colGreen">Log In</a></span>-->
        </div>
    </div>
    <div class="center bgcff mt22 pt50" style="width:937px;">
        <div style="background: url('images/submitQuotation.png')" class="h50"></div>
        <div style="padding:30px 30px 50px 30px">
            <p class="f16 mb25">ID:<span data-content-text="sourcingRequestId"></span></p>
            <p class="f28 bold mb40" data-content-text="productName"></p>
            <div class="disib lh24">
                <p><span class="f16 w150 disib">Date of Inquiry:</span><span class="f16" data-content-text="postTime"></span></p>
                <p><span class="f16 w150 disib">Quantity:</span><span class="f16" data-content-text="quantity"></span></p>
                <p><span class="f16 w150 disib">Destination:</span><span class="f16" data-content-text="destination"></span></p>
            </div>
            <div class="disib ml222 lh24">
                <p><span class="f16 w120 disib">Name:</span><span class="f16">**************</span></p>
                <p><span class="f16 w120 disib">Email:</span><span class="f16">**************</span></p>
                <p><span class="f16 w120 disib">Phone:</span><span class="f16">**************</span></p>
            </div>
            <p class="f16 mt40 mb5">Detail:</p>
            <p class="f16" data-content-text="details"></p>
            <div class="mt40 h1 bgc7f7f7f mb30"></div>
            <div class="js-qutationUploadDataWrap" style="display: none">

            </div>
        </div>
    </div>
    <div>
        <div class="center bgcff mt16 js-information" style="width:937px;display: none">
            <div style="padding:30px 30px 50px 30px">
                <p class="f16 bold">Additional Information:</p>
                <div class="js-additionalInformationWrap">

                </div>
            </div>
        </div>
        <div class="mt40 tac js-showBtn"><p class="colGreen f14 bold curp js-rm">Read More</p><span class="disib curp js-rmbg" style="width:18px;height:18px;background: url('images/quotationArror.png') 18px 18px"></span></div>
    </div>
    <form class="center bgcff mt16 js-qutationForm" style="width:937px;">
        <div style="padding:30px 30px 50px 30px">
            <p class="f16 bold mb40">Please Check Your Information</p>

            <div class="mb30 por">
                <p class="f14 mb5">Name *</p>
                <input type="text" name="name" maxlength="128" placeholder="Please enter Name" class="shadow-input br5 h36 lh36 w300" data-property-name="name" data-control-type="TextBox">
                <span class="poa l0 b_20"><label class="js-error"></label></span>
            </div>
            <div class="mb30 por">
                <p class="f14 mb5">Phone *</p>
                <input type="text" maxlength="11" name="phone" placeholder="Please enter Phone" class="shadow-input br5 h36 lh36 w300" data-property-name="phone" data-control-type="TextBox">
                <span class="poa l0 b_20"><label class="js-error"></label></span>
            </div>
            <div class="mb30 por">
                <p class="f14 mb5">Email *</p>
                <input type="text" name="email" maxlength="60" placeholder="Please enter Email" class="shadow-input br5 h36 lh36 w300" data-property-name="email" data-control-type="TextBox">
                <span class="poa l0 b_20"><label class="js-error"></label></span>

            </div>
            <div class="mb30">
                <p class="f14 mb5">Quote Info</p>
                <!--富文本-->
                <script id="modules.agent.qutation" style="height:400px; width:100%" name="content" type="text/plain"></script>
                <!--富文本-->
            </div>
            <div>
                <p class="f14 mb20">Attachment <span class="col7f ml25">(Please fill in the excel template <a class="colGreen bold js-templDownLoad">LPG Cylinders.xls</a> , and upload the form)</span></p>
                <!--<div class="f100 curp lh50 cold1 disib">+</div>-->
                <div class="disib mr30 por">
                    <div class="js-webUpload" style="min-height:90px;">
                        <div data-property-name="sourcingRequestQuoteAttachments" data-control-type="WebUpload">
                            <div class="queueList poa t0">
                                <div class="filePicker f100 curp lh50 cold1 disib">+</div>
                            </div>
                            <div class="js-wrapData disib w530 hauto pl136"></div>
                            <span><label class="js-error redFont w210 poa l0 b_16"></label></span>
                        </div>
                    </div>
                </div>
            </div>
            <p class="tac mt35"><input type="button" value="SUBMIT" style="cursor: pointer;" class="white-green-btn w420 f16 h44 lh45 js-submit"></p>
        </div>
    </form>

    <div class="w100p h100p js-hiddenWrap t0" style="z-index:999;background: rgba(0,0,0,0.5);display: none;position: fixed">
        <div class="poa commonShadow br5 bgcff z99" style="width: 480px; height: 173px;left:50%;margin-left: -240px;top:300px;">
            <p class="f24 col24 tac mb25 mt45 bold">Submit Successfully</p>
            <p class="tac"><input type="button" class="default_button f16 bold h44 lh45 curp w150 js-ok" value="OK"></p>
        </div>
    </div>

</div>
<div class="h70 bgc7f7f7f w100p colff mt60">
    <p class="tac pt40">Copyright © 2017 WEINTRADE.COM ALL RIGHTS RESERVED</p>
</div>

<!-- additionalInformation展示模板 -->
<script type="text/html" class="js-agent-additionalInformationData-tpl">
    <div class="js-addInfo">
        <p class="f16 mt40" data-content-text="postTime"></p>
        <p class="f16 mt40">Here is something add for further info : What‘s the deadline of this RFQ</p>
        <div class="none js-additionalInfoFrameHidden" data-content="content"></div>
        <iframe class="f16 col44 js-additionalInfoFrame" frameborder="no" border="0" style="padding: 0px; width: 100%;"></iframe>
        <div class="js-wrapImg"></div>
        <div class="h1 mt30 bgc7f7f7f"></div>
    </div>
</script></body></html>