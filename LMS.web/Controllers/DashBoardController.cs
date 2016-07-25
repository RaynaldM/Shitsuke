using System.Web.Mvc;
using LMS.web.Helpers;

namespace LMS.web.Controllers
{
    public class DashBoardController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}