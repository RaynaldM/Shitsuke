using System.Web.Mvc;
using LMS.web.Helpers;

namespace LMS.web.Controllers
{
    [Authorize(Roles = "Guest,Admin")]
    public class GuestController : BaseController
    {
        // GET: Guest
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