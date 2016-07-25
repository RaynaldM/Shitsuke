/// <reference path="../scripts/typings/base.d.ts" />

class HintedStatIndex extends Base.PageWithPeriod {
    private aSuffix = new Array(Resources.PeriodHours1stLetterMin, Resources.PeriodDays1stLetterMin, Resources.PeriodDays1stLetterMin);
    private aLableQty = new Array(24, 7, 30);
    private aModulo = new Array(2, 1, 3);
    private aTitle = new Array(Resources.Period24Hours, Resources.Period7Days, Resources.Period30Days);
    private pSuffix: string;
    private labelQty: number;
    private iModulo: number;

    private graphOptions: any = {
        high: 5,
        height: "200px", // todo : compute with real screen height
        showPoint: false,
        chartPadding: {
            top: 8,
            right: 0,
            bottom: 0,
            left: 0
        }
    };

    public Ready(): void {
        super.Ready();
		this.initPeriodToolbar("hinted",
			() => {
				this.load();
			})
			.done(
			() => {
				this.load();
			});
    }

    private load(): void {
        // set params for graph
        this.pSuffix = this.aSuffix[this.period];
        this.labelQty = this.aLableQty[this.period];
        this.iModulo = this.aModulo[this.period];
        $("span.lastperiod").text(this.aTitle[this.period]);
		$(".lib-date").text(this.startDate.toLocaleDateString());
        this.setContentAndGraph("/api/hintedstats/hintedusers", "#graph-users", "usr");
        this.getTopPages();
        this.setContentAndGraph("/api/hintedstats/hintedpages", "#graph-pages", "page");
        this.getTechnoStats();
    }

    private setContentAndGraph(url: string, graphdom: string, resumesuffix: string): void {
        Base.Helpers.JsonAjaxService("GET", url,
            {
                appid: PageParameters.currentApp,
                period: this.period,
                enddate: this.startDate.toISOString()
            })
            .done((data: Array<number>) => {
                if (data && data.length > 0) {

                    this.graphOptions.high = this.getMaxHigh(data, 5);
                    Chartist.Bar(graphdom,
                        {
                            labels: this.setupLabelsArray(this.labelQty, this.pSuffix, this.iModulo),
                            series: [data]
                        }, this.graphOptions);

                    // compute resume values
                    var max = Math.max(...data);
                    var sum = data.reduce((pv, cv) => (pv + cv), 0);
                    var avg = Math.round(sum / data.length);
                    $("#max-" + resumesuffix).html(max.toLocaleString() + "/" + this.pSuffix);
                    $("#sum-" + resumesuffix).html(sum.toLocaleString() + "/" + this.pSuffix);
                    $("#avg-" + resumesuffix).html(avg.toLocaleString() + "/" + this.pSuffix);
                }
            });
    }

    private getTopPages(): void {
        var topPageTemplate = Handlebars.compile($("#toppages-template").html());

		Base.Helpers.JsonAjaxService("GET",
            "/api/hintedstats/toppages",
            {
                appid: PageParameters.currentApp,
                period: this.period,
                enddate: this.startDate.toISOString(),
                count: 5
            })
            .done((data: Array<number>) => {
                if (data && data.length > 0) {
                    $("#list-pages").html(topPageTemplate(data));
                }
            });

    }

    private getTechnoStats(): void {
        Base.Helpers.JsonAjaxService("GET",
            "/api/hintedstats/TechnoStats",
            {
                appid: PageParameters.currentApp,
                period: this.period,
                enddate: this.startDate.toISOString()
            })
            .done((data: any) => {
                if (data) {
                    let blistTemplate: HandlebarsTemplateDelegate = Handlebars.compile($("#browserlist-template").html());
                    data.BrowserTypes = data.BrowserTypes.map((item) => {
                        item.Avg = Math.round((item.Count / data.total) * 100);
                        return item;
                    });
                    $("#list-btype").html(blistTemplate(data.BrowserTypes));
                    data.OSTypes = data.OSTypes.map((item) => {
                        item.Avg = Math.round((item.Count / data.total) * 100);
                        return item;
                    });
                    $("#list-bos").html(blistTemplate(data.OSTypes));

                    var sum = data.screenSize.reduce((pv, cv) => {
                        return (pv + parseInt(cv.Value));
                    }, 0);

                    data.screenSize = data.screenSize.map((item) => {
                        item.Count = parseInt(item.Value);
                        item.Avg = Math.round((item.Count / sum) * 100);
                        return item;
                    });
                    blistTemplate = Handlebars.compile($("#screensizelist-template").html());
                    $("#list-screen").html(blistTemplate(data.screenSize));
                }
            });

    }
}