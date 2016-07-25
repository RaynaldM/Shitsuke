/// <reference path="../../scripts/typings/base.d.ts" />
class EmbedLms {
	static Ping(appCode: string, bearerToken: string,
		userId?: string, page: string = location.pathname,
		useFeedBack: boolean = true,
		lang: string = navigator.language || navigator.systemLanguage || navigator.userLanguage || "en"): void {
		// first if there is no JQuery, inject it
		if (window.jQuery) {
			this.go(appCode, bearerToken, userId, page, useFeedBack, lang);
		} else
			this.injectJS("https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js",
				false,
				() => {
					this.go(appCode, bearerToken, userId, page, useFeedBack, lang);
				});
	}

	private static go(appCode: string, bearerToken: string,
		userId: string, page: string,
		useFeedBack: boolean, lang: string): void {
		if (userId === void 0 || userId === null || userId === "")
			userId = "anonymous";
		// ping this
		$.ajax({
			type: "POST",
			url: window.lms + "/api/monitor/ping",
			data: JSON.stringify({
				aid: appCode,
				uid: userId,
				pid: page,
				info: JSON.stringify(getBrowserInfo())
			}),
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			headers: { "Authorization": "lmstoken " + bearerToken },
			crossDomain: true
		});
		// get the html for feedback if it's neccessary
		if (useFeedBack) {
			var alreadyLoaded = false;
			// load the Html feedback root > the button
			lmsloadHtml("/html/feedbackroot.min.html", "body")
				.then(() => {
					// set click event
					$("#lmsFeedBack-btn").on("click",
						() => {
							if (alreadyLoaded) {
								// if all files is already loaded
								feedback.Ready(bearerToken, appCode, userId, page, lang);
							} else {
								// When cliked
								// load JS files
								$.getScript(window.lms + "/scripts/feedback.min.js",
									() => {
										feedback.Ready(bearerToken, appCode, userId, page, lang);
										alreadyLoaded = true;
									});
							}
						});

				});
		}
	}

	private static injectJS(url: string, fromRoot: boolean = true, callback?: any): void {
		// Inject JS process
		var dom = document;
		const scriptTag = "script";
		// Set script element 
		var embedscript = dom.createElement(scriptTag) as HTMLScriptElement;
		embedscript.type = "text/javascript";
		embedscript.src = (fromRoot ? window.lms : "") + url;
		embedscript.async = true;
		// Add a listener on load (to launch function after)
		embedscript.addEventListener("load", callback, false);
		var anchor = dom.getElementsByTagName(scriptTag)[0];
		anchor.parentNode.insertBefore(embedscript, anchor);
		callback && callback();
	}
}

function lmsloadHtml(url: string, element: string,
	callback: any = null): JQueryGenericPromise<any> {
	return $.ajax({
		type: "GET",
		url: window.lms + url,
		crossDomain: true
	}).then((html: string) => {
		html = html.replace("{root}", window.lms);
		if (callback)
			html = callback(html);
		$(element).append(html);
	});
}

function getBrowserInfo(): any {
	var unknown = "-";

	// screen
	var screenSize = "";
	if (screen.width) {
		var width = (screen.width) ? screen.width : "";
		var height = (screen.height) ? screen.height : "";
		screenSize += "" + width + " x " + height;
	}

	// browser
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browser = navigator.appName;
	var version = "" + parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset: number, ix: number;

	// Opera
	if ((verOffset = nAgt.indexOf("Opera")) != -1) {
		browser = "Opera";
		version = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf("Version")) != -1) {
			version = nAgt.substring(verOffset + 8);
		}
	}
	// Opera Next
	if ((verOffset = nAgt.indexOf("OPR")) != -1) {
		browser = "Opera";
		version = nAgt.substring(verOffset + 4);
	}
	// MSIE
	else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
		browser = "Microsoft Internet Explorer";
		version = nAgt.substring(verOffset + 5);
	}
	// Chrome
	else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
		browser = "Chrome";
		version = nAgt.substring(verOffset + 7);
	}
	// Safari
	else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
		browser = "Safari";
		version = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf("Version")) != -1) {
			version = nAgt.substring(verOffset + 8);
		}
	}
	// Firefox
	else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
		browser = "Firefox";
		version = nAgt.substring(verOffset + 8);
	}
	// MSIE 11+
	else if (nAgt.indexOf("Trident/") != -1) {
		browser = "Microsoft Internet Explorer";
		version = nAgt.substring(nAgt.indexOf("rv:") + 3);
	}
	// Other browsers
	else if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/"))) {
		browser = nAgt.substring(nameOffset, verOffset);
		version = nAgt.substring(verOffset + 1);
		if (browser.toLowerCase() == browser.toUpperCase()) {
			browser = navigator.appName;
		}
	}
	// trim the version string
	if ((ix = version.indexOf(";")) != -1) version = version.substring(0, ix);
	if ((ix = version.indexOf(" ")) != -1) version = version.substring(0, ix);
	if ((ix = version.indexOf(")")) != -1) version = version.substring(0, ix);

	majorVersion = parseInt("" + version, 10);
	if (isNaN(majorVersion)) {
		version = "" + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}

	// mobile version
	var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

	// cookie
	//var cookieEnabled = (navigator.cookieEnabled);

	//if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
	//	document.cookie = "testcookie";
	//	cookieEnabled = (document.cookie.indexOf("testcookie") != -1);
	//}

	// system
	var os = unknown;
	var clientStrings = [
		{ s: "Windows 10", r: /(Windows 10.0|Windows NT 10.0)/ },
		{ s: "Windows 8.1", r: /(Windows 8.1|Windows NT 6.3)/ },
		{ s: "Windows 8", r: /(Windows 8|Windows NT 6.2)/ },
		{ s: "Windows 7", r: /(Windows 7|Windows NT 6.1)/ },
		{ s: "Windows Vista", r: /Windows NT 6.0/ },
		{ s: "Windows Server 2003", r: /Windows NT 5.2/ },
		{ s: "Windows XP", r: /(Windows NT 5.1|Windows XP)/ },
		{ s: "Windows 2000", r: /(Windows NT 5.0|Windows 2000)/ },
		{ s: "Windows ME", r: /(Win 9x 4.90|Windows ME)/ },
		{ s: "Windows 98", r: /(Windows 98|Win98)/ },
		{ s: "Windows 95", r: /(Windows 95|Win95|Windows_95)/ },
		{ s: "Windows NT 4.0", r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
		{ s: "Windows CE", r: /Windows CE/ },
		{ s: "Windows 3.11", r: /Win16/ },
		{ s: "Android", r: /Android/ },
		{ s: "Open BSD", r: /OpenBSD/ },
		{ s: "Sun OS", r: /SunOS/ },
		{ s: "Linux", r: /(Linux|X11)/ },
		{ s: "iOS", r: /(iPhone|iPad|iPod)/ },
		{ s: "Mac OS X", r: /Mac OS X/ },
		{ s: "Mac OS", r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
		{ s: "QNX", r: /QNX/ },
		{ s: "UNIX", r: /UNIX/ },
		{ s: "BeOS", r: /BeOS/ },
		{ s: "OS/2", r: /OS\/2/ },
		{ s: "Search Bot", r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
	];
	for (var id in clientStrings) {
		var cs = clientStrings[id];
		if (cs.r.test(nAgt)) {
			os = cs.s;
			break;
		}
	}

	var osVersion = unknown;

	if (/Windows/.test(os)) {
		osVersion = /Windows (.*)/.exec(os)[1];
		os = "Windows";
	}

	switch (os) {
		case "Mac OS X":
			osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
			break;

		case "Android":
			osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
			break;

		case "iOS":
			var aosVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
			osVersion = aosVersion[1] + "." + aosVersion[2] + "." + (parseInt(aosVersion[3]) | 0);
			break;
	}

	return {
		screen: screenSize,
		browser: browser,
		browserVersion: version,
		browserMajorVersion: majorVersion,
		mobile: mobile,
		os: os,
		osVersion: osVersion
		//cookies: cookieEnabled
	};
}

//alert(
//    'OS: ' + jscd.os + ' ' + jscd.osVersion + '\n' +
//    'Browser: ' + jscd.browser + ' ' + jscd.browserMajorVersion +
//	' (' + jscd.browserVersion + ')\n' +
//    'Mobile: ' + jscd.mobile + '\n' +
//    'Flash: ' + jscd.flashVersion + '\n' +
//    'Cookies: ' + jscd.cookies + '\n' +
//    'Screen Size: ' + jscd.screen + '\n\n' +
//    'Full User Agent: ' + navigator.userAgent
//);



//http://stackoverflow.com/questions/667555/detecting-idle-time-in-javascript-elegantly
	//private static initReady() {
	//	$(document).ready(() => {
	//		//Increment the idle time counter every minute.
	//		var idleInterval = setInterval(this.timerIncrement, 60000); // 1 minute

	//		//Zero the idle timer on mouse movement.
	//		$(this).mousemove(e => {
	//			this.idleTime = 0;
	//		});
	//		$(this).keypress(e => {
	//			this.idleTime = 0;
	//		});
	//	});
	//}

	//private static timerIncrement() {
	//	this.idleTime++;
	//	if (this.idleTime > 19) { // 20 minutes
	//		window.location.reload();
	//	}
