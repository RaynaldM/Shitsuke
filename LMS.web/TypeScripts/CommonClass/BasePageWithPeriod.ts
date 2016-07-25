/// <reference path="../../scripts/typings/base.d.ts" />
module Base {

	// A page with the period and calendar button
	export class PageWithPeriod extends Page {
		protected startDate = new Date();
		protected period: number = 0;

		protected initPeriodToolbar(gridName:string,callback: any): JQueryPromise<any> {
			
			// init the calendar button
			$("#btncal")
				.bootstrapMaterialDatePicker({
					weekStart: 0,
					time: false,
					lang: PageParameters.language,
					nowButton: true
				})
				.on("change",
				(e, date: moment.Moment) => {
					this.startDate = date.toDate();
					callback && callback();
				});

			// Init period button (day, week...)
			return Helpers.RadioButtonClick(".period",
				gridName,
				(result) => { this.period = parseInt(result); },
				(choice) => {
					this.period = parseInt(choice);
					callback && callback();
				}
			);
		}
	}
}