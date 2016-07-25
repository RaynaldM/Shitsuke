class LogDetail extends Base.Page {
	private levelList = new Array("Verbose", "Debug", "Information",
        "Warning", "Error", "Fatal");
	private levelListCss = new Array("", "", "text-info",
        "text-warning", "text-danger", "bg-danger");

    public Ready(): void {
        super.Ready();

        if (this.options.type.toLowerCase() === "id") {
			// get full log by id
			this.getById(this.options.id);
        } else {
            toastr.info(Resources.LogSearchAndLoad, Resources.LogFindByHashcode);
			Base.Helpers.JsonAjaxService("GET", "/api/logs/GetIdByHash/" + this.options.id, null)
				.then((data) => {
					if (data) {
						this.getById(data);
                    } else {
                        toastr.warning(Resources.LogCannotFind, Resources.LogFindByHashcode);
					}
				});
        }
    }

	private getById(id: any): void {
		// Get description info
		Base.Helpers.JsonAjaxService("GET", "/api/logs/getbyid/" + id, null)
			.then((data) => {
				var template = Handlebars.compile($("#fulllog-template").html());
				data.errorLevelText = this.levelList[data.Errorlevel];
				data.errorLevelClass = this.levelListCss[data.Errorlevel];
				$("#full-log").html(template(data));
				Base.Helpers.ApplyTimeAgo();
			});

		// Get statistics
		Base.Helpers.JsonAjaxService("GET", "/api/logs/statbyid/" + id, null)
			.then((data) => {
				var template = Handlebars.compile($("#occurencedata-template").html());
				$("#occurence-data").html(template(data));
				Base.Helpers.ApplyTimeAgo();
			});
	}
}