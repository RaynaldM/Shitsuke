using System.Web.Mvc;
using LMS.web.Helpers;

namespace LMS.web.Controllers
{
    public class LogsController : BaseController
    {
        // GET: LogsStats
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Detail(string id, string type)
        {
            ViewBag.id = id;
            ViewBag.type = type;
            return View();
        }
    }
}