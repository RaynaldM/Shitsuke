using System.Web.Mvc;

namespace LMS.web.Controllers
{
    public class ErrorsController : Controller
    {
         public ActionResult Http404()
        {
            return View();
        }
    }
}