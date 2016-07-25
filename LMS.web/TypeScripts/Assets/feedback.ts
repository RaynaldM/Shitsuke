/// <reference path="../../scripts/typings/html2canvas/html2canvas.d.ts" />
class feedback {
    private static token: string;
    private static report: JQuery;
	private static loaded = false;

    public static Ready(btoken: string, appCode: string, userId: string,
		pageId: string, lang: string): void {
        this.token = "lmstoken " + btoken;

		if (!this.loaded) {
			this.load(lang).then(() => {
                this.init(btoken, appCode, userId, pageId);
                // set H2C ignore attribute for sceenshot
				this.report.attr("data-html2canvas-ignore", 1);
                this.report.find("*").attr("data-html2canvas-ignore", 1);
			});
		} else {
			this.init(btoken, appCode, userId, pageId);
		}
	}

	private static init(btoken: string, appCode: string, userId: string, pageId: string): void {
		// reset form
		this.report.find("form")[0].reset();
		// Set the hidden value
        $("#appcode").val(appCode);
        $("#userid").val(userId);
        $("#token").val(btoken);
        $("#pageid").val(pageId);
        $("#browserinfo").val(JSON.stringify(getBrowserInfo()));
        this.setSave();
        this.setTakeScreenshot();
        this.setClose();
        this.bShow(this.report);
	}

    private static setSave(): void {
        var self = this.report.find("form");
        var load = this.report.find(".loading");
        self.unbind("submit")
			.on("submit", (e: JQueryEventObject) => {
				e.preventDefault();
				this.bHide(this.report.find(".report"));
				this.bShow(load);
				$.ajax({
					type: "POST",
					url: window.lms + "/api/feedback/post",
					data: self.serialize(),
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					crossDomain: true,
					headers: { "Authorization": this.token }
				}).done(() => {
					this.bHide(load);
					this.bShow(this.report.find(".reported"));
				})
					.fail(() => {
						this.bHide(load);
						this.bShow(this.report.find(".failed"));
					});
				return false;
			});
    }

    private static setTakeScreenshot(): void {
        this.report.find(".screenshot")
			.unbind("click")
			.on("click",
            (e: JQueryEventObject) => {
                var target = $(e.currentTarget);
                target.find("i").removeClass("fa-camera fa-check").addClass("fa-refresh fa-spin");
                html2canvas(document.body,
                    {
                        onrendered: (canvas) => {
                            $(".screen-uri").val(canvas.toDataURL("image/png"));
                            target.find("i").removeClass("fa-refresh fa-spin").addClass("fa-check");
                        }
                    });
            });
    }

    private static setClose(): void {
        this.report.find("#lms-close, .close,.bclose")
			.unbind("click")
            .on("click",
            () => {
				// Hide window
				this.bHide(this.report);
				// reset input
				this.report.find("textarea").val("");
				this.report.find(".screen-uri").val("");
				// reset layout : ready to work
				this.bShow(this.report.find("form"));
				this.bHide(this.report.find(".failed"));
				this.bHide(this.report.find(".reported"));
				this.report.find("i.cam").removeClass("fa-refresh fa-spin").addClass("fa-camera");
			});
    }

	private static load(lang: string): JQueryGenericPromise<any> {
		return this.getScripts([
			"//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js",
			window.lms + "/bundles/embrsc_" + lang.substring(0, 2),
			"//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"
		])
			.then(() => {
				// load the Html feedback windows
				return $.ajax({
					type: "GET",
					url: window.lms + "/html/feedback.min.html",
					crossDomain: true
				}).then((html: string) => {
					html = html.replace("{root}", window.lms);
					var template = Handlebars.compile(html);
					html = template(Resources);
					$("#lmsFeedBack").append(html);
					this.loaded = true;
					this.report = $("#lms-report");
				});
			});
	}

	private static bShow(element: JQuery): void {
		element.removeClass("hidden").addClass("show").show();
	}

	private static bHide(element: JQuery): void {
		element.removeClass("show").addClass("hidden").hide();
	}

	private static getScripts(scriptsToLoad: Array<string>): JQueryPromise<any> {
		var // reference declaration & localization
			length = scriptsToLoad.length,
			counter = 0,
			handler: any = () => { counter++; },
			deferreds = [];
		let idx = 0;
		for (; idx < length; idx++) {
			deferreds.push(
				$.getScript(scriptsToLoad[idx], handler)
			);
		}

		return $.when.apply(null, deferreds);
	}
};

declare var Resources: any; // Object with resources