using System.Web.Mvc;
using LMS.web.Helpers;

namespace LMS.web.Controllers
{
    public class ApplicationsController : BaseController
    {
        // GET: Applications
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public  ActionResult SetCurrent(string id)
        {
            if (id == "allapps") id = "*";
            return  this.SetUserParams("app", id);
        }
    }
}