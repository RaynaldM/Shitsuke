var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Base;
(function (Base) {
    var PageForm = (function (_super) {
        __extends(PageForm, _super);
        function PageForm() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PageForm.prototype.Ready = function () {
            _super.prototype.Ready.call(this);
            this.form = $("#main-form");
            this.setValues();
            this.setCancelButton();
            this.setSubmitButton();
            this.SetSelect2($("select.select2"));
            this.SetInputDate();
        };
        PageForm.prototype.setValues = function () {
            if (this.options.id !== null) {
                Base.Helpers.JsonAjaxService("GET", this.form.attr("action") + "/get/" + this.options.id, null)
                    .then(function (data) {
                    if (data) {
                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                $("#" + key).val(data[key]);
                            }
                        }
                    }
                    else {
                        toastr.warning(Resources.FeedbackCannotFind);
                    }
                });
            }
        };
        PageForm.prototype.setSubmitButton = function () {
            var _this = this;
            // set le click de submit
            if (this.options.ajaxSubmit) {
                // Submit entierement ajax
                // pour faire des trucs spéciaux
                $("#save-form")
                    .on("click", function (e) {
                    e.preventDefault();
                    if (!_this.form.valid())
                        return false;
                    Base.Helpers.AjaxServiceBase({
                        type: "POST",
                        url: _this.form.attr("action"),
                        data: _this.form.serialize(),
                        success: function () { _this.Success(); },
                        error: function (errors) { _this.Failure(errors); },
                        beforeSend: function () { _this.StartSave(); }
                    });
                    return false;
                });
            }
            else {
                // sbmit classique
                $("#save-form")
                    .unbind("click")
                    .on("click", function () {
                    _this.form.submit();
                });
            }
        };
        PageForm.prototype.setCancelButton = function () {
            var _this = this;
            $("#cancel-form").on("click", function () {
                if (_this.options.BackUrl) {
                    Base.Helpers.RedirectToUrl(_this.options.BackUrl);
                }
                else {
                    if (window.history.length && window.history.length > 1) {
                        window.history.back();
                    }
                }
            });
        };
        PageForm.prototype.SetInputDate = function () {
            var defaultOptions = {
                date: true,
                time: true,
                format: 'DD/MM/YYYY',
                minDate: null,
                maxDate: null,
                currentDate: null,
                lang: 'fr',
                weekStart: 0,
                shortTime: false,
                clearButton: true,
                nowButton: true,
                cancelText: 'Abandon',
                okText: 'OK',
                clearText: 'Effacer',
                nowText: 'Maintenant',
                switchOnClick: false,
                triggerEvent: "opencalendar" // 'focus'
            };
            $("input.r-date")
                .bootstrapMaterialDatePicker($.fn.extend(defaultOptions, {
                date: true,
                time: false,
                switchOnClick: true
            }));
            $("input[type=datetime]")
                .addClass("r-datetime")
                .bootstrapMaterialDatePicker(defaultOptions);
            $("input[type=time]")
                .addClass("r-time")
                .bootstrapMaterialDatePicker($.fn.extend(defaultOptions, {
                date: false,
                time: true
            }));
            $(".btn-date").on("click", function (e) {
                var target = "#" + $(e.currentTarget).attr("data-target");
                $(target).trigger("opencalendar");
            });
        };
        PageForm.prototype.SetSelect2 = function (jquerySelector) {
            var _this = this;
            jquerySelector
                .each(function (index, element) {
                var item = $(element);
                var url = "/data/" + item.attr("data-api");
                item.select2({
                    ajax: {
                        transport: function (params, success, failure) {
                            return Base.Helpers.JsonAjaxService("POST", url, { query: params.data.q })
                                .done(success)
                                .fail(failure);
                        },
                        data: function (params) {
                            return {
                                q: params.term,
                                page: params.page
                            };
                        },
                        processResults: function (data, params) {
                            params.page = params.page || 1;
                            var items = data.map(function (item) {
                                return { "id": item.key, "text": item.value };
                            });
                            return {
                                results: items,
                                pagination: {
                                    more: (params.page * 30) < data.length
                                }
                            };
                        },
                        cache: true
                    },
                    placeholder: "Selectionner une option",
                    allowClear: true,
                    minimumResultsForSearch: 1,
                    theme: "bootstrap",
                    openOnEnter: true,
                    closeOnSelect: true
                }).on('select2:select', function (evt) {
                    $(evt.target)
                        .html("<option value='{0}' selected='selected'>{1}</option>"
                        .format(evt.params.data.id, evt.params.data.text));
                })
                    .on('select2:unselect', function (evt) {
                    $(evt.target).empty();
                });
                _this.setValueInSelect2(item, url);
            });
        };
        PageForm.prototype.setValueInSelect2 = function (realInput, url) {
            var value = realInput.attr("data-value");
            if (value) {
                // il y a deja une valeur
                // on recupere le libellé
                Base.Helpers.JsonAjaxService("GET", url + "NameByKey/" + value)
                    .done(function (data) {
                    realInput.select2('data', { id: value, text: data });
                    realInput.html("<option value='{0}' selected='selected'>{1}</option>"
                        .format(value, data));
                })
                    .fail(function () {
                    toastr.warning("Impossible de lire le libéllé de " + realInput + ", le code n'existe pas", "Erreur technique");
                });
            }
        };
        PageForm.prototype.StartSave = function () {
            toastr.info("Sauvegarde en cours", "Sauvegarde");
        };
        PageForm.prototype.Success = function () {
            toastr.success("Sauvegarde effectuée", "Sauvegarde");
        };
        PageForm.prototype.Complete = function () {
            toastr.info("Transaction ended");
        };
        PageForm.prototype.Failure = function (errors) {
            toastr.error("Erreur lors de la sauvegarde", "Sauvegarde");
        };
        return PageForm;
    }(Base.Page));
    Base.PageForm = PageForm;
})(Base || (Base = {}));
//# sourceMappingURL=BasePageForm.js.map