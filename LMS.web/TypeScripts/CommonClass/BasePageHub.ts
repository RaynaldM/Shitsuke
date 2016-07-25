module Base {
	export class PageHub extends Page {
		protected initHub(): void {
			$.connection.hub.stateChanged((change) => {
				console.log("new State" + change.newState);
				if (change.newState === $.signalR.connectionState.disconnected) {
					$.connection.hub.start();
				}
				if (change.newState === $.signalR.connectionState.reconnecting) {
					console.log("Hub Re-connecting");

				} else if (change.newState === $.signalR.connectionState.connected) {
					console.log("The Hub server is online");
				}
			});

			$.connection.hub.disconnected = (): SignalR => {
				console.log("Hub disconnected");
				return null;
			};

			$.connection.hub.error((error) => {
				console.log("hub error " + error);
			});

			$.connection.hub.reconnected(() => {
				console.log("Hub Reconnected");
			});

			$.connection.hub.start()
				.done(() => {
					console.log("hub started");
				});

			$.connection.hub.logging = PageParameters.IsDebug;

			// Stop connection hub properly when leaving the page
			$(window)
				.bind('beforeunload',
				e => {
					$.connection.hub.stop(true, true);
				});
		}

		protected showHubError(): void {
			toastr.warning("Receive a null message, probably a Server error", "Server warning");
		}
	}
}