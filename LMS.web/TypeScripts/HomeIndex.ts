/// <reference path="../scripts/typings/base.d.ts" />
/// <reference path="../scripts/typings/signalr-hub/Hubs.d.ts" />

class HomeIndex extends Base.PageHub {

	public Ready(): void {
		super.Ready();
		this.initHub();
	}

	protected initHub(): void {
		// Standard Init SignalR for all pages
		super.initHub();
		var heart = $("#heart-sr");
		var monitorPanel = $("#monitor");
		// Get Monitor Hub
		var countHub = $.connection.homeMonitorHub;

		countHub.client.refresh = (model: HomeMonitoringHubModel) => {
			if (model == null) {
				// In case of error
				this.showHubError();
				return;
			}
			if (model.AppsCount > 0) {
				// should have something to show
				heart.bootstrapFadeShow();
				monitorPanel.bootstrapShow();

				$("#usrcount").html(model.UsersCount as any);
				$("#appcount").html(model.AppsCount as any);
				$("#pagecount").html(model.PagesCount as any);

				heart.bootstrapFadeHide();
			} else {
				monitorPanel.bootstrapHide();
			}
		}
	}

} 