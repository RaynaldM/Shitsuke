
$.validator.setDefaults({
    highlight: function (element, errorClass, validClass) {
        if (element.type === "radio") {
            this.findByName(element.name).addClass(errorClass).removeClass(validClass);
        } else {
            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            //$(element).closest('.form-group').removeClass('has-success has-feedback').addClass('has-error has-feedback');
            //$(element).closest('.form-group').find('i.fa').remove();
            //$(element).closest('.form-group').append('<i class="fa fa-exclamation fa-lg form-control-feedback"></i>');
        }
    },
    unhighlight: function (element, errorClass, validClass) {
        if (element.type === "radio") {
            this.findByName(element.name).removeClass(errorClass).addClass(validClass);
        } else {
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            //$(element).closest('.form-group').removeClass('has-error has-feedback').addClass('has-success has-feedback');
            //$(element).closest('.form-group').find('i.fa').remove();
            //$(element).closest('.form-group').append('<i class="fa fa-check fa-lg form-control-feedback"></i>');
        }
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

jQuery.extend(jQuery.validator.methods, {
    date: function (value, element) {
        if (!value)
            return true;   // la valeur est null, on renvoie vrai, parce qu'on ne peut pas dire si c'est une date
        var format = moment.localeData(window.PageParameters.language).longDateFormat("L");
        var valid = moment(value, format).isValid();
        return valid;
    },
    datetime: function (value, element) {
        if (!value)
            return true;   // la valeur est null, on renvoie vrai, parce qu'on ne peut pas dire si c'est une date
        var format = moment.localeData(window.PageParameters.language).longDateFormat("L T");
        var valid = moment(value, format).isValid();
        return valid;
    },
    time: function (value, element) {
        if (!value)
            return true;   // la valeur est null, on renvoie vrai, parce qu'on ne peut pas dire si c'est une date
        var format = moment.localeData(window.PageParameters.language).longDateFormat("T");
        var valid = moment(value, format).isValid();
        return valid;
    }
});