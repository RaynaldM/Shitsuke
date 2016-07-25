/// <reference path="../scripts/typings/base.d.ts" />
/// <reference path="../scripts/typings/signalr-hub/Hubs.d.ts" />

class DashBoardIndex extends Base.PageHub {
    private lastLogTemplate: HandlebarsTemplateDelegate;
    private feedbackTemplate: HandlebarsTemplateDelegate;

    private graphOptions: any = {
        high: 5,
        height: "135px", // todo : compute with real screen height
        showPoint: false,
        chartPadding: {
            top: 8,
            right: 0,
            bottom: 0,
            left: 0
        }
    };
    private dataMock = this.generateIntArray();
    private minutesLabel = this.setupLabelsArray();
    private secondsLabel = this.setupLabelsArray(10, "s");
    private logsLabel = this.setupLabelsArray(30, "mn", 3);

    private userGraph: any;
    private pageGraph: any;
    private pageSecondsGraph: any;
    private logsGraph: any;
    private donutGraph: any;

    public Ready(): void {
        super.Ready();

        var title = (PageParameters.currentApp !== "*") ?
            PageParameters.currentApp : Resources.DashboardAllApplications;
        // set page title if it's a particular app
        $("#server-name").html(title);

        this.lastLogTemplate = Handlebars.compile($("#lastlogs-template").html());
        this.feedbackTemplate = Handlebars.compile($("#feedback-template").html());

        this.initGraph();
        //if (PageParameters.IsDebug) this.initForDebug();
        this.initHub();
        this.loadFeedbacks();
    }

    protected initHub(): void {
        // Standard Init SignalR for all pages
        super.initHub();
        this.initMonitorHub();
        this.initLogsHub();
        this.initFeedBackHub();
    }

    //#region Logs Hub
    private initLogsHub(): void {
        // Get Logs Hub	from server
        var logsHub = $.connection.logsHub;

        logsHub.client.hello = (message) => {
            console.info("Hello for SignalR Hub");
            toastr.info("Hello for SignalR Hub > " + message, "SignalR avalaible");
        }

        // Set the refresh push from SignalR server
        logsHub.client.refresh = (models: Array<LoggingHubModel>) => {
            if (models == null) {
                // In case of error
                this.showHubError();
                return;
            }
            if (models.length > 0) {
                if (PageParameters.currentApp === "*") {
                    // Show aggregate of all apps (* = all)
                    this.refreshLogs(this.aggregateLogs(models));
                } else {
                    // Show a specific app
                    var i = Base.Helpers.FindIndexByKeyValue(models, "Id", PageParameters.currentApp);
                    if (i !== null) {
                        models[i].LastLogs = this.mapAppInLastLogs(models[i].LastLogs, models[i].Id);
                        this.refreshLogs(models[i]);
                    }
                }
            }
        }
    }

    private refreshLogs(model: LoggingHubModel): void {
        $("#count-logs").html(<any>model.Count);
        //model.MinutesCount=model.MinutesCount.map(value => {
        //	return value == 0 ? null : value;
        //});
        // Refresh the history
        this.refreshGraph(this.logsGraph, model.MinutesCount, this.logsLabel);

        this.refreshLogsDonut(model);

        // Refresh the template of last log
        this.refreshLogsTable(model.LastLogs);
    }

    private refreshLogsTable(logs: Array<miniLog>): void {
        // Sort the last log list and take just last 10
        logs = logs.sort((a, b) => {
            if (a.Date > b.Date)
                return -1;
            if (a.Date < b.Date)
                return 1;
            return 0;
        }).slice(0, 10);

        $("#lastlog-panel")
            .html(this.lastLogTemplate(logs));
    }

    private refreshLogsDonut(model: LoggingHubModel): void {
        // setup donut data
        var serie = new Array<number>();
        // get distint label from server
        var labels = model.List.map((value) => { return value.Name }).distinct();
        var sumSeries = 0;
        // compute value for each label
        labels.forEach((item, i) => {
            serie[i] = 0;
            model.List
                .filter((value) => { return value.Name === item })
                .forEach((a) => {
                    // sum of values
                    return serie[i] += parseInt(a.Value);
                });
            sumSeries += serie[i];
            // Modify label to include %
            //    labels[i] = Math.round((serie[i] / model.Count) * 100) + "% - " + labels[i];
        });
        //var sumValue = model.Count;
        this.donutGraph = Chartist.Pie("#type-log",
            {
                series: serie,
                labels: labels
            },
            {
                donut: true,
                donutWidth: 25,
                total: sumSeries,
                showLabel: false, plugins: [
                    Chartist.plugins.legend({
                        legendContainer: "type-log-legend"
                    })
                ]
            });
    }

    private aggregateLogs(models: Array<LoggingHubModel>): LoggingHubModel {
        // create an empty model
        var result: LoggingHubModel = {
            Id: "*",
            Count: 0,
            List: new Array(),
            MinutesCount: this.generateIntArray(30),
            LastLogs: new Array()
        };
        // and aggregate all other model into
        models.forEach((model) => {
            if (model != null) {
                result.Count += model.Count;
                result.MinutesCount = result.MinutesCount.sumByValue(model.MinutesCount);
                model.LastLogs = this.mapAppInLastLogs(model.LastLogs, model.Id);
                result.LastLogs = result.LastLogs.concat(model.LastLogs);
                result.List = result.List.concat(model.List);
            }
        });

        return result;
    }

    // Map app in last logs for show it
    private mapAppInLastLogs(logs: Array<miniLog>, app: string): Array<miniLog> {
        return logs.map((item) => {
            item.App = app;
            return item;
        });

    }
    //#endregion

    //#region Monitor Hub
    private initMonitorHub(): void {
        // Get Monitor Hub
        var countHub = $.connection.monitorHub;

        countHub.client.hello = (message) => {
            console.info("Hello for SignalR Hub");
            toastr.info("Hello for SignalR Hub > " + message, "SignalR avalaible");
        }

        // Set the refresh push from SignalR server
        countHub.client.refresh = (models: Array<MonitoringHubModel>) => {
            if (models == null) {
                // In case of error
                this.showHubError();
                return;
            }
            $("#heart-sr").bootstrapFadeShow();
            if (models.length > 0) {
                if (PageParameters.currentApp === "*") {
                    // Show aggregate of all apps (* = all)
                    this.refreshMonitor(this.aggregateMonitors(models));
                } else {
                    var i = Base.Helpers.FindIndexByKeyValue(models, "Id", PageParameters.currentApp);
                    if (i !== null) {
                        this.refreshMonitor(models[i]);
                    }
                }
            } else {
                // no data from server
                this.initGraphMonitor();
            }
            $("#heart-sr").bootstrapFadeHide();
        }
    }

    private refreshMonitor(model: MonitoringHubModel): void {
        $("#count-usrhisto").html(<any>model.UsersCount);
        this.refreshGraph(this.userGraph, model.UsersCountHistory);
        this.refreshGraph(this.pageGraph, model.PagesCountHistory);
        this.refreshGraph(this.pageSecondsGraph,
            model.PagesCountHistoryBySecond,
            this.secondsLabel,
            3);
    }

    private aggregateMonitors(models: Array<MonitoringHubModel>): MonitoringHubModel {
        // create an empty model
        var result: MonitoringHubModel = {
            Id: "*",
            UsersCount: 0,
            PagesCountHistory: this.dataMock.slice(0),
            UsersCountHistory: this.dataMock.slice(0),
            PagesCountHistoryBySecond: this.generateIntArray(9)
        };
        // and aggregate all other model into
        models.forEach((model) => {
            if (model != null) {
                result.UsersCount += model.UsersCount;
                result.PagesCountHistory = result.PagesCountHistory.sumByValue(model.PagesCountHistory);
                result.PagesCountHistoryBySecond = result.PagesCountHistoryBySecond.sumByValue(model.PagesCountHistoryBySecond);
                result.UsersCountHistory = result.UsersCountHistory.sumByValue(model.UsersCountHistory);
            }
        });
        return result;
    }
    //#endregion

    //#region Feedback
    private loadFeedbacks(): void {
        var appCode = PageParameters.currentApp === "*" ? "lms-allapps" : PageParameters.currentApp;
        Base.Helpers.JsonAjaxService("GET", "/api/feedback/resumelist/" + appCode, null)
            .then((data) => {
                if (data) {
                    $("#feedback-list").html(this.feedbackTemplate(data.List));
                    Base.Helpers.ApplyTimeAgo();
                    $("#new-feedback").html(data.News);
                    $("#open-feedback").html(data.Open);
                    $("#feedback-list")
                        .find("a.list-group-item")
                        .unbind("click")
                        .on("click", (e: JQueryEventObject) => {
                            var target = $(e.currentTarget);
                            Base.Helpers.RedirectToUrl("/feedback/detail/" + target.attr("data-id"));
                        });
                }
            });
    }

    private initFeedBackHub(): void {
        // Get Monitor Hub
        var hub = $.connection.feedbackHub;

        // Set the refresh push from SignalR server
        hub.client.refresh = (itemnumber: number) => {
            if (itemnumber == null || itemnumber <= 0) {
                // In case of error
                this.showHubError();
                return;
            }
            //todo : optimize it (don't re-read all feedbacks)
            this.loadFeedbacks();
        }
    }
    //#endregion

    private initGraph(): void {
        this.initGraphMonitor();
        this.initGraphLogs();
    }

    private initGraphMonitor(): void {
        this.userGraph = new Chartist.Bar("#usr-histo",
            {
                labels: this.minutesLabel,
                series: [this.dataMock]
            },
            this.graphOptions);
        this.pageGraph = new Chartist.Bar("#usr-page",
            {
                labels: this.minutesLabel,
                series: null
            },
            this.graphOptions);
        this.pageSecondsGraph = new Chartist.Bar("#usr-pageseconds",
            {
                labels: this.secondsLabel,
                series: null
            },
            this.graphOptions);
    }

    private initGraphLogs(): void {
        this.logsGraph = new Chartist.Line("#logs-histo",
            {
                labels: this.logsLabel,
                series: null
            }, this.graphOptions);
        this.donutGraph = Chartist.Pie("#type-log",
            {
                series: [{
                    value: 100,
                    className: "ct-grey"
                }]
            },
            {
                donut: true,
                donutWidth: 30,
                total: 100,
                showLabel: false
            });
    }

    private refreshGraph(graphObject: any,
        data: Array<number>,
        labels: Array<string> = this.minutesLabel,
        minValue: number = 13): void {
        var series = new Array();
        series[0] = data.reverse();
        this.graphOptions.high = this.getMaxHigh(data, minValue);
        graphObject.update(
            {
                labels: labels,
                series: series
            },
            this.graphOptions);
    }

    private generateIntArray(lenght: number = 5): Array<number> {
        return new Array(lenght).fill(0);
    }

    //private initForDebug(): void {
    //    var usr: string;
    //    var page: string;
    //    var app: string;
    //    setInterval(() => {
    //        usr = "usr-" + Math.floor((Math.random() * 30) + 1);
    //        page = "page-" + Math.floor((Math.random() * 8) + 1);
    //        app = "LMS-" + Math.floor((Math.random() * 4) + 1);
    //        var data = {
    //            "uid": usr,
    //            "aid": app,
    //            "pid": page,
    //            "info": navigator.userAgent
    //        };
    //        Base.Helpers.JsonAjaxService(
    //            "POST",
				////"http://em-logmonitor.azurewebsites.net/api/monitor/ping",
    //            "/api/monitor/ping",
    //            data,
    //            { "Authorization": "lmstoken 3AC096D0-A1C2-E12C-1390-A8335801FDAB" })
    //            .fail(() => { console.warn("call failed"); });
    //    }, 3000);
    //}
} 