
module Base {

    export class PageForm extends Page {
        private form: JQuery;

        public Ready(): void {
            super.Ready();
            this.form = $("#main-form");
            this.setValues();
            this.setCancelButton();
            this.setSubmitButton();
            this.SetSelect2($("select.select2"));
            this.SetInputDate();
        }

        protected setValues(): void {
            if (this.options.id!==null) {
                Base.Helpers.JsonAjaxService("GET", this.form.attr("action") + "/get/" + this.options.id, null)
                    .then((data) => {
                        if (data) {
                            for (var key in data) {
                                if (data.hasOwnProperty(key)) {
                                    $("#" + key).val(data[key])
                                }
                            }
                        } else {
                            toastr.warning(Resources.FeedbackCannotFind);
                        }
                    });
            }
        }

        protected setSubmitButton(): void {
            // set le click de submit
            if (this.options.ajaxSubmit) {
                // Submit entierement ajax
                // pour faire des trucs spéciaux
                $("#save-form")
                    .on("click",
                    (e: JQueryEventObject) => {
                        e.preventDefault();
                        if (!this.form.valid()) return false;
                        Helpers.AjaxServiceBase({
                            type: "POST",
                            url: this.form.attr("action"),
                            data: this.form.serialize(),
                            success: () => { this.Success(); },
                            error: (errors) => { this.Failure(errors); },
                            beforeSend: () => { this.StartSave(); }
                        });
                        return false;
                    });
            } else {
                // sbmit classique
                $("#save-form")
                    .unbind("click")
                    .on("click",
                    () => {
                        this.form.submit();
                    });
            }
        }

        protected setCancelButton(): void {
            $("#cancel-form").on("click", () => {
                if (this.options.BackUrl) {
                    Helpers.RedirectToUrl(this.options.BackUrl);
                } else {
                    if (window.history.length && window.history.length > 1) {
                        window.history.back();
                    }
                }
            });
        }

        protected SetInputDate(): void {
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
                .bootstrapMaterialDatePicker($.fn.extend(defaultOptions,
                    {
                        date: true,
                        time: false,
                        switchOnClick: true
                    }));

            $("input[type=datetime]")
                .addClass("r-datetime")
                .bootstrapMaterialDatePicker(defaultOptions);

            $("input[type=time]")
                .addClass("r-time")
                .bootstrapMaterialDatePicker($.fn.extend(defaultOptions,
                    {
                        date: false,
                        time: true
                    }));

            $(".btn-date").on("click", (e: JQueryEventObject) => {
                var target = "#" + $(e.currentTarget).attr("data-target");
                $(target).trigger("opencalendar");
            });
        }

        protected SetSelect2(jquerySelector: JQuery): void {
            jquerySelector
                .each((index: number, element: Element) => {
                    var item = $(element);
                    var url = "/data/" + item.attr("data-api");
                    item.select2({
                        ajax: {
                            transport: (params, success, failure) => {
                                return Helpers.JsonAjaxService("POST", url, { query: params.data.q })
                                    .done(success)
                                    .fail(failure);
                            },
                            data: (params: any) => {
                                return {
                                    q: params.term, // search term
                                    page: params.page
                                };
                            },
                            processResults: (data: Array<any>, params) => {
                                params.page = params.page || 1;
                                var items = data.map((item: any) => {
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
                        minimumResultsForSearch: 1,// Infinity,
                        theme: "bootstrap",
                        openOnEnter: true,
                        closeOnSelect: true
                    }).on('select2:select', (evt: any) => {
                        $(evt.target)
                            .html("<option value='{0}' selected='selected'>{1}</option>"
                                .format(evt.params.data.id, evt.params.data.text));
                    })
                        .on('select2:unselect', (evt: any) => {
                            $(evt.target).empty();
                        });
                    this.setValueInSelect2(item, url);
                });
        }

        private setValueInSelect2(realInput: JQuery, url: string): void {
            var value = realInput.attr("data-value");
            if (value) {
                // il y a deja une valeur
                // on recupere le libellé
                Helpers.JsonAjaxService("GET", url + "NameByKey/" + value)
                    .done((data) => {
                        realInput.select2('data', { id: value, text: data });
                        realInput.html("<option value='{0}' selected='selected'>{1}</option>"
                            .format(value, data));
                    })
                    .fail(() => {
                        toastr.warning("Impossible de lire le libéllé de " + realInput + ", le code n'existe pas",
                            "Erreur technique");
                    });
            }
        }

        protected StartSave(): void {
            toastr.info("Sauvegarde en cours", "Sauvegarde");
        }

        protected Success(): void {
            toastr.success("Sauvegarde effectuée", "Sauvegarde");
        }

        protected Complete(): void {
            toastr.info("Transaction ended");
        }

        protected Failure(errors): void {
            toastr.error("Erreur lors de la sauvegarde", "Sauvegarde");
        }
    }
} 