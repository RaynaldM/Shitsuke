///#source 1 1 /Scripts/bootstrap-material-datetimepicker.js
(function ($, moment) {
    var pluginName = "bootstrapMaterialDatePicker";
    var pluginDataName = "plugin_" + pluginName;

    moment.locale(window.PageParameters.language);

    function Plugin(element, options) {
        this.currentView = 0;

        this.minDate;
        this.maxDate;

        this._attachedEvents = [];

        this.element = element;
        this.$element = $(element);

        this.params = { date: true, time: true, format: 'YYYY-MM-DD', minDate: null, maxDate: null, currentDate: null, lang: 'en', weekStart: 0, shortTime: false, clearButton: false, nowButton: false, cancelText: 'Cancel', okText: 'OK', clearText: 'Clear', nowText: 'Now', switchOnClick: false };
        this.params = $.fn.extend(this.params, options);

        this.name = "dtp_" + this.setName();
        this.$element.attr("data-dtp", this.name);

        moment.locale(this.params.lang);

        this.init();
    }

    $.fn[pluginName] = function (options, p) {
        this.each(function () {
            if (!$.data(this, pluginDataName)) {
                $.data(this, pluginDataName, new Plugin(this, options));
            }
            else {
                if (typeof ($.data(this, pluginDataName)[options]) === 'function') {
                    $.data(this, pluginDataName)[options](p);
                }
                if (options === 'destroy') {
                    delete $.data(this, pluginDataName);
                }
            }
        });
        return this;
    };

    Plugin.prototype =
	{
	    init: function () {
	        this.initDays();
	        this.initDates();

	        this.initTemplate();

	        this.initButtons();

	        this._attachEvent($(window), 'resize', this._centerBox.bind(this));
	        this._attachEvent(this.$dtpElement.find('.dtp-content'), 'click', this._onElementClick.bind(this));
	        this._attachEvent(this.$dtpElement, 'click', this._onBackgroundClick.bind(this));
	        this._attachEvent(this.$dtpElement.find('.dtp-close > a'), 'click', this._onCloseClick.bind(this));
	        this._attachEvent(this.$element, 'focus', this._onFocus.bind(this));
	    },
	    initDays: function () {
	        this.days = [];
	        for (var i = this.params.weekStart; this.days.length < 7; i++) {
	            if (i > 6) {
	                i = 0;
	            }
	            this.days.push(i.toString());
	        }
	    },
	    initDates: function () {
	        if (this.$element.val().length > 0) {
	            if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
	                this.currentDate = moment(this.$element.val(), this.params.format).locale(this.params.lang);
	            }
	            else {
	                this.currentDate = moment(this.$element.val()).locale(this.params.lang);
	            }
	        }
	        else {
	            if (typeof (this.$element.attr('value')) !== 'undefined' && this.$element.attr('value') !== null && this.$element.attr('value') !== "") {
	                if (typeof (this.$element.attr('value')) === 'string') {
	                    if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
	                        this.currentDate = moment(this.$element.attr('value'), this.params.format).locale(this.params.lang);
	                    }
	                    else {
	                        this.currentDate = moment(this.$element.attr('value')).locale(this.params.lang);
	                    }
	                }
	            }
	            else {
	                if (typeof (this.params.currentDate) !== 'undefined' && this.params.currentDate !== null) {
	                    if (typeof (this.params.currentDate) === 'string') {
	                        if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
	                            this.currentDate = moment(this.params.currentDate, this.params.format).locale(this.params.lang);
	                        }
	                        else {
	                            this.currentDate = moment(this.params.currentDate).locale(this.params.lang);
	                        }
	                    }
	                    else {
	                        if (typeof (this.params.currentDate.isValid) === 'undefined' || typeof (this.params.currentDate.isValid) !== 'function') {
	                            var x = this.params.currentDate.getTime();
	                            this.currentDate = moment(x, "x").locale(this.params.lang);
	                        }
	                        else {
	                            this.currentDate = this.params.currentDate;
	                        }
	                    }
	                    this.$element.val(this.currentDate.format(this.params.format));
	                }
	                else
	                    this.currentDate = moment();
	            }
	        }

	        if (typeof (this.params.minDate) !== 'undefined' && this.params.minDate !== null) {
	            if (typeof (this.params.minDate) === 'string') {
	                if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
	                    this.minDate = moment(this.params.minDate, this.params.format).locale(this.params.lang);
	                }
	                else {
	                    this.minDate = moment(this.params.minDate).locale(this.params.lang);
	                }
	            }
	            else {
	                if (typeof (this.params.minDate.isValid) === 'undefined' || typeof (this.params.minDate.isValid) !== 'function') {
	                    var x = this.params.minDate.getTime();
	                    this.minDate = moment(x, "x").locale(this.params.lang);
	                }
	                else {
	                    this.minDate = this.params.minDate;
	                }
	            }
	        }
	        else if (this.params.minDate === null) {
	            this.minDate = null;
	        }

	        if (typeof (this.params.maxDate) !== 'undefined' && this.params.maxDate !== null) {
	            if (typeof (this.params.maxDate) === 'string') {
	                if (typeof (this.params.format) !== 'undefined' && this.params.format !== null) {
	                    this.maxDate = moment(this.params.maxDate, this.params.format).locale(this.params.lang);
	                }
	                else {
	                    this.maxDate = moment(this.params.maxDate).locale(this.params.lang);
	                }
	            }
	            else {
	                if (typeof (this.params.maxDate.isValid) === 'undefined' || typeof (this.params.maxDate.isValid) !== 'function') {
	                    var x = this.params.maxDate.getTime();
	                    this.maxDate = moment(x, "x").locale(this.params.lang);
	                }
	                else {
	                    this.maxDate = this.params.maxDate;
	                }
	            }
	        }
	        else if (this.params.maxDate === null) {
	            this.maxDate = null;
	        }

	        if (!this.isAfterMinDate(this.currentDate)) {
	            this.currentDate = moment(this.minDate);
	        }
	        if (!this.isBeforeMaxDate(this.currentDate)) {
	            this.currentDate = moment(this.maxDate);
	        }
	    },
	    initTemplate: function () {
	        this.template = '<div class="dtp hidden" id="' + this.name + '">' +
								'<div class="dtp-content">' +
									'<div class="dtp-date-view">' +
										'<header class="dtp-header">' +
											'<div class="dtp-actual-day">Lundi</div>' +
											'<div class="dtp-close"><a href="javascript:void(0);"><i class="material-icons">clear</i></</div>' +
										'</header>' +
										'<div class="dtp-date hidden">' +
											'<div>' +
												'<div class="left center p10">' +
													'<a href="javascript:void(0);" class="dtp-select-month-before"><i class="material-icons">chevron_left</i></a>' +
												'</div>' +
												'<div class="dtp-actual-month p80">MAR</div>' +
												'<div class="right center p10">' +
													'<a href="javascript:void(0);" class="dtp-select-month-after"><i class="material-icons">chevron_right</i></a>' +
												'</div>' +
												'<div class="clearfix"></div>' +
											'</div>' +
											'<div class="dtp-actual-num">13</div>' +
											'<div>' +
												'<div class="left center p10">' +
													'<a href="javascript:void(0);" class="dtp-select-year-before"><i class="material-icons">chevron_left</i></a>' +
												'</div>' +
												'<div class="dtp-actual-year p80">2014</div>' +
												'<div class="right center p10">' +
													'<a href="javascript:void(0);" class="dtp-select-year-after"><i class="material-icons">chevron_right</i></a>' +
												'</div>' +
												'<div class="clearfix"></div>' +
											'</div>' +
										'</div>' +
										'<div class="dtp-time hidden">' +
											'<div class="dtp-actual-maxtime">23:55</div>' +
										'</div>' +
										'<div class="dtp-picker">' +
											'<div class="dtp-picker-calendar"></div>' +
											'<div class="dtp-picker-datetime hidden">' +
												'<div class="dtp-actual-meridien">' +
													'<div class="left p20">' +
														'<a class="dtp-meridien-am" href="javascript:void(0);">AM</a>' +
													'</div>' +
													'<div class="dtp-actual-time p60"></div>' +
													'<div class="right p20">' +
														'<a class="dtp-meridien-pm" href="javascript:void(0);">PM</a>' +
													'</div>' +
													'<div class="clearfix"></div>' +
												'</div>' +
												'<div id="dtp-svg-clock">' +
												'</div>' +
											'</div>' +
										'</div>' +
									'</div>' +
									'<div class="dtp-buttons">' +
										'<button class="dtp-btn-now btn btn-flat hidden">' + this.params.nowText + '</button>' +
										'<button class="dtp-btn-clear btn btn-flat hidden">' + this.params.clearText + '</button>' +
										'<button class="dtp-btn-cancel btn btn-flat">' + this.params.cancelText + '</button>' +
										'<button class="dtp-btn-ok btn btn-flat">' + this.params.okText + '</button>' +
										'<div class="clearfix"></div>' +
									'</div>' +
								'</div>' +
							'</div>';

	        if ($('body').find("#" + this.name).length <= 0) {
	            $('body').append(this.template);

	            if (this)

	                this.dtpElement = $('body').find("#" + this.name);
	            this.$dtpElement = $(this.dtpElement);
	        }
	    },
	    initButtons: function () {
	        this._attachEvent(this.$dtpElement.find('.dtp-btn-cancel'), 'click', this._onCancelClick.bind(this));
	        this._attachEvent(this.$dtpElement.find('.dtp-btn-ok'), 'click', this._onOKClick.bind(this));
	        this._attachEvent(this.$dtpElement.find('a.dtp-select-month-before'), 'click', this._onMonthBeforeClick.bind(this));
	        this._attachEvent(this.$dtpElement.find('a.dtp-select-month-after'), 'click', this._onMonthAfterClick.bind(this));
	        this._attachEvent(this.$dtpElement.find('a.dtp-select-year-before'), 'click', this._onYearBeforeClick.bind(this));
	        this._attachEvent(this.$dtpElement.find('a.dtp-select-year-after'), 'click', this._onYearAfterClick.bind(this));

	        if (this.params.clearButton === true) {
	            this._attachEvent(this.$dtpElement.find('.dtp-btn-clear'), 'click', this._onClearClick.bind(this));
	            this.$dtpElement.find('.dtp-btn-clear').removeClass('hidden');
	        }

	        if (this.params.nowButton === true) {
	            this._attachEvent(this.$dtpElement.find('.dtp-btn-now'), 'click', this._onNowClick.bind(this));
	            this.$dtpElement.find('.dtp-btn-now').removeClass('hidden');
	        }

	        if ((this.params.nowButton === true) && (this.params.clearButton === true)) {
	            this.$dtpElement.find('.dtp-btn-clear, .dtp-btn-now, .dtp-btn-cancel, .dtp-btn-ok').addClass('btn-xs');
	        }
	        else if ((this.params.nowButton === true) || (this.params.clearButton === true)) {
	            this.$dtpElement.find('.dtp-btn-clear, .dtp-btn-now, .dtp-btn-cancel, .dtp-btn-ok').addClass('btn-sm');
	        }
	    },
	    initMeridienButtons: function () {
	        this.$dtpElement.find('a.dtp-meridien-am').off('click').on('click', this._onSelectAM.bind(this));
	        this.$dtpElement.find('a.dtp-meridien-pm').off('click').on('click', this._onSelectPM.bind(this));
	    },
	    initDate: function (d) {
	        this.currentView = 0;

	        this.$dtpElement.find('.dtp-picker-calendar').removeClass('hidden');
	        this.$dtpElement.find('.dtp-picker-datetime').addClass('hidden');

	        var _date = ((typeof (this.currentDate) !== 'undefined' && this.currentDate !== null) ? this.currentDate : null);
	        var _calendar = this.generateCalendar(this.currentDate);

	        if (typeof (_calendar.week) !== 'undefined' && typeof (_calendar.days) !== 'undefined') {
	            var _template = this.constructHTMLCalendar(_date, _calendar);

	            this.$dtpElement.find('a.dtp-select-day').off('click');
	            this.$dtpElement.find('.dtp-picker-calendar').html(_template);

	            this.$dtpElement.find('a.dtp-select-day').on('click', this._onSelectDate.bind(this));

	            this.toggleButtons(_date);
	        }

	        this._centerBox();
	        this.showDate(_date);
	    },
	    initHours: function () {
	        this.currentView = 1;

	        this.showTime(this.currentDate);
	        this.initMeridienButtons();

	        if (this.currentDate.hour() < 12) {
	            this.$dtpElement.find('a.dtp-meridien-am').click();
	        }
	        else {
	            this.$dtpElement.find('a.dtp-meridien-pm').click();
	        }

	        var hFormat = ((this.params.shortTime) ? 'h' : 'H');

	        this.$dtpElement.find('.dtp-picker-datetime').removeClass('hidden');
	        this.$dtpElement.find('.dtp-picker-calendar').addClass('hidden');

	        var svgClockElement = this.createSVGClock(true);

	        for (var i = 0; i < 12; i++) {
	            var x = -(162 * (Math.sin(-Math.PI * 2 * (i / 12))));
	            var y = -(162 * (Math.cos(-Math.PI * 2 * (i / 12))));

	            var fill = ((this.currentDate.format(hFormat) == i) ? "#8BC34A" : 'transparent');
	            var color = ((this.currentDate.format(hFormat) == i) ? "#fff" : '#000');

	            var svgHourCircle = this.createSVGElement("circle", { 'id': 'h-' + i, 'class': 'dtp-select-hour', 'style': 'cursor:pointer', r: '30', cx: x, cy: y, fill: fill, 'data-hour': i });

	            var svgHourText = this.createSVGElement("text", { 'id': 'th-' + i, 'class': 'dtp-select-hour-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '20', x: x, y: y + 7, fill: color, 'data-hour': i });
	            svgHourText.innerHTML = ((i === 0) ? ((this.params.shortTime) ? 12 : i) : i);

	            if (!this.toggleTime(i, true)) {
	                svgHourCircle.className += " disabled";
	                svgHourText.className += " disabled";
	                svgHourText.setAttribute('fill', '#bdbdbd');
	            }
	            else {
	                svgHourCircle.addEventListener('click', this._onSelectHour.bind(this));
	                svgHourText.addEventListener('click', this._onSelectHour.bind(this));
	            }

	            svgClockElement.appendChild(svgHourCircle)
	            svgClockElement.appendChild(svgHourText)
	        }

	        if (!this.params.shortTime) {
	            for (var i = 0; i < 12; i++) {
	                var x = -(110 * (Math.sin(-Math.PI * 2 * (i / 12))));
	                var y = -(110 * (Math.cos(-Math.PI * 2 * (i / 12))));

	                var fill = ((this.currentDate.format(hFormat) == (i + 12)) ? "#8BC34A" : 'transparent');
	                var color = ((this.currentDate.format(hFormat) == (i + 12)) ? "#fff" : '#000');

	                var svgHourCircle = this.createSVGElement("circle", { 'id': 'h-' + (i + 12), 'class': 'dtp-select-hour', 'style': 'cursor:pointer', r: '30', cx: x, cy: y, fill: fill, 'data-hour': (i + 12) });

	                var svgHourText = this.createSVGElement("text", { 'id': 'th-' + (i + 12), 'class': 'dtp-select-hour-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '22', x: x, y: y + 7, fill: color, 'data-hour': (i + 12) });
	                svgHourText.innerHTML = i + 12;

	                if (!this.toggleTime(i + 12, true)) {
	                    svgHourCircle.className += " disabled";
	                    svgHourText.className += " disabled";
	                    svgHourText.setAttribute('fill', '#bdbdbd');
	                }
	                else {
	                    svgHourCircle.addEventListener('click', this._onSelectHour.bind(this));
	                    svgHourText.addEventListener('click', this._onSelectHour.bind(this));
	                }

	                svgClockElement.appendChild(svgHourCircle)
	                svgClockElement.appendChild(svgHourText)
	            }

	            this.$dtpElement.find('a.dtp-meridien-am').addClass('hidden');
	            this.$dtpElement.find('a.dtp-meridien-pm').addClass('hidden');
	        }

	        this._centerBox();
	    },
	    initMinutes: function () {
	        this.currentView = 2;

	        this.showTime(this.currentDate);

	        this.initMeridienButtons();

	        if (this.currentDate.hour() < 12) {
	            this.$dtpElement.find('a.dtp-meridien-am').click();
	        }
	        else {
	            this.$dtpElement.find('a.dtp-meridien-pm').click();
	        }

	        this.$dtpElement.find('.dtp-picker-calendar').addClass('hidden');
	        this.$dtpElement.find('.dtp-picker-datetime').removeClass('hidden');

	        var svgClockElement = this.createSVGClock(false);

	        for (var i = 0; i < 60; i++) {
	            var s = ((i % 5 === 0) ? 162 : 158);
	            var r = ((i % 5 === 0) ? 30 : 20);

	            var x = -(s * (Math.sin(-Math.PI * 2 * (i / 60))));
	            var y = -(s * (Math.cos(-Math.PI * 2 * (i / 60))));

	            var color = ((this.currentDate.format("m") == i) ? "#8BC34A" : 'transparent');

	            var svgMinuteCircle = this.createSVGElement("circle", { 'id': 'm-' + i, 'class': 'dtp-select-minute', 'style': 'cursor:pointer', r: r, cx: x, cy: y, fill: color, 'data-minute': i });

	            if (!this.toggleTime(i, false)) {
	                svgMinuteCircle.className += " disabled";
	            }
	            else {
	                svgMinuteCircle.addEventListener('click', this._onSelectMinute.bind(this));
	            }

	            svgClockElement.appendChild(svgMinuteCircle)
	        }

	        for (var i = 0; i < 60; i++) {
	            if ((i % 5) === 0) {
	                var x = -(162 * (Math.sin(-Math.PI * 2 * (i / 60))));
	                var y = -(162 * (Math.cos(-Math.PI * 2 * (i / 60))));

	                var color = ((this.currentDate.format("m") == i) ? "#fff" : '#000');

	                var svgMinuteText = this.createSVGElement("text", { 'id': 'tm-' + i, 'class': 'dtp-select-minute-text', 'text-anchor': 'middle', 'style': 'cursor:pointer', 'font-weight': 'bold', 'font-size': '20', x: x, y: y + 7, fill: color, 'data-minute': i }); svgMinuteText.innerHTML = i;

	                if (!this.toggleTime(i, false)) {
	                    svgMinuteText.className += " disabled";
	                    svgMinuteText.setAttribute('fill', '#bdbdbd');
	                }
	                else {
	                    svgMinuteText.addEventListener('click', this._onSelectMinute.bind(this));
	                }

	                svgClockElement.appendChild(svgMinuteText)
	            }
	        }

	        this._centerBox();
	    },
	    animateHands: function () {
	        var H = this.currentDate.hour();
	        var M = this.currentDate.minute();

	        var hh = this.$dtpElement.find('.hour-hand');
	        hh[0].setAttribute('transform', "rotate(" + 360 * H / 12 + ")");

	        var mh = this.$dtpElement.find('.minute-hand');
	        mh[0].setAttribute('transform', "rotate(" + 360 * M / 60 + ")");
	    },
	    createSVGClock: function (isHour) {
	        var hl = ((this.params.shortTime) ? -120 : -90);

	        var svgElement = this.createSVGElement("svg", { class: 'svg-clock', viewBox: '0,0,400,400' });
	        var svgGElement = this.createSVGElement("g", { transform: 'translate(200,200) ' });
	        var svgClockFace = this.createSVGElement("circle", { r: '192', fill: '#eee', stroke: '#bdbdbd', 'stroke-width': 2 });
	        var svgClockCenter = this.createSVGElement("circle", { r: '15', fill: '#757575' });

	        svgGElement.appendChild(svgClockFace)

	        if (isHour) {
	            var svgMinuteHand = this.createSVGElement("line", { class: 'minute-hand', x1: 0, y1: 0, x2: 0, y2: -150, stroke: '#bdbdbd', 'stroke-width': 2 });
	            var svgHourHand = this.createSVGElement("line", { class: 'hour-hand', x1: 0, y1: 0, x2: 0, y2: hl, stroke: '#8BC34A', 'stroke-width': 8 });

	            svgGElement.appendChild(svgMinuteHand);
	            svgGElement.appendChild(svgHourHand);
	        }
	        else {
	            var svgMinuteHand = this.createSVGElement("line", { class: 'minute-hand', x1: 0, y1: 0, x2: 0, y2: -150, stroke: '#8BC34A', 'stroke-width': 2 });
	            var svgHourHand = this.createSVGElement("line", { class: 'hour-hand', x1: 0, y1: 0, x2: 0, y2: hl, stroke: '#bdbdbd', 'stroke-width': 8 });

	            svgGElement.appendChild(svgHourHand);
	            svgGElement.appendChild(svgMinuteHand);
	        }

	        svgGElement.appendChild(svgClockCenter)

	        svgElement.appendChild(svgGElement)

	        this.$dtpElement.find("#dtp-svg-clock").empty();
	        this.$dtpElement.find("#dtp-svg-clock")[0].appendChild(svgElement);

	        this.animateHands();

	        return svgGElement;
	    },
	    createSVGElement: function (tag, attrs) {
	        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
	        for (var k in attrs) {
	            el.setAttribute(k, attrs[k]);
	        }
	        return el;
	    },
	    isAfterMinDate: function (date, checkHour, checkMinute) {
	        var _return = true;

	        if (typeof (this.minDate) !== 'undefined' && this.minDate !== null) {
	            var _minDate = moment(this.minDate);
	            var _date = moment(date);

	            if (!checkHour && !checkMinute) {
	                _minDate.hour(0);
	                _minDate.minute(0);

	                _date.hour(0);
	                _date.minute(0);
	            }

	            _minDate.second(0);
	            _date.second(0);
	            _minDate.millisecond(0);
	            _date.millisecond(0);

	            if (!checkMinute) {
	                _date.minute(0);
	                _minDate.minute(0);

	                _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
	            }
	            else {
	                _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
	            }
	        }

	        return _return;
	    },
	    isBeforeMaxDate: function (date, checkTime, checkMinute) {
	        var _return = true;

	        if (typeof (this.maxDate) !== 'undefined' && this.maxDate !== null) {
	            var _maxDate = moment(this.maxDate);
	            var _date = moment(date);

	            if (!checkTime && !checkMinute) {
	                _maxDate.hour(0);
	                _maxDate.minute(0);

	                _date.hour(0);
	                _date.minute(0);
	            }

	            _maxDate.second(0);
	            _date.second(0);
	            _maxDate.millisecond(0);
	            _date.millisecond(0);

	            if (!checkMinute) {
	                _date.minute(0);
	                _maxDate.minute(0);

	                _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
	            }
	            else {
	                _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
	            }
	        }

	        return _return;
	    },
	    rotateElement: function (el, deg) {
	        $(el).css
			({
			    WebkitTransform: 'rotate(' + deg + 'deg)',
			    '-moz-transform': 'rotate(' + deg + 'deg)'
			});
	    },
	    showDate: function (date) {
	        if (date) {
	            this.$dtpElement.find('.dtp-actual-day').html(date.locale(this.params.lang).format('dddd'));
	            this.$dtpElement.find('.dtp-actual-month').html(date.locale(this.params.lang).format('MMM').toUpperCase());
	            this.$dtpElement.find('.dtp-actual-num').html(date.locale(this.params.lang).format('DD'));
	            this.$dtpElement.find('.dtp-actual-year').html(date.locale(this.params.lang).format('YYYY'));
	        }
	    },
	    showTime: function (date) {
	        if (date) {
	            var minutes = date.minute();
	            var content = ((this.params.shortTime) ? date.format('hh') : date.format('HH')) + ':' + ((minutes.toString().length == 2) ? minutes : '0' + minutes) + ((this.params.shortTime) ? ' ' + date.format('A') : '');

	            if (this.params.date)
	                this.$dtpElement.find('.dtp-actual-time').html(content);
	            else {
	                if (this.params.shortTime)
	                    this.$dtpElement.find('.dtp-actual-day').html(date.format('A'));
	                else
	                    this.$dtpElement.find('.dtp-actual-day').html('&nbsp;');

	                this.$dtpElement.find('.dtp-actual-maxtime').html(content);
	            }
	        }
	    },
	    selectDate: function (date) {
	        if (date) {
	            this.currentDate.date(date);

	            this.showDate(this.currentDate);
	            this.$element.trigger('dateSelected', this.currentDate);
	        }
	    },
	    generateCalendar: function (date) {
	        var _calendar = {};

	        if (date !== null) {
	            var startOfMonth = moment(date).locale(this.params.lang).startOf('month');
	            var endOfMonth = moment(date).locale(this.params.lang).endOf('month');

	            var iNumDay = startOfMonth.format('d');

	            _calendar.week = this.days;
	            _calendar.days = [];

	            for (var i = startOfMonth.date() ; i <= endOfMonth.date() ; i++) {
	                if (i === startOfMonth.date()) {
	                    var iWeek = _calendar.week.indexOf(iNumDay.toString());
	                    if (iWeek > 0) {
	                        for (var x = 0; x < iWeek; x++) {
	                            _calendar.days.push(0);
	                        }
	                    }
	                }
	                _calendar.days.push(moment(startOfMonth).locale(this.params.lang).date(i));
	            }
	        }

	        return _calendar;
	    },
	    constructHTMLCalendar: function (date, calendar) {
	        var _template = "";

	        _template += '<div class="dtp-picker-month">' + date.locale(this.params.lang).format('MMMM YYYY') + '</div>';
	        _template += '<table class="table dtp-picker-days"><thead>';
	        for (var i = 0; i < calendar.week.length; i++) {
	            _template += '<th>' + moment(parseInt(calendar.week[i]), "d").locale(this.params.lang).format("dd").substring(0, 1) + '</th>';
	        }

	        _template += '</thead>';
	        _template += '<tbody><tr>';

	        for (var i = 0; i < calendar.days.length; i++) {
	            if (i % 7 == 0)
	                _template += '</tr><tr>';
	            _template += '<td data-date="' + moment(calendar.days[i]).locale(this.params.lang).format("D") + '">';
	            if (calendar.days[i] != 0) {
	                if (this.isBeforeMaxDate(moment(calendar.days[i]), false, false) === false || this.isAfterMinDate(moment(calendar.days[i]), false, false) === false) {
	                    _template += '<span class="dtp-select-day">' + moment(calendar.days[i]).locale(this.params.lang).format("DD") + '</span>';
	                }
	                else {
	                    if (moment(calendar.days[i]).locale(this.params.lang).format("DD") === moment(this.currentDate).locale(this.params.lang).format("DD")) {
	                        _template += '<a href="javascript:void(0);" class="dtp-select-day selected">' + moment(calendar.days[i]).locale(this.params.lang).format("DD") + '</a>';
	                    }
	                    else {
	                        _template += '<a href="javascript:void(0);" class="dtp-select-day">' + moment(calendar.days[i]).locale(this.params.lang).format("DD") + '</a>';
	                    }
	                }

	                _template += '</td>';
	            }
	        }
	        _template += '</tr></tbody></table>';

	        return _template;
	    },
	    setName: function () {
	        var text = "";
	        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	        for (var i = 0; i < 5; i++) {
	            text += possible.charAt(Math.floor(Math.random() * possible.length));
	        }

	        return text;
	    },
	    isPM: function () {
	        return this.$dtpElement.find('a.dtp-meridien-pm').hasClass('selected');
	    },
	    setElementValue: function () {
	        this.$element.trigger('beforeChange', this.currentDate);
	        if (typeof ($.material) !== 'undefined') {
	            this.$element.removeClass('empty');
	        }
	        this.$element.val(moment(this.currentDate).locale(this.params.lang).format(this.params.format));
	        this.$element.trigger('change', this.currentDate);
	    },
	    toggleButtons: function (date) {
	        if (date && date.isValid()) {
	            var startOfMonth = moment(date).locale(this.params.lang).startOf('month');
	            var endOfMonth = moment(date).locale(this.params.lang).endOf('month');

	            if (!this.isAfterMinDate(startOfMonth, false, false)) {
	                this.$dtpElement.find('a.dtp-select-month-before').addClass('invisible');
	            }
	            else {
	                this.$dtpElement.find('a.dtp-select-month-before').removeClass('invisible');
	            }

	            if (!this.isBeforeMaxDate(endOfMonth, false, false)) {
	                this.$dtpElement.find('a.dtp-select-month-after').addClass('invisible');
	            }
	            else {
	                this.$dtpElement.find('a.dtp-select-month-after').removeClass('invisible');
	            }

	            var startOfYear = moment(date).locale(this.params.lang).startOf('year');
	            var endOfYear = moment(date).locale(this.params.lang).endOf('year');

	            if (!this.isAfterMinDate(startOfYear, false, false)) {
	                this.$dtpElement.find('a.dtp-select-year-before').addClass('invisible');
	            }
	            else {
	                this.$dtpElement.find('a.dtp-select-year-before').removeClass('invisible');
	            }

	            if (!this.isBeforeMaxDate(endOfYear, false, false)) {
	                this.$dtpElement.find('a.dtp-select-year-after').addClass('invisible');
	            }
	            else {
	                this.$dtpElement.find('a.dtp-select-year-after').removeClass('invisible');
	            }
	        }
	    },
	    toggleTime: function (value, isHours) {
	        var result = false;

	        if (isHours) {
	            var _date = moment(this.currentDate);
	            _date.hour(this.convertHours(value)).minute(0).second(0);

	            result = !(this.isAfterMinDate(_date, true, false) === false || this.isBeforeMaxDate(_date, true, false) === false);
	        }
	        else {
	            var _date = moment(this.currentDate);
	            _date.minute(value).second(0);

	            result = !(this.isAfterMinDate(_date, true, true) === false || this.isBeforeMaxDate(_date, true, true) === false);
	        }

	        return result;
	    },
	    _attachEvent: function (el, ev, fn) {
	        el.on(ev, null, null, fn);
	        this._attachedEvents.push([el, ev, fn]);
	    },
	    _detachEvents: function () {
	        for (var i = this._attachedEvents.length - 1; i >= 0; i--) {
	            this._attachedEvents[i][0].off(this._attachedEvents[i][1], this._attachedEvents[i][2]);
	            this._attachedEvents.splice(i, 1);
	        }
	    },
	    _onFocus: function () {
	        this.currentView = 0;
	        this.$element.blur();

	        this.initDates();

	        this.show();

	        if (this.params.date) {
	            this.$dtpElement.find('.dtp-date').removeClass('hidden');
	            this.initDate();
	        }
	        else {
	            if (this.params.time) {
	                this.$dtpElement.find('.dtp-time').removeClass('hidden');
	                this.initHours();
	            }
	        }
	    },
	    _onBackgroundClick: function (e) {
	        e.stopPropagation();
	        this.hide();
	    },
	    _onElementClick: function (e) {
	        e.stopPropagation();
	    },
	    _onKeydown: function (e) {
	        if (e.which === 27) {
	            this.hide();
	        }
	    },
	    _onCloseClick: function () {
	        this.hide();
	    },
	    _onClearClick: function () {
	        this.currentDate = null;
	        this.$element.trigger('beforeChange', this.currentDate);
	        this.hide();
	        if (typeof ($.material) !== 'undefined') {
	            this.$element.addClass('empty');
	        }
	        this.$element.val('');
	        this.$element.trigger('change', this.currentDate);
	    },
	    _onNowClick: function () {
	        this.currentDate = moment();

	        if (this.params.date === true) {
	            this.showDate(this.currentDate);

	            if (this.currentView === 0) {
	                this.initDate();
	            }
	        }

	        if (this.params.time === true) {
	            this.showTime(this.currentDate);

	            switch (this.currentView) {
	                case 1: this.initHours(); break;
	                case 2: this.initMinutes(); break;
	            }

	            this.animateHands();
	        }
	    },
	    _onOKClick: function () {
	        switch (this.currentView) {
	            case 0:
	                if (this.params.time === true) {
	                    this.initHours();
	                }
	                else {
	                    this.setElementValue();
	                    this.hide();
	                }
	                break;
	            case 1:
	                this.initMinutes();
	                break;
	            case 2:
	                this.setElementValue();
	                this.hide();
	                break;
	        }
	    },
	    _onCancelClick: function () {
	        if (this.params.time) {
	            switch (this.currentView) {
	                case 0:
	                    this.hide();
	                    break;
	                case 1:
	                    if (this.params.date) {
	                        this.initDate();
	                    }
	                    else {
	                        this.hide();
	                    }
	                    break;
	                case 2:
	                    this.initHours();
	                    break;
	            }
	        }
	        else {
	            this.hide();
	        }
	    },
	    _onMonthBeforeClick: function () {
	        this.currentDate.subtract(1, 'months');
	        this.initDate(this.currentDate);
	    },
	    _onMonthAfterClick: function () {
	        this.currentDate.add(1, 'months');
	        this.initDate(this.currentDate);
	    },
	    _onYearBeforeClick: function () {
	        this.currentDate.subtract(1, 'years');
	        this.initDate(this.currentDate);
	    },
	    _onYearAfterClick: function () {
	        this.currentDate.add(1, 'years');
	        this.initDate(this.currentDate);
	    },
	    _onSelectDate: function (e) {
	        this.$dtpElement.find('a.dtp-select-day').removeClass('selected');
	        $(e.currentTarget).addClass('selected');

	        this.selectDate($(e.currentTarget).parent().data("date"));

	        if (this.params.switchOnClick === true && this.params.time === true)
	            setTimeout(this.initHours.bind(this), 200);
	    },
	    _onSelectHour: function (e) {
	        if (!$(e.target).hasClass('disabled')) {
	            var value = $(e.target).data('hour');
	            var parent = $(e.target).parent();

	            var h = parent.find('.dtp-select-hour');
	            for (var i = 0; i < h.length; i++) {
	                $(h[i]).attr('fill', 'transparent');
	            }
	            var th = parent.find('.dtp-select-hour-text');
	            for (var i = 0; i < th.length; i++) {
	                $(th[i]).attr('fill', '#000');
	            }

	            $(parent.find('#h-' + value)).attr('fill', '#8BC34A');
	            $(parent.find('#th-' + value)).attr('fill', '#fff');

	            this.currentDate.hour(parseInt(value));
	            this.showTime(this.currentDate);

	            this.animateHands();

	            if (this.params.shortTime === true && this.isPM()) {
	                dataHour += 12;
	            }

	            if (this.params.switchOnClick === true)
	                setTimeout(this.initMinutes.bind(this), 200);
	        }
	    },
	    _onSelectMinute: function (e) {
	        if (!$(e.target).hasClass('disabled')) {
	            var value = $(e.target).data('minute');
	            var parent = $(e.target).parent();

	            var m = parent.find('.dtp-select-minute');
	            for (var i = 0; i < m.length; i++) {
	                $(m[i]).attr('fill', 'transparent');
	            }
	            var tm = parent.find('.dtp-select-minute-text');
	            for (var i = 0; i < tm.length; i++) {
	                $(tm[i]).attr('fill', '#000');
	            }

	            $(parent.find('#m-' + value)).attr('fill', '#8BC34A');
	            $(parent.find('#tm-' + value)).attr('fill', '#fff');

	            this.currentDate.minute(parseInt(value));
	            this.showTime(this.currentDate);

	            this.animateHands();
	        }
	    },
	    _onSelectAM: function (e) {
	        $('.dtp-actual-meridien').find('a').removeClass('selected');
	        $(e.currentTarget).addClass('selected');

	        if (this.currentDate.hour() >= 12) {
	            if (this.currentDate.subtract(12, 'hours'))
	                this.showTime(this.currentDate);
	        }
	        this.toggleTime((this.currentView === 1));
	    },
	    _onSelectPM: function (e) {
	        $('.dtp-actual-meridien').find('a').removeClass('selected');
	        $(e.currentTarget).addClass('selected');

	        if (this.currentDate.hour() < 12) {
	            if (this.currentDate.add(12, 'hours'))
	                this.showTime(this.currentDate);
	        }
	        this.toggleTime((this.currentView === 1));
	    },
	    convertHours: function (h) {
	        var _return = h;

	        if (this.params.shortTime === true) {
	            if ((h < 12) && this.isPM()) {
	                _return += 12;
	            }
	        }

	        return _return;
	    },
	    setDate: function (date) {
	        this.params.currentDate = date;
	        this.initDates();
	    },
	    setMinDate: function (date) {
	        this.params.minDate = date;
	        this.initDates();
	    },
	    setMaxDate: function (date) {
	        this.params.maxDate = date;
	        this.initDates();
	    },
	    destroy: function () {
	        this._detachEvents();
	        this.$dtpElement.remove();
	    },
	    show: function () {
	        this.$dtpElement.removeClass('hidden');
	        this._attachEvent($(window), 'keydown', this._onKeydown.bind(this));
	        this._centerBox();
	    },
	    hide: function () {
	        $(window).off('keydown', null, null, this._onKeydown.bind(this));
	        this.$dtpElement.addClass('hidden');
	    },
	    _centerBox: function () {
	        var h = (this.$dtpElement.height() - this.$dtpElement.find('.dtp-content').height()) / 2;
	        this.$dtpElement.find('.dtp-content').css('marginLeft', -(this.$dtpElement.find('.dtp-content').width() / 2) + 'px');
	        this.$dtpElement.find('.dtp-content').css('top', h + 'px');
	    }
	};
})(jQuery, moment);

///#source 1 1 /Scripts/bootstrap-maxlength.js
(function ($) {
    'use strict';
    /**
     * We need an event when the elements are destroyed
     * because if an input is removed, we have to remove the
     * maxlength object associated (if any).
     * From:
     * http://stackoverflow.com/questions/2200494/jquery-trigger-event-when-an-element-is-removed-from-the-dom
     */
    if (!$.event.special.destroyed) {
        $.event.special.destroyed = {
            remove: function (o) {
                if (o.handler) {
                    o.handler();
                }
            }
        };
    }


    $.fn.extend({
        maxlength: function (options, callback) {
            var documentBody = $('body'),
              defaults = {
                  showOnReady: false, // true to always show when indicator is ready
                  alwaysShow: false, // if true the indicator it's always shown.
                  threshold: 10, // Represents how many chars left are needed to show up the counter
                  warningClass: 'label label-success',
                  limitReachedClass: 'label label-important label-danger',
                  separator: ' / ',
                  preText: '',
                  postText: '',
                  showMaxLength: true,
                  placement: 'bottom',
                  message: null, // an alternative way to provide the message text
                  showCharsTyped: true, // show the number of characters typed and not the number of characters remaining
                  validate: false, // if the browser doesn't support the maxlength attribute, attempt to type more than
                  // the indicated chars, will be prevented.
                  utf8: false, // counts using bytesize rather than length. eg: '£' is counted as 2 characters.
                  appendToParent: false, // append the indicator to the input field's parent instead of body
                  twoCharLinebreak: true,  // count linebreak as 2 characters to match IE/Chrome textarea validation. As well as DB storage.
                  customMaxAttribute: null,  // null = use maxlength attribute and browser functionality, string = use specified attribute instead.
                  allowOverMax: false
                  // Form submit validation is handled on your own.  when maxlength has been exceeded 'overmax' class added to element
              };

            if ($.isFunction(options) && !callback) {
                callback = options;
                options = {};
            }
            options = $.extend(defaults, options);

            /**
            * Return the length of the specified input.
            *
            * @param input
            * @return {number}
            */
            function inputLength(input) {
                var text = input.val();

                if (options.twoCharLinebreak) {
                    // Count all line breaks as 2 characters
                    text = text.replace(/\r(?!\n)|\n(?!\r)/g, '\r\n');
                } else {
                    // Remove all double-character (\r\n) linebreaks, so they're counted only once.
                    text = text.replace(new RegExp('\r?\n', 'g'), '\n');
                }

                var currentLength = 0;

                if (options.utf8) {
                    currentLength = utf8Length(text);
                } else {
                    currentLength = text.length;
                }
                return currentLength;
            }

            /**
            * Truncate the text of the specified input.
            *
            * @param input
            * @param limit
            */
            function truncateChars(input, maxlength) {
                var text = input.val();
                var newlines = 0;

                if (options.twoCharLinebreak) {
                    text = text.replace(/\r(?!\n)|\n(?!\r)/g, '\r\n');

                    if (text.substr(text.length - 1) === '\n' && text.length % 2 === 1) {
                        newlines = 1;
                    }
                }

                input.val(text.substr(0, maxlength - newlines));
            }

            /**
            * Return the length of the specified input in UTF8 encoding.
            *
            * @param input
            * @return {number}
            */
            function utf8Length(string) {
                var utf8length = 0;
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utf8length++;
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utf8length = utf8length + 2;
                    }
                    else {
                        utf8length = utf8length + 3;
                    }
                }
                return utf8length;
            }

            /**
             * Return true if the indicator should be showing up.
             *
             * @param input
             * @param thereshold
             * @param maxlength
             * @return {number}
             */
            function charsLeftThreshold(input, thereshold, maxlength) {
                var output = true;
                if (!options.alwaysShow && (maxlength - inputLength(input) > thereshold)) {
                    output = false;
                }
                return output;
            }

            /**
             * Returns how many chars are left to complete the fill up of the form.
             *
             * @param input
             * @param maxlength
             * @return {number}
             */
            function remainingChars(input, maxlength) {
                var length = maxlength - inputLength(input);
                return length;
            }

            /**
             * When called displays the indicator.
             *
             * @param indicator
             */
            function showRemaining(currentInput, indicator) {
                indicator.css({
                    display: 'block'
                });
                currentInput.trigger('maxlength.shown');
            }

            /**
             * When called shows the indicator.
             *
             * @param indicator
             */
            function hideRemaining(currentInput, indicator) {

                if (options.alwaysShow) {
                    return;
                }

                indicator.css({
                    display: 'none'
                });
                currentInput.trigger('maxlength.hidden');
            }

            /**
            * This function updates the value in the indicator
            *
            * @param maxLengthThisInput
            * @param typedChars
            * @return String
            */
            function updateMaxLengthHTML(currentInputText, maxLengthThisInput, typedChars) {
                var output = '';
                if (options.message) {
                    if (typeof options.message === 'function') {
                        output = options.message(currentInputText, maxLengthThisInput);
                    } else {
                        output = options.message.replace('%charsTyped%', typedChars)
                          .replace('%charsRemaining%', maxLengthThisInput - typedChars)
                          .replace('%charsTotal%', maxLengthThisInput);
                    }
                } else {
                    if (options.preText) {
                        output += options.preText;
                    }
                    if (!options.showCharsTyped) {
                        output += maxLengthThisInput - typedChars;
                    }
                    else {
                        output += typedChars;
                    }
                    if (options.showMaxLength) {
                        output += options.separator + maxLengthThisInput;
                    }
                    if (options.postText) {
                        output += options.postText;
                    }
                }
                return output;
            }

            /**
             * This function updates the value of the counter in the indicator.
             * Wants as parameters: the number of remaining chars, the element currently managed,
             * the maxLength for the current input and the indicator generated for it.
             *
             * @param remaining
             * @param currentInput
             * @param maxLengthCurrentInput
             * @param maxLengthIndicator
             */
            function manageRemainingVisibility(remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator) {
                if (maxLengthIndicator) {
                    maxLengthIndicator.html(updateMaxLengthHTML(currentInput.val(), maxLengthCurrentInput, (maxLengthCurrentInput - remaining)));

                    if (remaining > 0) {
                        if (charsLeftThreshold(currentInput, options.threshold, maxLengthCurrentInput)) {
                            showRemaining(currentInput, maxLengthIndicator.removeClass(options.limitReachedClass).addClass(options.warningClass));
                        } else {
                            hideRemaining(currentInput, maxLengthIndicator);
                        }
                    } else {
                        showRemaining(currentInput, maxLengthIndicator.removeClass(options.warningClass).addClass(options.limitReachedClass));
                    }
                }

                if (options.customMaxAttribute) {
                    // class to use for form validation on custom maxlength attribute
                    if (remaining < 0) {
                        currentInput.addClass('overmax');
                    } else {
                        currentInput.removeClass('overmax');
                    }
                }
            }

            /**
             * This function returns an object containing all the
             * informations about the position of the current input
             *
             * @param currentInput
             * @return object {bottom height left right top width}
             *
             */
            function getPosition(currentInput) {
                var el = currentInput[0];
                return $.extend({}, (typeof el.getBoundingClientRect === 'function') ? el.getBoundingClientRect() : {
                    width: el.offsetWidth,
                    height: el.offsetHeight
                }, currentInput.offset());
            }

            /**
             * This function places the maxLengthIndicator at the
             * top / bottom / left / right of the currentInput
             *
             * @param currentInput
             * @param maxLengthIndicator
             * @return null
             *
             */
            function place(currentInput, maxLengthIndicator) {
                var pos = getPosition(currentInput);

                // Supports custom placement handler
                if ($.type(options.placement) === 'function') {
                    options.placement(currentInput, maxLengthIndicator, pos);
                    return;
                }

                // Supports custom placement via css positional properties
                if ($.isPlainObject(options.placement)) {
                    placeWithCSS(options.placement, maxLengthIndicator);
                    return;
                }

                var inputOuter = currentInput.outerWidth(),
                  outerWidth = maxLengthIndicator.outerWidth(),
                  actualWidth = maxLengthIndicator.width(),
                  actualHeight = maxLengthIndicator.height();

                // get the right position if the indicator is appended to the input's parent
                if (options.appendToParent) {
                    pos.top -= currentInput.parent().offset().top;
                    pos.left -= currentInput.parent().offset().left;
                }

                switch (options.placement) {
                    case 'bottom':
                        maxLengthIndicator.css({ top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 });
                        break;
                    case 'top':
                        maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 });
                        break;
                    case 'left':
                        maxLengthIndicator.css({ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth });
                        break;
                    case 'right':
                        maxLengthIndicator.css({ top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width });
                        break;
                    case 'bottom-right':
                        maxLengthIndicator.css({ top: pos.top + pos.height, left: pos.left + pos.width });
                        break;
                    case 'top-right':
                        maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left + inputOuter });
                        break;
                    case 'top-left':
                        maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left - outerWidth });
                        break;
                    case 'bottom-left':
                        maxLengthIndicator.css({ top: pos.top + currentInput.outerHeight(), left: pos.left - outerWidth });
                        break;
                    case 'centered-right':
                        maxLengthIndicator.css({ top: pos.top + (actualHeight / 2), left: pos.left + inputOuter - outerWidth - 3 });
                        break;

                        // Some more options for placements
                    case 'bottom-right-inside':
                        maxLengthIndicator.css({ top: pos.top + pos.height, left: pos.left + pos.width - outerWidth });
                        break;
                    case 'top-right-inside':
                        maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left + inputOuter - outerWidth });
                        break;
                    case 'top-left-inside':
                        maxLengthIndicator.css({ top: pos.top - actualHeight, left: pos.left });
                        break;
                    case 'bottom-left-inside':
                        maxLengthIndicator.css({ top: pos.top + currentInput.outerHeight(), left: pos.left });
                        break;
                }
            }

            /**
             * This function places the maxLengthIndicator based on placement config object.
             *
             * @param {object} placement
             * @param {$} maxLengthIndicator
             * @return null
             *
             */
            function placeWithCSS(placement, maxLengthIndicator) {
                if (!placement || !maxLengthIndicator) {
                    return;
                }

                var POSITION_KEYS = [
                  'top',
                  'bottom',
                  'left',
                  'right',
                  'position'
                ];

                var cssPos = {};

                // filter css properties to position
                $.each(POSITION_KEYS, function (i, key) {
                    var val = options.placement[key];
                    if (typeof val !== 'undefined') {
                        cssPos[key] = val;
                    }
                });

                maxLengthIndicator.css(cssPos);

                return;
            }

            /**
             * This function returns true if the indicator position needs to
             * be recalculated when the currentInput changes
             *
             * @return {boolean}
             *
             */
            function isPlacementMutable() {
                return options.placement === 'bottom-right-inside' || options.placement === 'top-right-inside' || typeof options.placement === 'function' || (options.message && typeof options.message === 'function');
            }

            /**
             * This function retrieves the maximum length of currentInput
             *
             * @param currentInput
             * @return {number}
             *
             */
            function getMaxLength(currentInput) {
                var max = currentInput.attr('maxlength') || options.customMaxAttribute;

                if (options.customMaxAttribute && !options.allowOverMax) {
                    var custom = currentInput.attr(options.customMaxAttribute);
                    if (!max || custom < max) {
                        max = custom;
                    }
                }

                if (!max) {
                    max = currentInput.attr('size');
                }
                return max;
            }

            return this.each(function () {

                var currentInput = $(this),
                  maxLengthCurrentInput,
                  maxLengthIndicator;

                $(window).resize(function () {
                    if (maxLengthIndicator) {
                        place(currentInput, maxLengthIndicator);
                    }
                });

                function firstInit() {
                    var maxlengthContent = updateMaxLengthHTML(currentInput.val(), maxLengthCurrentInput, '0');
                    maxLengthCurrentInput = getMaxLength(currentInput);

                    if (!maxLengthIndicator) {
                        maxLengthIndicator = $('<span class="bootstrap-maxlength"></span>').css({
                            display: 'none',
                            position: 'absolute',
                            whiteSpace: 'nowrap',
                            zIndex: 1099
                        }).html(maxlengthContent);
                    }

                    // We need to detect resizes if we are dealing with a textarea:
                    if (currentInput.is('textarea')) {
                        currentInput.data('maxlenghtsizex', currentInput.outerWidth());
                        currentInput.data('maxlenghtsizey', currentInput.outerHeight());

                        currentInput.mouseup(function () {
                            if (currentInput.outerWidth() !== currentInput.data('maxlenghtsizex') || currentInput.outerHeight() !== currentInput.data('maxlenghtsizey')) {
                                place(currentInput, maxLengthIndicator);
                            }

                            currentInput.data('maxlenghtsizex', currentInput.outerWidth());
                            currentInput.data('maxlenghtsizey', currentInput.outerHeight());
                        });
                    }

                    if (options.appendToParent) {
                        currentInput.parent().append(maxLengthIndicator);
                        currentInput.parent().css('position', 'relative');
                    } else {
                        documentBody.append(maxLengthIndicator);
                    }

                    var remaining = remainingChars(currentInput, getMaxLength(currentInput));
                    manageRemainingVisibility(remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator);
                    place(currentInput, maxLengthIndicator);
                }

                if (options.showOnReady) {
                    currentInput.ready(function () {
                        firstInit();
                    });
                } else {
                    currentInput.focus(function () {
                        firstInit();
                    });
                }

                currentInput.on('maxlength.reposition', function () {
                    place(currentInput, maxLengthIndicator);
                });


                currentInput.on('destroyed', function () {
                    if (maxLengthIndicator) {
                        maxLengthIndicator.remove();
                    }
                });

                currentInput.on('blur', function () {
                    if (maxLengthIndicator && !options.showOnReady && !options.alwaysShow) {
                        maxLengthIndicator.remove();
                    }
                });

                currentInput.on('input', function () {
                    var maxlength = getMaxLength(currentInput),
                      remaining = remainingChars(currentInput, maxlength),
                      output = true;

                    if (options.validate && remaining < 0) {
                        truncateChars(currentInput, maxlength);
                        output = false;
                    } else {
                        manageRemainingVisibility(remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator);
                    }

                    if (isPlacementMutable()) {
                        place(currentInput, maxLengthIndicator);
                    }

                    return output;
                });
            });
        }
    });
}(jQuery));
///#source 1 1 /Scripts/bootstrap-multiselect.js
/**
 * Bootstrap Multiselect (https://github.com/davidstutz/bootstrap-multiselect)
 * 
 * Apache License, Version 2.0:
 * Copyright (c) 2012 - 2015 David Stutz
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a
 * copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 * 
 * BSD 3-Clause License:
 * Copyright (c) 2012 - 2015 David Stutz
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 *    - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 *    - Neither the name of David Stutz nor the names of its contributors may be
 *      used to endorse or promote products derived from this software without
 *      specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
!function ($) {
    "use strict";// jshint ;_;

    if (typeof ko !== 'undefined' && ko.bindingHandlers && !ko.bindingHandlers.multiselect) {
        ko.bindingHandlers.multiselect = {
            after: ['options', 'value', 'selectedOptions', 'enable', 'disable'],

            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect(config);

                if (allBindings.has('options')) {
                    var options = allBindings.get('options');
                    if (ko.isObservable(options)) {
                        ko.computed({
                            read: function () {
                                options();
                                setTimeout(function () {
                                    var ms = $element.data('multiselect');
                                    if (ms)
                                        ms.updateOriginalOptions();//Not sure how beneficial this is.
                                    $element.multiselect('rebuild');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        });
                    }
                }

                //value and selectedOptions are two-way, so these will be triggered even by our own actions.
                //It needs some way to tell if they are triggered because of us or because of outside change.
                //It doesn't loop but it's a waste of processing.
                if (allBindings.has('value')) {
                    var value = allBindings.get('value');
                    if (ko.isObservable(value)) {
                        ko.computed({
                            read: function () {
                                value();
                                setTimeout(function () {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                //Switched from arrayChange subscription to general subscription using 'refresh'.
                //Not sure performance is any better using 'select' and 'deselect'.
                if (allBindings.has('selectedOptions')) {
                    var selectedOptions = allBindings.get('selectedOptions');
                    if (ko.isObservable(selectedOptions)) {
                        ko.computed({
                            read: function () {
                                selectedOptions();
                                setTimeout(function () {
                                    $element.multiselect('refresh');
                                }, 1);
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    }
                }

                var setEnabled = function (enable) {
                    setTimeout(function () {
                        if (enable)
                            $element.multiselect('enable');
                        else
                            $element.multiselect('disable');
                    });
                };

                if (allBindings.has('enable')) {
                    var enable = allBindings.get('enable');
                    if (ko.isObservable(enable)) {
                        ko.computed({
                            read: function () {
                                setEnabled(enable());
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    } else {
                        setEnabled(enable);
                    }
                }

                if (allBindings.has('disable')) {
                    var disable = allBindings.get('disable');
                    if (ko.isObservable(disable)) {
                        ko.computed({
                            read: function () {
                                setEnabled(!disable());
                            },
                            disposeWhenNodeIsRemoved: element
                        }).extend({ rateLimit: 100, notifyWhenChangesStop: true });
                    } else {
                        setEnabled(!disable);
                    }
                }

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    $element.multiselect('destroy');
                });
            },

            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var config = ko.toJS(valueAccessor());

                $element.multiselect('setOptions', config);
                $element.multiselect('rebuild');
            }
        };
    }

    function forEach(array, callback) {
        for (var index = 0; index < array.length; ++index) {
            callback(array[index], index);
        }
    }

    /**
     * Constructor to create a new multiselect using the given select.
     *
     * @param {jQuery} select
     * @param {Object} options
     * @returns {Multiselect}
     */
    function Multiselect(select, options) {

        this.$select = $(select);

        // Placeholder via data attributes
        if (this.$select.attr("data-placeholder")) {
            options.nonSelectedText = this.$select.data("placeholder");
        }

        this.options = this.mergeOptions($.extend({}, options, this.$select.data()));

        // Initialization.
        // We have to clone to create a new reference.
        this.originalOptions = this.$select.clone()[0].options;
        this.query = '';
        this.searchTimeout = null;
        this.lastToggledInput = null;

        this.options.multiple = this.$select.attr('multiple') === "multiple";
        this.options.onChange = $.proxy(this.options.onChange, this);
        this.options.onDropdownShow = $.proxy(this.options.onDropdownShow, this);
        this.options.onDropdownHide = $.proxy(this.options.onDropdownHide, this);
        this.options.onDropdownShown = $.proxy(this.options.onDropdownShown, this);
        this.options.onDropdownHidden = $.proxy(this.options.onDropdownHidden, this);
        this.options.onInitialized = $.proxy(this.options.onInitialized, this);

        // Build select all if enabled.
        this.buildContainer();
        this.buildButton();
        this.buildDropdown();
        this.buildSelectAll();
        this.buildDropdownOptions();
        this.buildFilter();

        this.updateButtonText();
        this.updateSelectAll(true);

        if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
            this.disable();
        }

        this.$select.hide().after(this.$container);
        this.options.onInitialized(this.$select, this.$container);
    }

    Multiselect.prototype = {

        defaults: {
            /**
             * Default text function will either print 'None selected' in case no
             * option is selected or a list of the selected options up to a length
             * of 3 selected options.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {String}
             */
            buttonText: function (options, select) {
                if (this.disabledText.length > 0
                        && (this.disableIfEmpty || select.prop('disabled'))
                        && options.length == 0) {

                    return this.disabledText;
                }
                else if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else if (this.allSelectedText
                        && options.length === $('option', $(select)).length
                        && $('option', $(select)).length !== 1
                        && this.multiple) {

                    if (this.selectAllNumber) {
                        return this.allSelectedText + ' (' + options.length + ')';
                    }
                    else {
                        return this.allSelectedText;
                    }
                }
                else if (options.length > this.numberDisplayed) {
                    return options.length + ' ' + this.nSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;

                    options.each(function () {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });

                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Updates the title of the button similar to the buttonText function.
             * 
             * @param {jQuery} options
             * @param {jQuery} select
             * @returns {@exp;selected@call;substr}
             */
            buttonTitle: function (options, select) {
                if (options.length === 0) {
                    return this.nonSelectedText;
                }
                else {
                    var selected = '';
                    var delimiter = this.delimiterText;

                    options.each(function () {
                        var label = ($(this).attr('label') !== undefined) ? $(this).attr('label') : $(this).text();
                        selected += label + delimiter;
                    });
                    return selected.substr(0, selected.length - 2);
                }
            },
            /**
             * Create a label.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionLabel: function (element) {
                return $(element).attr('label') || $(element).text();
            },
            /**
             * Create a class.
             *
             * @param {jQuery} element
             * @returns {String}
             */
            optionClass: function (element) {
                return $(element).attr('class') || '';
            },
            /**
             * Triggered on change of the multiselect.
             * 
             * Not triggered when selecting/deselecting options manually.
             * 
             * @param {jQuery} option
             * @param {Boolean} checked
             */
            onChange: function (option, checked) {

            },
            /**
             * Triggered when the dropdown is shown.
             *
             * @param {jQuery} event
             */
            onDropdownShow: function (event) {

            },
            /**
             * Triggered when the dropdown is hidden.
             *
             * @param {jQuery} event
             */
            onDropdownHide: function (event) {

            },
            /**
             * Triggered after the dropdown is shown.
             * 
             * @param {jQuery} event
             */
            onDropdownShown: function (event) {

            },
            /**
             * Triggered after the dropdown is hidden.
             * 
             * @param {jQuery} event
             */
            onDropdownHidden: function (event) {

            },
            /**
             * Triggered on select all.
             */
            onSelectAll: function (checked) {

            },
            /**
             * Triggered after initializing.
             *
             * @param {jQuery} $select
             * @param {jQuery} $container
             */
            onInitialized: function ($select, $container) {

            },
            enableHTML: false,
            buttonClass: 'btn btn-default',
            inheritClass: false,
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            dropRight: false,
            dropUp: false,
            selectedClass: 'active',
            // Maximum height of the dropdown menu.
            // If maximum height is exceeded a scrollbar will be displayed.
            maxHeight: false,
            checkboxName: false,
            includeSelectAllOption: false,
            includeSelectAllIfMoreThan: 0,
            selectAllText: ' Select all',
            selectAllValue: 'multiselect-all',
            selectAllName: false,
            selectAllNumber: true,
            selectAllJustVisible: true,
            enableFiltering: false,
            enableCaseInsensitiveFiltering: false,
            enableFullValueFiltering: false,
            enableClickableOptGroups: false,
            enableCollapsibelOptGroups: false,
            filterPlaceholder: 'Search',
            // possible options: 'text', 'value', 'both'
            filterBehavior: 'text',
            includeFilterClearBtn: true,
            preventInputChangeEvent: false,
            nonSelectedText: 'None selected',
            nSelectedText: 'selected',
            allSelectedText: 'All selected',
            numberDisplayed: 3,
            disableIfEmpty: false,
            disabledText: '',
            delimiterText: ', ',
            templates: {
                button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>',
                ul: '<ul class="multiselect-container dropdown-menu"></ul>',
                filter: '<li class="multiselect-item filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>',
                filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>',
                li: '<li><a tabindex="0"><label></label></a></li>',
                divider: '<li class="multiselect-item divider"></li>',
                liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>'
            }
        },

        constructor: Multiselect,

        /**
         * Builds the container of the multiselect.
         */
        buildContainer: function () {
            this.$container = $(this.options.buttonContainer);
            this.$container.on('show.bs.dropdown', this.options.onDropdownShow);
            this.$container.on('hide.bs.dropdown', this.options.onDropdownHide);
            this.$container.on('shown.bs.dropdown', this.options.onDropdownShown);
            this.$container.on('hidden.bs.dropdown', this.options.onDropdownHidden);
        },

        /**
         * Builds the button of the multiselect.
         */
        buildButton: function () {
            this.$button = $(this.options.templates.button).addClass(this.options.buttonClass);
            if (this.$select.attr('class') && this.options.inheritClass) {
                this.$button.addClass(this.$select.attr('class'));
            }
            // Adopt active state.
            if (this.$select.prop('disabled')) {
                this.disable();
            }
            else {
                this.enable();
            }

            // Manually add button width if set.
            if (this.options.buttonWidth && this.options.buttonWidth !== 'auto') {
                this.$button.css({
                    'width': this.options.buttonWidth,
                    'overflow': 'hidden',
                    'text-overflow': 'ellipsis'
                });
                this.$container.css({
                    'width': this.options.buttonWidth
                });
            }

            // Keep the tab index from the select.
            var tabindex = this.$select.attr('tabindex');
            if (tabindex) {
                this.$button.attr('tabindex', tabindex);
            }

            this.$container.prepend(this.$button);
        },

        /**
         * Builds the ul representing the dropdown menu.
         */
        buildDropdown: function () {

            // Build ul.
            this.$ul = $(this.options.templates.ul);

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }

            // Set max height of dropdown menu to activate auto scrollbar.
            if (this.options.maxHeight) {
                // TODO: Add a class for this option to move the css declarations.
                this.$ul.css({
                    'max-height': this.options.maxHeight + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden'
                });
            }

            if (this.options.dropUp) {

                var height = Math.min(this.options.maxHeight, $('option[data-role!="divider"]', this.$select).length * 26 + $('option[data-role="divider"]', this.$select).length * 19 + (this.options.includeSelectAllOption ? 26 : 0) + (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering ? 44 : 0));
                var moveCalc = height + 34;

                this.$ul.css({
                    'max-height': height + 'px',
                    'overflow-y': 'auto',
                    'overflow-x': 'hidden',
                    'margin-top': "-" + moveCalc + 'px'
                });
            }

            this.$container.append(this.$ul);
        },

        /**
         * Build the dropdown options and binds all nessecary events.
         * 
         * Uses createDivider and createOptionValue to create the necessary options.
         */
        buildDropdownOptions: function () {

            this.$select.children().each($.proxy(function (index, element) {

                var $element = $(element);
                // Support optgroups and options without a group simultaneously.
                var tag = $element.prop('tagName')
                    .toLowerCase();

                if ($element.prop('value') === this.options.selectAllValue) {
                    return;
                }

                if (tag === 'optgroup') {
                    this.createOptgroup(element);
                }
                else if (tag === 'option') {

                    if ($element.data('role') === 'divider') {
                        this.createDivider();
                    }
                    else {
                        this.createOptionValue(element);
                    }

                }

                // Other illegal tags will be ignored.
            }, this));

            // Bind the change event on the dropdown elements.
            $('li input', this.$ul).on('change', $.proxy(function (event) {
                var $target = $(event.target);

                var checked = $target.prop('checked') || false;
                var isSelectAllOption = $target.val() === this.options.selectAllValue;

                // Apply or unapply the configured selected class.
                if (this.options.selectedClass) {
                    if (checked) {
                        $target.closest('li')
                            .addClass(this.options.selectedClass);
                    }
                    else {
                        $target.closest('li')
                            .removeClass(this.options.selectedClass);
                    }
                }

                // Get the corresponding option.
                var value = $target.val();
                var $option = this.getOptionByValue(value);

                var $optionsNotThis = $('option', this.$select).not($option);
                var $checkboxesNotThis = $('input', this.$container).not($target);

                if (isSelectAllOption) {
                    if (checked) {
                        this.selectAll(this.options.selectAllJustVisible);
                    }
                    else {
                        this.deselectAll(this.options.selectAllJustVisible);
                    }
                }
                else {
                    if (checked) {
                        $option.prop('selected', true);

                        if (this.options.multiple) {
                            // Simply select additional option.
                            $option.prop('selected', true);
                        }
                        else {
                            // Unselect all other options and corresponding checkboxes.
                            if (this.options.selectedClass) {
                                $($checkboxesNotThis).closest('li').removeClass(this.options.selectedClass);
                            }

                            $($checkboxesNotThis).prop('checked', false);
                            $optionsNotThis.prop('selected', false);

                            // It's a single selection, so close.
                            this.$button.click();
                        }

                        if (this.options.selectedClass === "active") {
                            $optionsNotThis.closest("a").css("outline", "");
                        }
                    }
                    else {
                        // Unselect option.
                        $option.prop('selected', false);
                    }

                    // To prevent select all from firing onChange: #575
                    this.options.onChange($option, checked);
                }

                this.$select.change();

                this.updateButtonText();
                this.updateSelectAll();

                if (this.options.preventInputChangeEvent) {
                    return false;
                }
            }, this));

            $('li a', this.$ul).on('mousedown', function (e) {
                if (e.shiftKey) {
                    // Prevent selecting text by Shift+click
                    return false;
                }
            });

            $('li a', this.$ul).on('touchstart click', $.proxy(function (event) {
                event.stopPropagation();

                var $target = $(event.target);

                if (event.shiftKey && this.options.multiple) {
                    if ($target.is("label")) { // Handles checkbox selection manually (see https://github.com/davidstutz/bootstrap-multiselect/issues/431)
                        event.preventDefault();
                        $target = $target.find("input");
                        $target.prop("checked", !$target.prop("checked"));
                    }
                    var checked = $target.prop('checked') || false;

                    if (this.lastToggledInput !== null && this.lastToggledInput !== $target) { // Make sure we actually have a range
                        var from = $target.closest("li").index();
                        var to = this.lastToggledInput.closest("li").index();

                        if (from > to) { // Swap the indices
                            var tmp = to;
                            to = from;
                            from = tmp;
                        }

                        // Make sure we grab all elements since slice excludes the last index
                        ++to;

                        // Change the checkboxes and underlying options
                        var range = this.$ul.find("li").slice(from, to).find("input");

                        range.prop('checked', checked);

                        if (this.options.selectedClass) {
                            range.closest('li')
                                .toggleClass(this.options.selectedClass, checked);
                        }

                        for (var i = 0, j = range.length; i < j; i++) {
                            var $checkbox = $(range[i]);

                            var $option = this.getOptionByValue($checkbox.val());

                            $option.prop('selected', checked);
                        }
                    }

                    // Trigger the select "change" event
                    $target.trigger("change");
                }

                // Remembers last clicked option
                if ($target.is("input") && !$target.closest("li").is(".multiselect-item")) {
                    this.lastToggledInput = $target;
                }

                $target.blur();
            }, this));

            // Keyboard support.
            this.$container.off('keydown.multiselect').on('keydown.multiselect', $.proxy(function (event) {
                if ($('input[type="text"]', this.$container).is(':focus')) {
                    return;
                }

                if (event.keyCode === 9 && this.$container.hasClass('open')) {
                    this.$button.click();
                }
                else {
                    var $items = $(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible");

                    if (!$items.length) {
                        return;
                    }

                    var index = $items.index($items.filter(':focus'));

                    // Navigation up.
                    if (event.keyCode === 38 && index > 0) {
                        index--;
                    }
                        // Navigate down.
                    else if (event.keyCode === 40 && index < $items.length - 1) {
                        index++;
                    }
                    else if (!~index) {
                        index = 0;
                    }

                    var $current = $items.eq(index);
                    $current.focus();

                    if (event.keyCode === 32 || event.keyCode === 13) {
                        var $checkbox = $current.find('input');

                        $checkbox.prop("checked", !$checkbox.prop("checked"));
                        $checkbox.change();
                    }

                    event.stopPropagation();
                    event.preventDefault();
                }
            }, this));

            if (this.options.enableClickableOptGroups && this.options.multiple) {
                $('li.multiselect-group', this.$ul).on('click', $.proxy(function (event) {
                    event.stopPropagation();
                    console.log('test');
                    var group = $(event.target).parent();

                    // Search all option in optgroup
                    var $options = group.nextUntil('li.multiselect-group');
                    var $visibleOptions = $options.filter(":visible:not(.disabled)");

                    // check or uncheck items
                    var allChecked = true;
                    var optionInputs = $visibleOptions.find('input');
                    var values = [];

                    optionInputs.each(function () {
                        allChecked = allChecked && $(this).prop('checked');
                        values.push($(this).val());
                    });

                    if (!allChecked) {
                        this.select(values, false);
                    }
                    else {
                        this.deselect(values, false);
                    }

                    this.options.onChange(optionInputs, !allChecked);
                }, this));
            }

            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
                $("li.multiselect-group input", this.$ul).off();
                $("li.multiselect-group", this.$ul).siblings().not("li.multiselect-group, li.multiselect-all", this.$ul).each(function () {
                    $(this).toggleClass('hidden', true);
                });

                $("li.multiselect-group", this.$ul).on("click", $.proxy(function (group) {
                    group.stopPropagation();
                }, this));

                $("li.multiselect-group > a > b", this.$ul).on("click", $.proxy(function (t) {
                    t.stopPropagation();
                    var n = $(t.target).closest('li');
                    var r = n.nextUntil("li.multiselect-group");
                    var i = true;

                    r.each(function () {
                        i = i && $(this).hasClass('hidden');
                    });

                    r.toggleClass('hidden', !i);
                }, this));

                $("li.multiselect-group > a > input", this.$ul).on("change", $.proxy(function (t) {
                    t.stopPropagation();
                    var n = $(t.target).closest('li');
                    var r = n.nextUntil("li.multiselect-group", ':not(.disabled)');
                    var s = r.find("input");

                    var i = true;
                    s.each(function () {
                        i = i && $(this).prop("checked");
                    });

                    s.prop("checked", !i).trigger("change");
                }, this));

                // Set the initial selection state of the groups.
                $('li.multiselect-group', this.$ul).each(function () {
                    var r = $(this).nextUntil("li.multiselect-group", ':not(.disabled)');
                    var s = r.find("input");

                    var i = true;
                    s.each(function () {
                        i = i && $(this).prop("checked");
                    });

                    $(this).find('input').prop("checked", i);
                });

                // Update the group checkbox based on new selections among the
                // corresponding children.
                $("li input", this.$ul).on("change", $.proxy(function (t) {
                    t.stopPropagation();
                    var n = $(t.target).closest('li');
                    var r1 = n.prevUntil("li.multiselect-group", ':not(.disabled)');
                    var r2 = n.nextUntil("li.multiselect-group", ':not(.disabled)');
                    var s1 = r1.find("input");
                    var s2 = r2.find("input");

                    var i = $(t.target).prop('checked');
                    s1.each(function () {
                        i = i && $(this).prop("checked");
                    });

                    s2.each(function () {
                        i = i && $(this).prop("checked");
                    });

                    n.prevAll('.multiselect-group').find('input').prop('checked', i);
                }, this));

                $("li.multiselect-all", this.$ul).css('background', '#f3f3f3').css('border-bottom', '1px solid #eaeaea');
                $("li.multiselect-group > a, li.multiselect-all > a > label.checkbox", this.$ul).css('padding', '3px 20px 3px 35px');
                $("li.multiselect-group > a > input", this.$ul).css('margin', '4px 0px 5px -20px');
            }
        },

        /**
         * Create an option using the given select option.
         *
         * @param {jQuery} element
         */
        createOptionValue: function (element) {
            var $element = $(element);
            if ($element.is(':selected')) {
                $element.prop('selected', true);
            }

            // Support the label attribute on options.
            var label = this.options.optionLabel(element);
            var classes = this.options.optionClass(element);
            var value = $element.val();
            var inputType = this.options.multiple ? "checkbox" : "radio";

            var $li = $(this.options.templates.li);
            var $label = $('label', $li);
            $label.addClass(inputType);
            $li.addClass(classes);

            if (this.options.enableHTML) {
                $label.html(" " + label);
            }
            else {
                $label.text(" " + label);
            }

            var $checkbox = $('<input/>').attr('type', inputType);

            if (this.options.checkboxName) {
                $checkbox.attr('name', this.options.checkboxName);
            }
            $label.prepend($checkbox);

            var selected = $element.prop('selected') || false;
            $checkbox.val(value);

            if (value === this.options.selectAllValue) {
                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');
            }

            $label.attr('title', $element.attr('title'));

            this.$ul.append($li);

            if ($element.is(':disabled')) {
                $checkbox.attr('disabled', 'disabled')
                    .prop('disabled', true)
                    .closest('a')
                    .attr("tabindex", "-1")
                    .closest('li')
                    .addClass('disabled');
            }

            $checkbox.prop('checked', selected);

            if (selected && this.options.selectedClass) {
                $checkbox.closest('li')
                    .addClass(this.options.selectedClass);
            }
        },

        /**
         * Creates a divider using the given select option.
         *
         * @param {jQuery} element
         */
        createDivider: function (element) {
            var $divider = $(this.options.templates.divider);
            this.$ul.append($divider);
        },

        /**
         * Creates an optgroup.
         *
         * @param {jQuery} group
         */
        createOptgroup: function (group) {
            if (this.options.enableCollapsibleOptGroups && this.options.multiple) {
                var label = $(group).attr("label");
                var value = $(group).attr("value");
                var r = $('<li class="multiselect-item multiselect-group"><a href="javascript:void(0);"><input type="checkbox" value="' + value + '"/><b> ' + label + '<b class="caret"></b></b></a></li>');

                if (this.options.enableClickableOptGroups) {
                    r.addClass("multiselect-group-clickable")
                }
                this.$ul.append(r);
                if ($(group).is(":disabled")) {
                    r.addClass("disabled")
                }
                $("option", group).each($.proxy(function ($, group) {
                    this.createOptionValue(group)
                }, this))
            }
            else {
                var groupName = $(group).prop('label');

                // Add a header for the group.
                var $li = $(this.options.templates.liGroup);

                if (this.options.enableHTML) {
                    $('label', $li).html(groupName);
                }
                else {
                    $('label', $li).text(groupName);
                }

                if (this.options.enableClickableOptGroups) {
                    $li.addClass('multiselect-group-clickable');
                }

                this.$ul.append($li);

                if ($(group).is(':disabled')) {
                    $li.addClass('disabled');
                }

                // Add the options of the group.
                $('option', group).each($.proxy(function (index, element) {
                    this.createOptionValue(element);
                }, this));
            }
        },

        /**
         * Build the select all.
         * 
         * Checks if a select all has already been created.
         */
        buildSelectAll: function () {
            if (typeof this.options.selectAllValue === 'number') {
                this.options.selectAllValue = this.options.selectAllValue.toString();
            }

            var alreadyHasSelectAll = this.hasSelectAll();

            if (!alreadyHasSelectAll && this.options.includeSelectAllOption && this.options.multiple
                    && $('option', this.$select).length > this.options.includeSelectAllIfMoreThan) {

                // Check whether to add a divider after the select all.
                if (this.options.includeSelectAllDivider) {
                    this.$ul.prepend($(this.options.templates.divider));
                }

                var $li = $(this.options.templates.li);
                $('label', $li).addClass("checkbox");

                if (this.options.enableHTML) {
                    $('label', $li).html(" " + this.options.selectAllText);
                }
                else {
                    $('label', $li).text(" " + this.options.selectAllText);
                }

                if (this.options.selectAllName) {
                    $('label', $li).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" />');
                }
                else {
                    $('label', $li).prepend('<input type="checkbox" />');
                }

                var $checkbox = $('input', $li);
                $checkbox.val(this.options.selectAllValue);

                $li.addClass("multiselect-item multiselect-all");
                $checkbox.parent().parent()
                    .addClass('multiselect-all');

                this.$ul.prepend($li);

                $checkbox.prop('checked', false);
            }
        },

        /**
         * Builds the filter.
         */
        buildFilter: function () {

            // Build filter if filtering OR case insensitive filtering is enabled and the number of options exceeds (or equals) enableFilterLength.
            if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) {
                var enableFilterLength = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering);

                if (this.$select.find('option').length >= enableFilterLength) {

                    this.$filter = $(this.options.templates.filter);
                    $('input', this.$filter).attr('placeholder', this.options.filterPlaceholder);

                    // Adds optional filter clear button
                    if (this.options.includeFilterClearBtn) {
                        var clearBtn = $(this.options.templates.filterClearBtn);
                        clearBtn.on('click', $.proxy(function (event) {
                            clearTimeout(this.searchTimeout);
                            this.$filter.find('.multiselect-search').val('');
                            $('li', this.$ul).show().removeClass("filter-hidden");
                            this.updateSelectAll();
                        }, this));
                        this.$filter.find('.input-group').append(clearBtn);
                    }

                    this.$ul.prepend(this.$filter);

                    this.$filter.val(this.query).on('click', function (event) {
                        event.stopPropagation();
                    }).on('input keydown', $.proxy(function (event) {
                        // Cancel enter key default behaviour
                        if (event.which === 13) {
                            event.preventDefault();
                        }

                        // This is useful to catch "keydown" events after the browser has updated the control.
                        clearTimeout(this.searchTimeout);

                        this.searchTimeout = this.asyncFunction($.proxy(function () {

                            if (this.query !== event.target.value) {
                                this.query = event.target.value;

                                var currentGroup, currentGroupVisible;
                                $.each($('li', this.$ul), $.proxy(function (index, element) {
                                    var value = $('input', element).length > 0 ? $('input', element).val() : "";
                                    var text = $('label', element).text();

                                    var filterCandidate = '';
                                    if ((this.options.filterBehavior === 'text')) {
                                        filterCandidate = text;
                                    }
                                    else if ((this.options.filterBehavior === 'value')) {
                                        filterCandidate = value;
                                    }
                                    else if (this.options.filterBehavior === 'both') {
                                        filterCandidate = text + '\n' + value;
                                    }

                                    if (value !== this.options.selectAllValue && text) {

                                        // By default lets assume that element is not
                                        // interesting for this search.
                                        var showElement = false;

                                        if (this.options.enableCaseInsensitiveFiltering) {
                                            filterCandidate = filterCandidate.toLowerCase();
                                            this.query = this.query.toLowerCase();
                                        }

                                        if (this.options.enableFullValueFiltering && this.options.filterBehavior !== 'both') {
                                            var valueToMatch = filterCandidate.trim().substring(0, this.query.length);
                                            if (this.query.indexOf(valueToMatch) > -1) {
                                                showElement = true;
                                            }
                                        }
                                        else if (filterCandidate.indexOf(this.query) > -1) {
                                            showElement = true;
                                        }

                                        // Toggle current element (group or group item) according to showElement boolean.
                                        $(element).toggle(showElement).toggleClass('filter-hidden', !showElement);

                                        // Differentiate groups and group items.
                                        if ($(element).hasClass('multiselect-group')) {
                                            // Remember group status.
                                            currentGroup = element;
                                            currentGroupVisible = showElement;
                                        }
                                        else {
                                            // Show group name when at least one of its items is visible.
                                            if (showElement) {
                                                $(currentGroup).show().removeClass('filter-hidden');
                                            }

                                            // Show all group items when group name satisfies filter.
                                            if (!showElement && currentGroupVisible) {
                                                $(element).show().removeClass('filter-hidden');
                                            }
                                        }
                                    }
                                }, this));
                            }

                            this.updateSelectAll();
                        }, this), 300, this);
                    }, this));
                }
            }
        },

        /**
         * Unbinds the whole plugin.
         */
        destroy: function () {
            this.$container.remove();
            this.$select.show();
            this.$select.data('multiselect', null);
        },

        /**
         * Refreshs the multiselect based on the selected options of the select.
         */
        refresh: function () {
            var inputs = $.map($('li input', this.$ul), $);

            $('option', this.$select).each($.proxy(function (index, element) {
                var $elem = $(element);
                var value = $elem.val();
                var $input;
                for (var i = inputs.length; 0 < i--; /**/) {
                    if (value !== ($input = inputs[i]).val())
                        continue; // wrong li

                    if ($elem.is(':selected')) {
                        $input.prop('checked', true);

                        if (this.options.selectedClass) {
                            $input.closest('li')
                                .addClass(this.options.selectedClass);
                        }
                    }
                    else {
                        $input.prop('checked', false);

                        if (this.options.selectedClass) {
                            $input.closest('li')
                                .removeClass(this.options.selectedClass);
                        }
                    }

                    if ($elem.is(":disabled")) {
                        $input.attr('disabled', 'disabled')
                            .prop('disabled', true)
                            .closest('li')
                            .addClass('disabled');
                    }
                    else {
                        $input.prop('disabled', false)
                            .closest('li')
                            .removeClass('disabled');
                    }
                    break; // assumes unique values
                }
            }, this));

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Select all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered if
         * and only if one value is passed.
         * 
         * @param {Array} selectValues
         * @param {Boolean} triggerOnChange
         */
        select: function (selectValues, triggerOnChange) {
            if (!$.isArray(selectValues)) {
                selectValues = [selectValues];
            }

            for (var i = 0; i < selectValues.length; i++) {
                var value = selectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if ($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (!this.options.multiple) {
                    this.deselectAll(false);
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .addClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', true);
                $option.prop('selected', true);

                if (triggerOnChange) {
                    this.options.onChange($option, true);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Clears all selected items.
         */
        clearSelection: function () {
            this.deselectAll(false);
            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Deselects all options of the given values.
         * 
         * If triggerOnChange is set to true, the on change event is triggered, if
         * and only if one value is passed.
         * 
         * @param {Array} deselectValues
         * @param {Boolean} triggerOnChange
         */
        deselect: function (deselectValues, triggerOnChange) {
            if (!$.isArray(deselectValues)) {
                deselectValues = [deselectValues];
            }

            for (var i = 0; i < deselectValues.length; i++) {
                var value = deselectValues[i];

                if (value === null || value === undefined) {
                    continue;
                }

                var $option = this.getOptionByValue(value);
                var $checkbox = this.getInputByValue(value);

                if ($option === undefined || $checkbox === undefined) {
                    continue;
                }

                if (this.options.selectedClass) {
                    $checkbox.closest('li')
                        .removeClass(this.options.selectedClass);
                }

                $checkbox.prop('checked', false);
                $option.prop('selected', false);

                if (triggerOnChange) {
                    this.options.onChange($option, false);
                }
            }

            this.updateButtonText();
            this.updateSelectAll();
        },

        /**
         * Selects all enabled & visible options.
         *
         * If justVisible is true or not specified, only visible options are selected.
         *
         * @param {Boolean} justVisible
         * @param {Boolean} triggerOnSelectAll
         */
        selectAll: function (justVisible, triggerOnSelectAll) {
            justVisible = (this.options.enableCollapsibleOptGroups && this.options.multiple) ? false : justVisible;

            var justVisible = typeof justVisible === 'undefined' ? true : justVisible;
            var allCheckboxes = $("li input[type='checkbox']:enabled", this.$ul);
            var visibleCheckboxes = allCheckboxes.filter(":visible");
            var allCheckboxesCount = allCheckboxes.length;
            var visibleCheckboxesCount = visibleCheckboxes.length;

            if (justVisible) {
                visibleCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").addClass(this.options.selectedClass);
            }
            else {
                allCheckboxes.prop('checked', true);
                $("li:not(.divider):not(.disabled)", this.$ul).addClass(this.options.selectedClass);
            }

            if (allCheckboxesCount === visibleCheckboxesCount || justVisible === false) {
                $("option:not([data-role='divider']):enabled", this.$select).prop('selected', true);
            }
            else {
                var values = visibleCheckboxes.map(function () {
                    return $(this).val();
                }).get();

                $("option:enabled", this.$select).filter(function (index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', true);
            }

            if (triggerOnSelectAll) {
                this.options.onSelectAll();
            }
        },

        /**
         * Deselects all options.
         * 
         * If justVisible is true or not specified, only visible options are deselected.
         * 
         * @param {Boolean} justVisible
         */
        deselectAll: function (justVisible) {
            justVisible = (this.options.enableCollapsibleOptGroups && this.options.multiple) ? false : justVisible;
            justVisible = typeof justVisible === 'undefined' ? true : justVisible;

            if (justVisible) {
                var visibleCheckboxes = $("li input[type='checkbox']:not(:disabled)", this.$ul).filter(":visible");
                visibleCheckboxes.prop('checked', false);

                var values = visibleCheckboxes.map(function () {
                    return $(this).val();
                }).get();

                $("option:enabled", this.$select).filter(function (index) {
                    return $.inArray($(this).val(), values) !== -1;
                }).prop('selected', false);

                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).filter(":visible").removeClass(this.options.selectedClass);
                }
            }
            else {
                $("li input[type='checkbox']:enabled", this.$ul).prop('checked', false);
                $("option:enabled", this.$select).prop('selected', false);

                if (this.options.selectedClass) {
                    $("li:not(.divider):not(.disabled)", this.$ul).removeClass(this.options.selectedClass);
                }
            }
        },

        /**
         * Rebuild the plugin.
         * 
         * Rebuilds the dropdown, the filter and the select all option.
         */
        rebuild: function () {
            this.$ul.html('');

            // Important to distinguish between radios and checkboxes.
            this.options.multiple = this.$select.attr('multiple') === "multiple";

            this.buildSelectAll();
            this.buildDropdownOptions();
            this.buildFilter();

            this.updateButtonText();
            this.updateSelectAll(true);

            if (this.options.disableIfEmpty && $('option', this.$select).length <= 0) {
                this.disable();
            }
            else {
                this.enable();
            }

            if (this.options.dropRight) {
                this.$ul.addClass('pull-right');
            }
        },

        /**
         * The provided data will be used to build the dropdown.
         */
        dataprovider: function (dataprovider) {

            var groupCounter = 0;
            var $select = this.$select.empty();

            $.each(dataprovider, function (index, option) {
                var $tag;

                if ($.isArray(option.children)) { // create optiongroup tag
                    groupCounter++;

                    $tag = $('<optgroup/>').attr({
                        label: option.label || 'Group ' + groupCounter,
                        disabled: !!option.disabled
                    });

                    forEach(option.children, function (subOption) { // add children option tags
                        $tag.append($('<option/>').attr({
                            value: subOption.value,
                            label: subOption.label || subOption.value,
                            title: subOption.title,
                            selected: !!subOption.selected,
                            disabled: !!subOption.disabled
                        }));
                    });
                }
                else {
                    $tag = $('<option/>').attr({
                        value: option.value,
                        label: option.label || option.value,
                        title: option.title,
                        class: option.class,
                        selected: !!option.selected,
                        disabled: !!option.disabled
                    });
                    $tag.text(option.label || option.value);
                }

                $select.append($tag);
            });

            this.rebuild();
        },

        /**
         * Enable the multiselect.
         */
        enable: function () {
            this.$select.prop('disabled', false);
            this.$button.prop('disabled', false)
                .removeClass('disabled');
        },

        /**
         * Disable the multiselect.
         */
        disable: function () {
            this.$select.prop('disabled', true);
            this.$button.prop('disabled', true)
                .addClass('disabled');
        },

        /**
         * Set the options.
         *
         * @param {Array} options
         */
        setOptions: function (options) {
            this.options = this.mergeOptions(options);
        },

        /**
         * Merges the given options with the default options.
         *
         * @param {Array} options
         * @returns {Array}
         */
        mergeOptions: function (options) {
            return $.extend(true, {}, this.defaults, this.options, options);
        },

        /**
         * Checks whether a select all checkbox is present.
         *
         * @returns {Boolean}
         */
        hasSelectAll: function () {
            return $('li.multiselect-all', this.$ul).length > 0;
        },

        /**
         * Updates the select all checkbox based on the currently displayed and selected checkboxes.
         */
        updateSelectAll: function (notTriggerOnSelectAll) {
            if (this.hasSelectAll()) {
                var allBoxes = $("li:not(.multiselect-item):not(.filter-hidden) input:enabled", this.$ul);
                var allBoxesLength = allBoxes.length;
                var checkedBoxesLength = allBoxes.filter(":checked").length;
                var selectAllLi = $("li.multiselect-all", this.$ul);
                var selectAllInput = selectAllLi.find("input");

                if (checkedBoxesLength > 0 && checkedBoxesLength === allBoxesLength) {
                    selectAllInput.prop("checked", true);
                    selectAllLi.addClass(this.options.selectedClass);
                    this.options.onSelectAll(true);
                }
                else {
                    selectAllInput.prop("checked", false);
                    selectAllLi.removeClass(this.options.selectedClass);
                    if (checkedBoxesLength === 0) {
                        if (!notTriggerOnSelectAll) {
                            this.options.onSelectAll(false);
                        }
                    }
                }
            }
        },

        /**
         * Update the button text and its title based on the currently selected options.
         */
        updateButtonText: function () {
            var options = this.getSelected();

            // First update the displayed button text.
            if (this.options.enableHTML) {
                $('.multiselect .multiselect-selected-text', this.$container).html(this.options.buttonText(options, this.$select));
            }
            else {
                $('.multiselect .multiselect-selected-text', this.$container).text(this.options.buttonText(options, this.$select));
            }

            // Now update the title attribute of the button.
            $('.multiselect', this.$container).attr('title', this.options.buttonTitle(options, this.$select));
        },

        /**
         * Get all selected options.
         *
         * @returns {jQUery}
         */
        getSelected: function () {
            return $('option', this.$select).filter(":selected");
        },

        /**
         * Gets a select option by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getOptionByValue: function (value) {

            var options = $('option', this.$select);
            var valueToCompare = value.toString();

            for (var i = 0; i < options.length; i = i + 1) {
                var option = options[i];
                if (option.value === valueToCompare) {
                    return $(option);
                }
            }
        },

        /**
         * Get the input (radio/checkbox) by its value.
         *
         * @param {String} value
         * @returns {jQuery}
         */
        getInputByValue: function (value) {

            var checkboxes = $('li input', this.$ul);
            var valueToCompare = value.toString();

            for (var i = 0; i < checkboxes.length; i = i + 1) {
                var checkbox = checkboxes[i];
                if (checkbox.value === valueToCompare) {
                    return $(checkbox);
                }
            }
        },

        /**
         * Used for knockout integration.
         */
        updateOriginalOptions: function () {
            this.originalOptions = this.$select.clone()[0].options;
        },

        asyncFunction: function (callback, timeout, self) {
            var args = Array.prototype.slice.call(arguments, 3);
            return setTimeout(function () {
                callback.apply(self || window, args);
            }, timeout);
        },

        setAllSelectedText: function (allSelectedText) {
            this.options.allSelectedText = allSelectedText;
            this.updateButtonText();
        }
    };

    $.fn.multiselect = function (option, parameter, extraOptions) {
        return this.each(function () {
            var data = $(this).data('multiselect');
            var options = typeof option === 'object' && option;

            // Initialize the multiselect.
            if (!data) {
                data = new Multiselect(this, options);
                $(this).data('multiselect', data);
            }

            // Call multiselect method.
            if (typeof option === 'string') {
                data[option](parameter, extraOptions);

                if (option === 'destroy') {
                    $(this).data('multiselect', false);
                }
            }
        });
    };

    $.fn.multiselect.Constructor = Multiselect;

    $(function () {
        $("select[data-role=multiselect]").multiselect();
    });

}(window.jQuery);

///#source 1 1 /Scripts/Extends-form.js
$(function () {
    $("span.field-validation-valid, span.field-validation-error").each(function () {
        $(this).addClass("help-inline");
    });

    $("form").submit(function () {
        if ($(this).valid()) {
            $(this).find("div.control-group").each(function () {
                if ($(this).find("span.field-validation-error").length == 0) {
                    $(this).removeClass("error");
                }
            });
        }
        else {
            $(this).find("div.control-group").each(function () {
                if ($(this).find("span.field-validation-error").length > 0) {
                    $(this).addClass("error");
                }
            });
        }
    });


    $("form").each(function () {
        debugger;
        $(this).find("div.control-group").each(function () {
            if ($(this).find("span.field-validation-error").length > 0) {
                $(this).addClass("error");
            }
        });
    });

});


$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest(".form-group").addClass("has-error");
    },
    unhighlight: function (element) {
        $(element).closest(".form-group").removeClass("has-error");
    },
    errorElement: "span",
    errorClass: "help-block",
    errorPlacement: function (error, element) {
        if (element.parent(".input-group").length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});

$("input[type=date]").addClass("r-date").bootstrapMaterialDatePicker({
    date: true,
    time: false,
    switchOnClick:true
});

$("input[type=datetime]").addClass("r-datetime").bootstrapMaterialDatePicker({
    date: true,
    time: true
});

$("input[type=time]").addClass("r-time").bootstrapMaterialDatePicker({
    date: false,
    time: true
});
