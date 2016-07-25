///#source 1 1 /TypeScripts/Assets/feedback.js
/// <reference path="../../scripts/typings/html2canvas/html2canvas.d.ts" />
var feedback = (function () {
    function feedback() {
    }
    feedback.Ready = function (btoken, appCode, userId, pageId, lang) {
        var _this = this;
        this.token = "lmstoken " + btoken;
        if (!this.loaded) {
            this.load(lang).then(function () {
                _this.init(btoken, appCode, userId, pageId);
                // set H2C ignore attribute for sceenshot
                _this.report.attr("data-html2canvas-ignore", 1);
                _this.report.find("*").attr("data-html2canvas-ignore", 1);
            });
        }
        else {
            this.init(btoken, appCode, userId, pageId);
        }
    };
    feedback.init = function (btoken, appCode, userId, pageId) {
        // reset form
        this.report.find("form")[0].reset();
        // Set the hidden value
        $("#appcode").val(appCode);
        $("#userid").val(userId);
        $("#token").val(btoken);
        $("#pageid").val(pageId);
        $("#browserinfo").val(JSON.stringify(getBrowserInfo()));
        this.setSave();
        this.setTakeScreenshot();
        this.setClose();
        this.bShow(this.report);
    };
    feedback.setSave = function () {
        var _this = this;
        var self = this.report.find("form");
        var load = this.report.find(".loading");
        self.unbind("submit")
            .on("submit", function (e) {
            e.preventDefault();
            _this.bHide(_this.report.find(".report"));
            _this.bShow(load);
            $.ajax({
                type: "POST",
                url: window.lms + "/api/feedback/post",
                data: self.serialize(),
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                crossDomain: true,
                headers: { "Authorization": _this.token }
            }).done(function () {
                _this.bHide(load);
                _this.bShow(_this.report.find(".reported"));
            })
                .fail(function () {
                _this.bHide(load);
                _this.bShow(_this.report.find(".failed"));
            });
            return false;
        });
    };
    feedback.setTakeScreenshot = function () {
        this.report.find(".screenshot")
            .unbind("click")
            .on("click", function (e) {
            var target = $(e.currentTarget);
            target.find("i").removeClass("fa-camera fa-check").addClass("fa-refresh fa-spin");
            html2canvas(document.body, {
                onrendered: function (canvas) {
                    $(".screen-uri").val(canvas.toDataURL("image/png"));
                    target.find("i").removeClass("fa-refresh fa-spin").addClass("fa-check");
                }
            });
        });
    };
    feedback.setClose = function () {
        var _this = this;
        this.report.find("#lms-close, .close,.bclose")
            .unbind("click")
            .on("click", function () {
            // Hide window
            _this.bHide(_this.report);
            // reset input
            _this.report.find("textarea").val("");
            _this.report.find(".screen-uri").val("");
            // reset layout : ready to work
            _this.bShow(_this.report.find("form"));
            _this.bHide(_this.report.find(".failed"));
            _this.bHide(_this.report.find(".reported"));
            _this.report.find("i.cam").removeClass("fa-refresh fa-spin").addClass("fa-camera");
        });
    };
    feedback.load = function (lang) {
        var _this = this;
        return this.getScripts([
            "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js",
            window.lms + "/bundles/embrsc_" + lang.substring(0, 2),
            "//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"
        ])
            .then(function () {
            // load the Html feedback windows
            return $.ajax({
                type: "GET",
                url: window.lms + "/html/feedback.min.html",
                crossDomain: true
            }).then(function (html) {
                html = html.replace("{root}", window.lms);
                var template = Handlebars.compile(html);
                html = template(Resources);
                $("#lmsFeedBack").append(html);
                _this.loaded = true;
                _this.report = $("#lms-report");
            });
        });
    };
    feedback.bShow = function (element) {
        element.removeClass("hidden").addClass("show").show();
    };
    feedback.bHide = function (element) {
        element.removeClass("show").addClass("hidden").hide();
    };
    feedback.getScripts = function (scriptsToLoad) {
        var // reference declaration & localization
        length = scriptsToLoad.length, counter = 0, handler = function () { counter++; }, deferreds = [];
        var idx = 0;
        for (; idx < length; idx++) {
            deferreds.push($.getScript(scriptsToLoad[idx], handler));
        }
        return $.when.apply(null, deferreds);
    };
    feedback.loaded = false;
    return feedback;
}());
;
//# sourceMappingURL=feedback.js.map
