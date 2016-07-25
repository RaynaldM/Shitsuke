using System.Web.Mvc;
using StackExchange.Exceptional;

namespace LMS.web.Controllers
{
    public class ExceptionsController : Controller
    {
        // GET: Exceptions
        public ActionResult Exceptions()
        {
            var context = System.Web.HttpContext.Current;
            var factory = new HandlerFactory();
            var page = factory.GetHandler(context, Request.RequestType, Request.Url.ToString(), Request.PathInfo);
            page.ProcessRequest(context);
            return null;
        }
    }
}