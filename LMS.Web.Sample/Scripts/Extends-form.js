$(function () {
    $("span.field-validation-valid, span.field-validation-error").each(function () {
        $(this).addClass("help-inline");
    });

    $("form").submit(function () {
        if ($(this).valid()) {
            $(this).find("div.control-group").each(function () {
                if ($(this).find("span.field-validation-error").length == 0) {
                    $(this).removeClass("error");
                }
            });
        }
        else {
            $(this).find("div.control-group").each(function () {
                if ($(this).find("span.field-validation-error").length > 0) {
                    $(this).addClass("error");
                }
            });
        }
    });


    $("form").each(function () {
        debugger;
        $(this).find("div.control-group").each(function () {
            if ($(this).find("span.field-validation-error").length > 0) {
                $(this).addClass("error");
            }
        });
    });

});


$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest(".form-group").addClass("has-error");
    },
    unhighlight: function (element) {
        $(element).closest(".form-group").removeClass("has-error");
    },
    errorElement: "span",
    errorClass: "help-block",
    errorPlacement: function (error, element) {
        if (element.parent(".input-group").length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

$("input[type=date]").addClass("r-date").bootstrapMaterialDatePicker({
    date: true,
    time: false,
    switchOnClick:true
});

$("input[type=datetime]").addClass("r-datetime").bootstrapMaterialDatePicker({
    date: true,
    time: true
});

$("input[type=time]").addClass("r-time").bootstrapMaterialDatePicker({
    date: false,
    time: true
});