X.define('modules.agent._validate', function () {

    var validate = {
            rules: {
                name: {required: true},
                phone: {required: true,isDigits:true},
                email: {required: true,email: true}
            },
            messages: {
                name: {
                    required: "Please enter the Name"
                },
                phone: {
                    required: "Please enter the Phone",
                    isDigits: "Please enter the correct phone number"
                },
                email: {
                    required: "Please enter Email",
                    email: "Please enter a valid email address"
                }
            },
            onkeyup: false,
            onfocusout: function (element) {
                $(element).valid()
            },
            errorPlacement: function (error, element) {
                var elem = $(element);
                var errorWrap = element.parent().find(".js-error");
                errorWrap.html("");
                error.appendTo(errorWrap);
            }
            // showErrors : function (errorMap, elementList) {
            //     var a =0;
            // }
        }

    return validate
});