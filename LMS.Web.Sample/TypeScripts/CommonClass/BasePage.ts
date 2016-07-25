/// <reference path="../../scripts/typings/base.d.ts" />
module Base {

    export class Page {
        public options: any;

        constructor(opts?: any) {
            this.options = opts;
            toastr.options = {
                "positionClass": "toast-top-full-width",
                "timeOut": 3000,
                "onclick": null
            };
			//if (LE && this.options && !this.options.IsDebug) {
			//	LE.init({ token: CCPParameters.lid, catchall: true, page_info: 'per-page' });
			//}
			moment.locale(PageParameters.language);
        }

        Ready(): void {
		}
	}
}