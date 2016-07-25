class FeedbackIndex extends Base.Page {
    private listType = new Array(Resources.FeedbackBug, Resources.Feedback, Resources.FeedbackQuestion);
    private listStatus = new Array(Resources.FeedbackNew, Resources.FeedbackOpened, Resources.FeedbackAnswered, Resources.FeedbackClosed);
    private classType = new Array("fa-bug text-danger", "fa-lightbulb-o text-primary", "fa-question text-success");

    private type = -1;
    private status = -1;

    public Ready(): void {
        super.Ready();
		// set up the grid when toolbar is ready
		this.initToolbar().done(() => {
			this.initGrid("#grid-list", "/api/feedback/list");
		});
    }

    private load() {
        $("#grid-list").bootgrid("reload");
    }

    private initGrid(element: string, url: string): void {
        $(element)
            .bootgrid({
				labels: {
					/* resources JS */
					all: Resources.BootgridAll,
					infos: Resources.BootgridInfos,
					loading: Resources.BootgridLoading,
					noResults: Resources.BootgridNoResults,
					refresh: Resources.BootgridRefresh,
					search: Resources.BootgridSearch
				},
                searchSettings: {
                    delay: 250,
                    characters: 2
                },
                ajax: true,
                post: () => ({
                    type: this.type,
                    status: this.status,
                    appId: PageParameters.currentApp
                }),
                url: url,
                formatters: {
                    "link": (column, row) => {
                        var url = "<a href='/feedback/detail/{0}'>{0}</a>".format(row[column.id]);
                        return url;
                    },
                    "datetime": (column, row) => {
                        return new Date(row[column.id]).toLocaleString();
                    },
                    "type": (column, row) => {
                        var value = row[column.id];
                        return "<i class='fa {0}'> </i>&nbsp;".format(this.classType[value])
                            + this.listType[value];
                    },
                    "status": (column, row) => {
                        return this.listStatus[row[column.id]];
                    },
                    "attach": (column, row) => {
                        if (row[column.id] === true)
                            return "<i class='fa fa-paperclip'></i>";
                        return "";
                    }
                }
            });
    }

    private initToolbar(): JQueryPromise<any> {
        // Init Type buttons
		var t1 = Base.Helpers.RadioButtonClick(".choice-type", "feedback",
			(result) => { this.type = parseInt(result) },
			(choice: number) => {
				this.type = choice;
				this.load();
			});
        // Init Status buttons
		var t2 = Base.Helpers.RadioButtonClick(".choice-status", "feedback",
			(result) => { this.status = parseInt(result) },
			(choice: number) => {
				this.status = choice;
				this.load();
			});

		// waiting after both task
		return $.when(t1, t2);
    }
} 