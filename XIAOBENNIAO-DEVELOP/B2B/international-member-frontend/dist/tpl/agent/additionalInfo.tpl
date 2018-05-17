<html><head></head><body><div class="w100p commonShadow">
    <div class="nav clear center" style="width:937px">
        <a class="js-home js-logo inlineb mt11" href="/" title="Weintrade">
            <img src="../../images/indexLogo.png" alt="Weintrade">
        </a>
    </div>
</div>
<div class="center bgcff mt22 pt50" style="width:937px;">
    <div style="background: url('images/addInformation.png')" class="h50"></div>
    <form class="pl136 pt50 pb95 js-additional-form">
        <div class="mb30 ">
            <span class="f14 mr15 tar w110 disib">* Location</span>
            <div class="inlineb por">
                <span class="f16 col66  js-dialCode" style="position: absolute;margin-left: 52px;margin-top: 11px;z-index: 10;"></span>
                <input type="tel" id="phone" class="br5 h36 lh36 shadow-input w40">
                <input type="text" class="br5 h36 lh36 shadow-input w310" placeholder="City" name="location" maxlength="128" data-property-name="location" data-control-type="TextBox">
                <label class="js-error redFon2t "></label>
            </div>
        </div>
        <div class="mb30 js-category ">
            <span class="f14 mr15 tar w110 disib">* Category</span>
            <div class="inlineb por">
                <input type="text" class="br5 h36 lh36 shadow-input w215 js-category-val" maxlength="32">
                <a class="addInfo-category-addBtn disib f20 tac ml10 js-add-category curp">+</a>
                <input type="hidden" name="category" class="js-category-hidden-val">
            </div>
            <div class="mt30 ml124 w64p js-category-html"> </div>
            <label class="js-category-error redFont"></label>
        </div>
        <div class="mb30">
            <span class="f14 mr15 tar w110 disib vat">* Language</span>
            <div class="ib por disib" style="width: 75%" data-property-name="language" data-control-type="CheckboxBox"></div>
            <label class="js-error redFont "></label>
        </div>
        <div class="mb30">
            <span class="f14 mr15 tar w110 disib">* Working Status</span>
            <div class="perInfo  disib" data-property-name="workCondition" data-control-type="RadioBox">
                <div class="disib">
                    <input type="radio" name="ws" style="width:18px;height:18px" checked value="1">
                    <label for="" class="ml14 f14 js-pass">Freelancer</label>
                </div>
                <div class="disib ml10">
                    <input type="radio" name="ws" style="width:18px;height:18px" value="2">
                    <label for="" class="ml14 f14 js-noPass1">Employee</label>
                </div>
            </div>
        </div>
        <div class="mb30">
            <span class="f14 mr15 tar w110 disib">Company Name</span>
            <div class="inlineb">
                <input type="text" name="company" maxlength="128" placeholder="What company are you with?" class="br5 h36 lh36 shadow-input w410" data-property-name="company" data-control-type="TextBox">
            </div>
        </div>
        <div class="mb30">
            <span class="f14 mr15 tar w110 disib">Years of Working</span>
            <div class="inlineb">
                <input type="text" name="workingYears" placeholder="How long have you been working on inter national trade?" maxlength="128" class="br5 h36 lh36 shadow-input w410" data-property-name="workingYears" data-control-type="TextBox">
        </div>
        </div>
        <div class="mt50 mb30 ml130 bgcf1 w390 lh20 col7f" style="padding:10px 15px">
            Please fill in your name and ID correctly, which will be used for the payment collection.  The modification is not allowed after submission.
        </div>
        <div class="mb30">
            <span class="f14 mr15 tar w110 disib">* Name</span>
            <div class="inlineb por">
                <input type="text" maxlength="128" class="br5 h36 lh36 shadow-input w410" name="idCardName" data-property-name="personalName" data-control-type="TextBox">
                <label class="js-error redFont"></label>
            </div>
        </div>
        <div class="mb30">
            <span class="f14 mr15 tar w110 disib">* ID Number</span>
            <div class="inlineb por">
                <input type="text" class="br5 h36 lh36 shadow-input w410" name="idCardId" data-property-name="personalId" data-control-type="TextBox">
                <label class="js-error redFont  "></label>
            </div>
        </div>
            <a class="white-green-btn h44 lh45 w420 ml124 curp disib tac js-additional-submit" type="button">NEXT</a>
    </form>
</div>
<div class="h70 bgc7f7f7f w100p colff mt60">
    <p class="tac pt40">Copyright © 2017 WEINTRADE.COM ALL RIGHTS RESERVED</p>
</div></body></html>