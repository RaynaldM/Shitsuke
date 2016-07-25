/// <reference path="../../scripts/typings/base.d.ts" />

((url: string, callback: any) => {
	// si mon objet interne n'est pas définie
	if (typeof window.lms === 'undefined' || window.lms === void 0 && url) {
		// Save LMS server url in window for js usage 
		window.lms = url;
		// Inject JS process
		var dom = document;
		var scriptTag = "script";
		// Set script element 
		var embedscript = dom.createElement(scriptTag) as HTMLScriptElement;
		embedscript.type = "text/javascript";
		embedscript.src = url + "/scripts/embedlms.min.js";
		embedscript.async = true;
		// Add a listener on load (to launch function after)
		embedscript.addEventListener("load", callback, false);
		var anchor = dom.getElementsByTagName(scriptTag)[0];
		anchor.parentNode.insertBefore(embedscript, anchor);
	}
})("http://yourLmsServerUrl", (/*event: Event*/) => {
	// When embedded JS is loaded, fire ping method
	return EmbedLms.Ping(
		"YourAppCode",
		"yourBearer",
		"yourUserid",
		"yourpageid");
});
