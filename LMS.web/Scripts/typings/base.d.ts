/// <reference path="moment/moment.d.ts" />
/// <reference path="jquery.validation/jquery.validation.d.ts" />
/// <reference path="bootstrap/index.d.ts" />
/// <reference path="toastr/toastr.d.ts" />
/// <reference path="handlebars/handlebars.d.ts" />
/// <reference path="signalr/signalr.d.ts" />

interface JQueryStatic {
}

interface JQuery {
    sortable(sortableOption?: any): JQuery;
    hide(anime: string, options: any, callback: any): JQuery;
    filter<T>(func: (index: number, element: T) => boolean): T[];
    bootstrapShow(): JQuery;
    bootstrapHide(): JQuery;
	bootstrapFadeShow(): JQuery;
	bootstrapFadeHide(): JQuery;
    bootstrapMaterialDatePicker(params?: any): JQuery;
    bootgrid(params?: any): JQuery;
}

interface Document {
    selection: any;
}
interface HTMLElement {
    onreadystatechange(): any;
    reset(): any;
}
interface String {
    format(format: string, ...args: any[]): string;
	contains(array: any): boolean;
    trim(trim: string): string;
	toDate(): Date;
}
interface Array<T> {
	sumByValue(array: Array<T>): Array<T>;
	findByKey(predicate: Function): T;
	fill(filler: T): Array<T>;
	distinct():Array<T>;
}
interface Window {
	lms: any;
	jQuery: any;
	feedback:feedback;
}

interface IPing {
	uid: string;
	aid: string;
	pid: string;
	info?: string;
}


declare var PageParameters: any;
declare var Moment: moment.MomentStatic;
declare var Chartist: any;

//declare var LE: any; // LogEntries
declare var Resources: any; // resources charge par bundle
//declare var md5: any; // Module d'encryptage MD5
