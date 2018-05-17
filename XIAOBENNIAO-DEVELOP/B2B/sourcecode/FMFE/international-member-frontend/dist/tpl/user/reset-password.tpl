<html><head></head><body><div class="js-resetPassword-wrap">
</div>
<div class="common-tpl-list js-resetPassword-tpl">
    <form action="" style="width:440px" class="form  center mt100 mb200 ">
        <div class="f24 tac">Reset Password</div>
        <p class="mt20 f14 colGrayBar lh18">Enter the email address linked with your account, and we'll email<br> you a link to reset your password.</p>
        <div class="mb28 mt40">
            <input type="text" class="cccBorder br5 f14 h34 lh36 pl10 w97p" placeholder="Email" name="email" data-property-name="email" data-control-type="TextBox">
        </div>
        <div class="mb53">
            <input type="text" class="cccBorder br5 w190 f14 h34 lh36 pl10" style="width: 232px; border-color: rgb(153, 51, 51);" placeholder="Enter the Code Shown" name="checkCode">
            <a href="javascript:void (0)"><img src="" id="code" class="intValidateImg ml10 curd js-changeCode"></a>
                        <a href="javascript:void (0)" class="js-changeCode" style="margin-left: 12px;"><img src="images/captcha.png" class="va_10  cup"></a>
        </div>
        <input type="button" class="default_button f18 w100p  js-sendEmailSubmit" value="Send Reset Email">
    </form>
</div>

<div class="common-tpl-list js-updatePassword-tpl">
<div class="w500 center mt100 mb260">
<form action="" style="width:440px" class="form">

            <div class="f24 tac">Update Password</div>
            <div class="mb30 mt45">
                <input type="text" class="cccBorder br5 f14 h34 lh36 pl10 w97p" placeholder="New Password" name="newPassword" id="password" data-property-name="newPassword" data-control-type="TextBox">
            </div>
            <div class="mb30 mt45">
                <input type="text" class="cccBorder br5 f14 h34 lh36 pl10 w97p" placeholder="Re-type Password" name="resetCode" data-property-name="resetCode" data-control-type="TextBox">
            </div>
            <input type="button" class="default_button f18 w100p  js-updatePassSubmit" value="Update Password">
</form>
</div>
</div>
<div class="common-tpl-list js-continueToLogin-tpl">
    <div class="w720 center mt100 mb350">
        <div class="f24">We emailed you a link and instructions for updating your password.</div>
        <div class="mt10 colGrayBar lh22">
            <p class="f16">It should be there momentarily. Please check your email and click the link in the message. </p>
            <p class="f16">After 4 hours, the link to update your password will expire.</p>
        </div>
        <div class="tac">
            <input type="button" class="default_button f18 w233 mt50 js-sendEmailSubmit" value="Continue To  Log In">
        </div>

    </div>
</div>
<div class="common-tpl-list js-setSuccuss-tpl">
    <div class="mt100 tac mb400">
        <div class="set_succuss_title">Your password has been modified successfully!</div>
        <input type="button" class="default_button f18 w164 mt50  js-setSuccessButton" value="Log In Now">
    </div>
</div>
<div class="common-tpl-list js-setError-tpl">
    <div class=" w750 h130 center mt100 mb400">
        <img src="images/error_prompt.jpg" class="fl">
        <div class="fr w590 mt15">
            <p class="f24">Oh, the page you are searching does not exist!</p>
            <p class="f16 colGrayBar mt10 lh22">Possible reasons are:<br>
           -  The website address you wrote in the address bar is not correct.<br>
           -  The link you clicked has expired.</p>
        </div>
        <p class="clear"></p>
        <p class="mt110 tac">
            <a href="/" class="colGreen f16">Return to main page >></a>
        </p>
    </div>
</div>

</body></html>