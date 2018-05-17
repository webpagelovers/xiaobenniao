<div class="w100p commonShadow bgcff">
    <div class="nav clear center" style="width:937px">
            <img src="../../images/logo2.png" alt="Weintrade" class="mt11"/>
    </div>
</div>
<form class="js-additional-form">
<div class="center bgcff mt22 pt50 pb70" style="width:937px;">
    <div style="background: url('images/addInformation.png')" class="h50"></div>
    <div class="bgcf1 w400 center mt50 js-represent-box" style="padding:8px 10px">
        <p class="f12 col7f mb5 lh16">If you represent a trading company or a factory, please tell us for getting more accurate service. If you are a freelance agent, please ignore this and fill in the basic information directly.</p>
        <p class="f12 col7f mb15 lh20">如果您代表贸易公司或工厂进行业务操作，请确认下面两个选项，以便于获取更有针对性的服务；如果是个体代理，请忽略本部分，直接进行基础信息填写。</p>
        <div class="mb10">
            <input type="checkbox" class="va15 ml10 js-represent" style="width:16px;height:16px" data-property-name="represent" data-control-type="TextBox" value="0">
            <label for="" class="disib f14 col24 ml14 lh20">You represent a trading company or a factory <br>(您代表贸易公司或工厂)</label>
        </div>
        <div class="part-time-agent">
            <input type="checkbox" class="va15 ml10" style="width:16px;height:16px" data-property-name="isPartTime" data-control-type="TextBox" value="0">
            <label for="" class="disib f14 col24 ml14 lh20">Will you work as a part-time agent<br>(您是否考虑从事兼职代理)</label>
        </div>
    </div>
    <div class="h1 bgc7f7f7f mt50 center w91p"></div>


    <p class="f20 colGreen mt50 mb28 ml265 bold">Basic Information</p>
    
    <div class="pl105">
        <div class="mb28">
            <span class="f14 mr15 tar w140 disib">* Location（地点）</span>
            <div class="inlineb ">
                <span class="f16 col66  js-dialCode" style="position: absolute;margin-left: 52px;margin-top: 11px;z-index: 10;"></span>
                <input type="tel" id="phone"  class="br3 h34 lh34 shadow-input w40">
                <div class="disib por ml14">
                     <input type="text" class="br3 h34 lh34 shadow-input w310 ml0" placeholder="agent-additionalInfo-city-placeholder" name="location" maxlength="128" data-property-name="location" data-control-type="TextBox">                    
                </div>
            </div>
        </div>
        <div class="mb28 js-category">
            <span class="f14 mr15 tar disib w140">* Category（品类）</span>
            <div class="inlineb por">
                <input type="text" class="br3 h34 lh34 shadow-input w215 js-category-val" maxlength="32">
                <a class="addInfo-category-addBtn disib f20 tac ml10 js-add-category curp va_2">+</a>
                <input type="hidden" name="category" class="js-category-hidden-val" />
            </div>
            <div class="mt30 ml124 w64p js-category-html"> </div>
            <label class="js-category-error redFont"></label>
        </div>
        <div class="mb30">
            <span class="f14 mr15 tar w140 disib vat">* Language（语言）</span><span class="f14 va_5">Please choose the languages which you can use in work:</span>
            <div class="ib por disib ml175 mt15" style="width: 75%"  data-property-name="language" data-control-type="CheckboxBox"></div>
            <input type="text" class="br3 h34 lh34 shadow-input w420 ml150 mt20 none languageInput" maxlength="32" data-property-name="languageInput" data-control-type="TextBox" placeholder="agent-additionalInfo-language-placeholder">
        </div>
        <div class="mb30">
            <span class="f14 mr15 tar w190 disib" style="margin-left: -50px">* Working Status（工作性质）</span>
            <div class="perInfo  disib" data-property-name="workCondition" data-control-type="RadioBox">
                <div class="disib">
                    <input type="radio" name="ws" style="width:18px;height:18px" checked value="1">
                    <label for="" class="ml14 f14 js-pass" >Employee（兼职代理）</label>
                </div>
                <div class="disib ml10">
                    <input type="radio" name="ws" style="width:18px;height:18px" value="0">
                    <label for="" class="ml14 f14 js-noPass1">Freelancer（自由职业者）</label>
                </div>
            </div>
        </div>
        <div class="mb30 por">
            <span class="f14 mr15 tar w160 disib vat" style="margin-left: -20px">* Expected Commission<br>（期望佣金）</span>
            <div class="por inlineb">
                <textarea cols="30" rows="10" style="border: solid 1px #d1d1d1;padding:10px" class="br3 f14 col7f w400 insetShadow" placeholder="agent-additionalInfo-expected-commission" data-property-name="expCommission" name="expCommission" data-control-type="TextBox" maxlength="10000"></textarea>
            </div>
        </div>
        <div class="mb30 por">
            <span class="f14 mr15 tar w160 disib vat" style="margin-left: -20px">* Self-introduction<br>（个人简介）</span>
            <div class="por inlineb">
                <textarea cols="30" rows="10" style="border: solid 1px #d1d1d1;padding:10px" class="br3 f14 col7f w400 insetShadow" placeholder="agent-additionalInfo-self-introduction" data-property-name="selfIntroduction" name="selfIntroduction" data-control-type="TextBox" maxlength="10000"></textarea>
            </div>
        </div>
        <div class="agent-additional-sep">
            <div class="h1 bgc7f7f7f mt65 center w91p"></div>
            <p class="f20 colGreen mt50 mb28 ml255 bold">Personal Information</p>
            <!-- <div class="bgcf1 w400 center mb28" style="padding:8px 10px">
                <p class="f12 col7f mb5 lh20">Please fill in your name and ID correctly, which will be used for the payment collection. The modification is not allowed after submission. We will not, without your permission, sell, publish or share information you entrust to us that identifies you or any person.</p>
                <p class="f12 col7f mb15 lh20">请填写您的真实姓名和身份证号码，改信息将用于支付佣金费用环节，一旦填写将不允许更改。未经您的许可，我们不会将该信息泄漏给任何人</p>
            </div> -->
        </div>
        
        <!-- <div class="mb28 por">
            <span class="f14 mr15 tar w140 disib">* Name（姓名）</span>
            <div class="inlineb por">
                <span class="f16 col66  js-dialCode poa" style="margin-left: 52px;margin-top: 11px;z-index: 10;"></span>
                <input type="tel" class="br3 h34 lh34 shadow-input w410" placeholder="agent-additionalInfo-personInfo-name" data-property-name="personalName" name="personalName" data-control-type="TextBox">
            </div>
        </div> -->
        <!-- <div class="mb28 por">
            <span class="f14 mr15 tar w180 disib" style="margin-left: -40px">* ID Number（身份证号）</span>
            <div class="inlineb por">
                <span class="f16 col66  js-dialCode poa" style="margin-left: 52px;margin-top: 11px;z-index: 10;"></span>
                <input type="tel" class="br3 h34 lh34 shadow-input w410" placeholder="agent-additionalInfo-personInfo-id" data-property-name="personalId" name="personalId" data-control-type="TextBox">
            </div>
        </div> -->
        <div class="bgcf1 w400 ml160 mb28" style="padding:8px 10px">
            <p class="f12 col7f mb5 lh20">Please leave your social media accounts which will be helpful for us to contact you.</p>
            <p class="f12 col7f lh20">请提供其他联系方式，使我们在有业务需求时，更方便的联系到您</p>
        </div>
        <div class="mb28">
            <span class="f14 mr15 tar w140 disib">QQ</span>
            <div class="inlineb">
                <span class="f16 col66 js-dialCode poa" style="margin-left: 52px;margin-top: 11px;z-index: 10;"></span>
                <input type="tel" class="br3 h34 lh34 shadow-input w410" data-property-name="qq" data-control-type="TextBox" maxlength="128">
            </div>
        </div>
        <div class="mb28">
            <span class="f14 mr15 tar w140 disib">WeChat</span>
            <div class="inlineb">
                <span class="f16 col66 js-dialCode poa" style="margin-left: 52px;margin-top: 11px;z-index: 10;"></span>
                <input type="tel" class="br3 h34 lh34 shadow-input w410" data-property-name="wechat" data-control-type="TextBox" maxlength="128">
            </div>
        </div>
        <div class="mb28">
            <span class="f14 mr15 tar w140 disib">Linkedin</span>
            <div class="inlineb">
                <span class="f16 col66 js-dialCode poa" style="margin-left: 52px;margin-top: 11px;z-index: 10;"></span>
                <input type="tel" class="br3 h34 lh34 shadow-input w410" data-property-name="linkedin" data-control-type="TextBox" maxlength="128">
            </div>
        </div>
        <div class="">
            <span class="f14 mr15 tar w140 disib">FaceBook</span>
            <div class="inlineb">
                <span class="f16 col66 js-dialCode poa" style="margin-left: 52px;margin-top: 11px;z-index: 10;"></span>
                <input type="tel" class="br3 h34 lh34 shadow-input w410" data-property-name="facebook" data-control-type="TextBox" maxlength="128">
            </div>
        </div>
    </div>
    <a class="mt50 default_button h44 lh45 w420 ml265 curp disib tac js-additional-submit f16" type="button">NEXT</a>
</div>
</form>
<div class="h70 bgc7f7f7f w100p colff mt60">
    <p class="tac pt40">咨询热线：010-81281397<span class="ml20">京ICP备 17010966 号</span></p>
</div>