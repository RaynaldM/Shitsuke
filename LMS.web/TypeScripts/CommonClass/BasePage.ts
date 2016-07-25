/// <reference path="../../scripts/typings/base.d.ts" />
module Base {

    export class Page {
        public options: any;
        private trigger: JQuery;
        private isClosed;

        constructor(opts?: any) {
            this.options = opts;
            toastr.options = {
                "positionClass": "toast-bottom-right",
                "timeOut": 3000,
                "onclick": null
            };
            //if (LE && this.options && !this.options.IsDebug) {
            //	LE.init({ token: CCPParameters.lid, catchall: true, page_info: 'per-page' });
            //}
            moment.locale(PageParameters.language);
        }

        Ready(): void {
            this.initNavBarBurger();
            $('[data-toggle="offcanvas"]').click(() => {
                $('#wrapper').toggleClass('toggled');
            });
        }

        private initNavBarBurger(): void {
            this.trigger = $('.hamburger');
            this.isClosed = false;
            this.trigger
                .unbind("click")
                .click(() => {
                    this.hamburgerCross();
                });
        }

        private hamburgerCross() {
            if (this.isClosed) {
                this.trigger
                    .removeClass("is-open")
                    .addClass("is-closed");
                this.isClosed = false;
            } else {
                //this.overlay.show();
                this.trigger
                    .removeClass('is-closed')
                    .addClass('is-open');
                this.isClosed = true;
            }
        }

        protected setupLabelsArray(lenght: number = 5, suffix: string = "mn", modulo: number = 1): Array<string> {
            var result = new Array(lenght);
            for (var i = 0; i < lenght; i++) {
                if (modulo === 1 || i % modulo === 0)
                    result[i] = i + " " + suffix;
                else {
					result[i] = "";
                }
            }
            return result.reverse();
        }


        protected getMaxHigh(data: Array<number>, minValue: number): number {
            var maxHigh = Math.max(...data);
            return (maxHigh < minValue ? minValue : maxHigh) + 2;
        }
    }
}