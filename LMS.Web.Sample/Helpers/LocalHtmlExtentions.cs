using System;
using System.Web.Mvc;

namespace LMS.Web.Sample.Helpers
{
    public static class LocalHtmlExtensions
    {
        public static String RootUrl(this UrlHelper instance)
        {
            var url = instance.RequestContext.HttpContext.Request.Url;
            return url != null ? String.Format("{0}://{1}{2}", url.Scheme, url.Authority, instance.Content("~"))
                : string.Empty;
        }

        public static bool IsDebug(this HtmlHelper htmlHelper)
        {
#if DEBUG
            return true;
#else
            return false;
#endif
        }
    }
}
