/// <reference path="../scripts/typings/base.d.ts" />

class LogsIndex extends Base.PageWithPeriod {
    private aTitle = new Array(Resources.Period24Hours, Resources.Period7Days, Resources.Period30Days);
    private levelList = new Array("Verbose", "Debug", "Information",
        "Warning", "Error", "Fatal");
    private ocInit: boolean; // use to know if occurence grid is init or not
    private listTab = 0; // use to know which grid is visible

	public Ready(): void {
        super.Ready();
		this.initToolbar().done(() => {
			this.setTitle();
			this.initAllLogsGrid();
		});
    }

    private load() {
        this.setTitle();
        var elem = (new Array("#grid-alllogs", "#grid-occurence"))[this.listTab];
        $(elem).bootgrid("reload");
    }

    private setTitle(): void {
        // set params for graph
        $("span.lastperiod").text(this.aTitle[this.period]);
        $(".lib-date").text(this.startDate.toLocaleDateString());
    }

    private initAllLogsGrid(): void {
        this.initGrid("#grid-alllogs", "api/logs/list");
    }

    private initOccurenceGrid(): void {
        this.initGrid("#grid-occurence", "api/logs/occurences");
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
					endDate: this.startDate.toISOString(),
					period: this.period,
					appId: PageParameters.currentApp
				}),
				url: url,
				formatters: {
					"link": (column, row) => {
						var url = "<a href='/logs/detail/{0}?type={1}'>{0}</a>".format(row[column.id], column.id);
						return url;
					},
					"command": (column, row) => {
						var url = "<a href='/logs/detail/{0}?type=hash'><span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span></a>".format(row[column.id]);
						return url;
					},
					"datetime": (column, row) => {
						return new Date(row[column.id]).toLocaleString();
					},
					"level": (column, row) => {
						return this.levelList[row[column.id]];
					}
				}
            });
    }

    private initToolbar(): JQueryPromise<any> {
		var t1 = this.initPeriodToolbar("logs", () => { this.load(); });

		// Init buttons
		var t2 = Base.Helpers.RadioButtonClick(".choice", "logs",
			(result) => {
				this.listTab = parseInt(result);
				if (this.listTab === 0) {
					// All Logs active
					this.show0();
				} else {
					this.show1();
				}
			},
			(choice: number) => {
				if (choice === 0) {
					// All Logs active
					this.show0();
					this.listTab = 0;
					this.load();
				} else {
					this.show1();
					this.listTab = 1;
					this.load();
				}
			});

		return $.when(t1, t2);
	}

	private show0(): void {
		$("#occurence").bootstrapFadeHide();
		$("#alllogs").bootstrapFadeShow();
	}

	private show1(): void {
		if (!this.ocInit) {
			this.ocInit = true;
			this.initOccurenceGrid();
		}
		$("#alllogs").bootstrapFadeHide();
		$("#occurence").bootstrapFadeShow();
	}
} 