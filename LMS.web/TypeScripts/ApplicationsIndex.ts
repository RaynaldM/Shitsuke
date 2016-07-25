class ApplicationIndex extends Base.Page {
	public Ready(): void {
		super.Ready();

		Base.Helpers.JsonAjaxService("GET", "api/apps/list", null)
			.then((data) => {
				if (data) {
					var template = Handlebars.compile($("#apps-template").html());
					$("#apps-list").html(template(data));
					Base.Helpers.ApplyTimeAgo();
					// find the current app and set it active
					$("a[data-code='{0}']".format(PageParameters.currentApp)).addClass("active");

					// add a click event to select the new current app
					$("a.list-group-item,#allapps")
						.on("click",
						(event: JQueryEventObject) => {
							this.setCurrentApp($(event.currentTarget));
						});
				}
			});
	}

	private setCurrentApp(target: JQuery): void {
		var code = target.attr("data-code");
		$("a.list-group-item").removeClass("active");
		target.addClass("active");
		Base.Helpers.JsonAjaxService("POST", "/applications/setcurrent/" + code)
			.done(() => {
                toastr.success(Resources.ApplicationSuccessTxt.format(code), Resources.ApplicationTitle);
				Base.Helpers.RedirectToUrl("dashboard/index");
			})
            .fail(() => { toastr.error(Resources.ApplicationErrorTxt, Resources.ApplicationTitle); });

	}
} 