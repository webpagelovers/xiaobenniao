<html><head></head><body><form action="" style="width:440px" class="form  center mt100 mb200 ">
        <div class="f24 tac">Reset Password</div>
        <p class="mt20 f14 colGrayBar lh18">Enter the email address linked with your account, and we'll email<br> you a link to reset your password.</p>
        <div class="mb28 mt40">
            <input type="text" class="cccBorder br5 f18 h34 lh36 pl10 w97p" placeholder="!!!Error!!!" name="email" data-property-name="email" data-control-type="TextBox">
        </div>
        <div class="mb53">
            <input type="text" class="cccBorder br5 w190 f18 h34 lh36 pl10 error" style="width: 232px; border-color: rgb(153, 51, 51);" placeholder="!!!Error!!!" name="checkCode">
            <a href="javascript:void (0)"><img src="http://dev.weintrade.com/api/general/ImageVerificationCode/create/1504508035807" id="code" class="intValidateImg ml10 curd js-changeCode"></a>
                        <a href="javascript:void (0)" class="js-changeCode" style="margin-left: 12px;"><img src="images/captcha.png" class="va_10  cup"></a>
        </div>
        <input type="button" class="default_button f18 w100p  js-sendEmailSubmit" value="Send Reset Email">
</form></body></html>