using System.Web.Mvc;
using LMS.Services;
using LMS.web.Helpers;

namespace LMS.web.Controllers
{
    public class FeedbackController : BaseServiceController<FeedbackService>
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Detail(long id)
        {
            ViewBag.id = id;
            return View();
        }
    }
}