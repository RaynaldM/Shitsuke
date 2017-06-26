/// <reference path="moment/moment.d.ts" />
/// <reference path="jquery.validation/jquery.validation.d.ts" />
/// <reference path="bootstrap/index.d.ts" />
/// <reference path="toastr/toastr.d.ts" />
/// <reference path="handlebars/handlebars.d.ts" />

interface JQueryStatic {
}

interface JQuery {
    highcharts;//(s: { data: { csv };title: { text: string };subtitle: { text: string };xAxis: { type: string;tickInterval: number;tickWidth: number;gridLineWidth: number;labels: { align: string;x: number;y: number } };yAxis: { title: { text };labels: { align: string;x: number;y: number;formatter: () => any };showFirstLabel: boolean }[];legend: { align: string;verticalAlign: string;y: number;floating: boolean;borderWidth: number };tooltip: { shared: boolean;crosshairs: boolean };plotOptions: { series: { cursor: string;point: { events: { click: () => void } };marker: { lineWidth: number } } };series: { name: string }[] }): any
    sortable(sortableOption?: any): JQuery;
    hide(anime: string, options: any, callback: any): JQuery;
    filter<T>(func: (index: number, element: T) => boolean): T[];
    bootstrapShow(): JQuery;
    bootstrapHide(): JQuery;
}

interface HighchartsStatic {
    theme?: any;
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
}

declare var PageParameters: any;
declare var Moment: moment.MomentStatic;
//declare var LE: any; // LogEntries
//declare var Resources: any; // resources charge par bundle
//declare var Modernizr: any; // declare le modernizr charge au depart
//declare var Resx: any; // resources JS pour clipper
//declare var md5: any; // Module d'encryptage MD5
