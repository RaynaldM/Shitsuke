using System.Web.Mvc;
using LMS.web.Helpers;

namespace LMS.web.Controllers
{
    [AllowAnonymous]
    public class HomeController : BaseController
    {
        // GET: Home
        public ActionResult Index()
        {
            if (this.User.Identity.IsAuthenticated)
            {
                if (this.User.IsInRole("Guest"))
                {
                    // redirect to GuestHomePage
                }
                return RedirectToAction("Index","DashBoard");
            }
            return View();
        }
        public ActionResult About()
        {
            ViewBag.Message = "Logs and Monitoring Services";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "";

            return View();
        }
    }
}