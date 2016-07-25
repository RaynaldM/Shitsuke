/// <reference path="../../scripts/typings/base.d.ts" />
module Base {
	export class Helpers {
		//#region Ajax Services
		// doc : http://api.jquery.com/jQuery.ajax/
		static JsonAjaxService(verb: string, url: string,
			data: any = null, headers?: any, cors: boolean = false): JQueryXHR {

            if (!url) {
                alert("no url");
                return null;
            }
            verb = verb.toUpperCase();

            if (data && verb === "POST" || verb === "PUT")
                data = JSON.stringify(data);

			return this.AjaxServiceBase({
				type: verb, //GET or POST or PUT or DELETE verb
				url: url, // Location of the service
				data: data, //Data sent to server
				contentType: "application/json; charset=utf-8",
				//dataType: "json", //Expected data format from server
				crossDomain: cors,
				headers: headers
			});
        }

        static AjaxServiceBase(ajaxSetting: JQueryAjaxSettings): JQueryXHR {
            if (!ajaxSetting.error) {
                ajaxSetting.error = (jqXhr, textStatus, errorThrown) => {
                    this.AjaxErrorManagement(jqXhr, textStatus,
                        errorThrown, ajaxSetting.url);
                }
            }
            return $.ajax(ajaxSetting);
        }

        static AjaxErrorManagement(jqXhr: JQueryXHR,
            textStatus: string, errorThrown: any, url: string,
            errorFunc: any = null): void {
            if (errorFunc) {
                errorFunc(jqXhr, url);
            } else {
                var errMessage = 'Uncaught Error.\n' + jqXhr.responseText;
                if (jqXhr.status === 0) {
                    errMessage = 'Not connect.\n Verify Network.';
                } else if (jqXhr.status === 403) {
                    errMessage = 'Forbidden usage. [403]';
                } else if (jqXhr.status === 404) {
                    errMessage = 'Requested page not found. [404]';
                } else if (jqXhr.status === 500) {
                    errMessage = 'Internal Server Error [500].';
                } else if (errorThrown === 'parsererror') {
                    errMessage = 'Requested JSON parse failed.';
                } else if (errorThrown === 'timeout') {
                    errMessage = 'Time out error.';
                } else if (errorThrown === 'abort') {
                    errMessage = 'Ajax request aborted.';
                }
                var errorMessage = "[{0}] {1} ({2})".format(url, errMessage, textStatus);
                console.error(errorMessage);
                //LE.error(errorMessage);
            
                //alert(errorMessage);
            }
        }

        static LoadHtml(url: string, data: any, elementSelector?: string,
            successFunc?: any, errorFunc?: any, async: boolean = true,
            cors: boolean = false, global: boolean = false): JQueryXHR {

            if (!url) {
                //LE.Error("no url");
                alert("no url");
                return null;
            }

            return Helpers.AjaxServiceBase({
                type: "GET", //GET or POST or PUT or DELETE verb
                url: url, // Location of the service
                data: data, //Data sent to server
                dataType: "html", //Expected data format from server
                crossDomain: cors,
                async: async,
                global: global,
                success: (html: string) => {        
                    //On Successfull service call
                    if (elementSelector) {
                        // il y a un selector
                        // on injecte direct
                        $(elementSelector).html(html);
                    }
                    // todo : devrait faire partie d'une classe widget
                    successFunc && successFunc(html);
                },
				cache: true
            });
        }
        //#endregion
    
        static RedirectToUrl(urlto: string): void {
            window.location.href = urlto;
        }

		static emptyGuid: string = "00000000-0000-0000-0000-000000000000";

        static NewGuid(): string {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
                (c) => {
                    var r = Math.random() * 16 | 0,
                        // ReSharper disable once CoercedEqualsUsing
                        v = c == "x" ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
        }

		static ApplyTimeAgo(domName: string = ".timeago", delay: number = 60000): void {
            $(domName).each((i, item) => {
				Helpers.setTimeAgo($(item), delay);
            });
        }

		private static setTimeAgo(element: JQuery, delay: number) {
            var ctimout: number = parseInt(element.attr("ctimeout"));
            if (ctimout >= 0)
                clearTimeout(ctimout);
            var value: string = element.attr("data-timeago");
            if (value) {
                var myDate: moment.Moment = moment(value).local();
                element.attr("title", myDate.fromNow());
                element.text(myDate.calendar());
                ctimout = setTimeout(() => {
                    this.setTimeAgo(element, delay);
                }, delay);
                element.attr("ctimeout", ctimout);
            }
        }

        static FindIndexByKeyValue(obj: Array<any>, key: any, value: any) {
            var len: number = obj.length;
            for (var i: number = 0; i < len; i++) {
                if (obj[i][key] === value) {
                    return i;
                }
            }
            return null;
        }

		static SquareDomElement(element: JQuery, half: boolean = false): JQuery {
			var width = element.width();
			if (half) width /= 2;
			element.height(width);
			element.unbind("resize")
				.on("resize",
				function() {
					Helpers.SquareDomElement($(this));
				});
			return element;
		}

		static waitPanel: JQuery;

        static SetAjaxWaiter(jqSelector: string = "#infinitLoad"): void {
            this.waitPanel = $(jqSelector);
            $(document).on("ajaxStart", ( /*e, xhr, settings, exception*/) => {
                this.waitPanel.show();
            });

            $(document).on("ajaxStop", ( /*e, xhr, settings, exception*/) => {
                this.waitPanel.hide();
            });
        }

		// Recupere les params passes par une url
        static GetQueryParams(qs: string = document.location.search): any {
            qs = qs.split("+").join(" ");

            if (!qs) return null;

            var params = {},
                tokens,
                re = /[?&]?([^=]+)=([^&]*)/g;

            while ((tokens = re.exec(qs))) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        }

		/* enhance $.getScript to handle mutiple scripts */
        static GetScripts(resources: Array<string>, callback?: any): void {
            var // reference declaration & localization
                length: number = resources.length,
                deferreds = [],
                counter: number = 0,
                handler: any = () => { counter++; },
                idx: number = 0;

            for (; idx < length; idx++) {
                deferreds.push(
                    $.getScript(resources[idx], handler)
				);
            }

            $.when.apply(null, deferreds).then(() => {
                callback && callback();
            });
        }

        static InjectCss(url: string): void {
            var head = document.getElementsByTagName("head")[0];
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = url;
            link.media = "all";
            head.appendChild(link);
        }

			     static GetMaxHeightDom(dom: JQuery): JQuery {
            var maxHeight: number = -1;
            var domRet: JQuery = null;
            dom.each((index: number, element: Element) => {
                var jElement: JQuery = $(element);
                var h = jElement.height();
                if (h > maxHeight) {
                    domRet = jElement;
                    maxHeight = h;
                }
            });
            return domRet;
        }

		public GetBootstrapWidth(): BootstrapWidth {
			if (window.matchMedia("(max-width: 767px)").matches) {
				return BootstrapWidth.ExtraSmall;
			} else if (window.matchMedia("(min-width:768px) and (max-width: 991px)").matches) {
				return BootstrapWidth.Small;
			} else if (window.matchMedia("(min-width:992px) and (max-width: 1119px)").matches) {
				return BootstrapWidth.Medium;
			} else if (window.matchMedia("(min-width:1200px)").matches) {
				return BootstrapWidth.Large;
			}
			return BootstrapWidth.Medium;
		}

		// #region Modal et Form

        // var qui contient le nom de la modal ouvert
        private static modalInjectDom: string;

        // Inject un Html venant du serveur dans une modal
        // et l'ouvre, init la form si neccessaire
        static ModalInjectHtlmOrForm(url: string, formUrl?: string, successMessage?: string,
            callbackSubmitForm?: any, callBackRead?: any,
            domName: string = "#usual-modal"
		): void {
            this.modalInjectDom = domName;
            $.get(url,
                (html: string): void => {
                    // html recu
                    // et injecte
                    this.ModalContent().html(html);
                    // s'il y a un callBack apres la lecture du Html
                    callBackRead && callBackRead();
                    // s'il y a une url de POST de form => y a une form
                    if (formUrl)
                        this.SetForm(formUrl, successMessage, callbackSubmitForm);
                    // on montre la modal
                   this.ModalOpen(domName);
                });
        }

        // Helper donnant le content de la modal
        static ModalContent(): JQuery {
            return $(this.modalInjectDom + " > .modal-dialog > .modal-content");
        }

		// ouvre la modal
		static ModalOpen(domName: string = "#usual-modal",
			callbackOpened: any = null,
			callbackClosed: any = null): void {
			this.modalInjectDom = domName;
			// on montre la modal
			$(this.modalInjectDom)
				.unbind("show.bs.modal")
				.unbind("hide.bs.modal")
				.modal("show")
				.on("shown.bs.modal", () => {
					callbackOpened && callbackOpened();
				})
				.on('hidden.bs.modal', () => {
					// on vide la modal 
					// pour laisser l'endroit aussi
					// propre qu'en entrant
					callbackClosed && callbackClosed();
					this.ModalContent().empty();
				});
		}

        // Fermer modal ouverte ci-dessus
        static ModalClose(): void {
            $(this.modalInjectDom).modal("hide");
        }

        static SetForm(url: string, successMessage: string = "Success",
            callbackSubmitForm?: any): void {
            var btn: JQuery = $("btn-save");
            var form: JQuery = $("form");

            form.submit(function (): boolean {
                if ($(this).valid()) {
                    btn.button("loading");
                    $.ajax({
                        url: url + "/Post",
                        type: this.method,
                        data: $(this).serialize(),
                        success: (result: any): void=> {
                            if (result) {
                                toastr.success(successMessage);
                                callbackSubmitForm
                                && callbackSubmitForm(result);
                            }
                        }
                    }).always((): void=> {
                        btn.button("reset");
                    });
                }
                return false;
            });
        }
        // #endregion

		static CancelBubble(e: JQueryEventObject) {
            var evt = e ? e : window.event;
            if (evt.stopPropagation) evt.stopPropagation();
            if (evt.cancelBubble != null) evt.cancelBubble = true;
        }

        //static  GravatarImage(mail: string, classImg?: string, size: number = 80,
        //    defaultImg: string = "404", altText: string = "Gravatar Image"): string {
        //    if (mail && mail.length > 0 && md5) {
        //        var hash = md5(mail);
        //        var gravatarUrl: string = "<img {4} src='http://www.gravatar.com/avatar/{0}?s={1}&d={2}' alt='{3}'>";
        //        if (classImg) classImg = "class='" + classImg + "'";
        //        return gravatarUrl.format(hash, size, defaultImg, altText, classImg);
        //    }
        //    return null;
        //}


	}


}

declare var BaseHelpers: Base.Helpers;
