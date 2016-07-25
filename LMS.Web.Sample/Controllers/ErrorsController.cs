using System.Web.Mvc;

namespace LMS.Web.Sample.Controllers
{
    public class ErrorsController : Controller
    {
        // GET: Errors
        public ActionResult Http404()
        {
            return View();
        }
    }
}