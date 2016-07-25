class FeedbackDetail extends Base.Page {
    private type = new Array(Resources.FeedbackBug, Resources.Feedback, Resources.FeedbackQuestion);
	//private status = new Array(Resources.FeedbackNew, Resources.FeedbackOpened, Resources.FeedbackAnswered, Resources.FeedbackClosed);

	public Ready(): void {
		super.Ready();
		Base.Helpers.JsonAjaxService("GET", "/api/feedback/get/" + this.options.id, null)
			.then((data) => {
				if (data) {
					data.TypeText = this.type[data.Type];
					var template = Handlebars.compile($("#core-template").html());
					var templateSc = Handlebars.compile($("#sc-template").html());
					$("#core").html(template(data));
					$("#screenshot").html(templateSc(JSON.parse(data.Browserinfo)));
					if (data.HaveScreenshot) {
						$("#screenshot-img").attr("src", data.Screenshot);
						$("#screenshotzoom-img").attr("src", data.Screenshot);
						// Set link for zoom
						$("#screenshot-fg")
							.on("click", () => {
								$("#usual-modal").modal("show");
							});
					}
					this.setStatusButton(data.Status);
					Base.Helpers.ApplyTimeAgo();
                } else {
                    toastr.warning(Resources.FeedbackCannotFind);
				}
			});
	}

	private setStatusButton(status: any): void {
		$("#status-" + status).addClass("active");
        var buttons = $("button[id^='status-']");
        buttons.attr("data-loading-text", Resources.Saving);
		buttons.on("click", (e: JQueryEventObject) => {
            var obj = $(e.currentTarget);
            if (obj.hasClass("active")) return;// click on the same
			buttons.removeClass("active");
            obj.addClass("active");
            obj.button("loading");
            var newStatus = obj.attr("id");
			newStatus = newStatus.substring(newStatus.lastIndexOf("-") + 1);
            Base.Helpers.JsonAjaxService("PUT", "/api/feedback/SetStatus/" + this.options.id + "?newStatus=" + newStatus, null)
				.then((data) => {
					if (data) {
                        // Success
                        toastr.success(Resources.FeedbackStatusSavedSuccess);
					} else {
                        // error
                        toastr.error(Resources.FeedbackStatusSavedError, Resources.FeedbackStatusSavedTxt);
					}
                }).always(() => { obj.button('reset') });

		});

	}
} 