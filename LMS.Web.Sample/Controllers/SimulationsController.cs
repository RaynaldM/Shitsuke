using System;
using System.Web;
using System.Web.Mvc;
using Elmah;
using LMS.Web.Sample.Helpers;
using ApplicationException = System.ApplicationException;

namespace LMS.Web.Sample.Controllers
{
    public class SimulationsController : BaseController
    {
        // GET: Simulations
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Send()
        {
            try
            {
                //var df=ErrorLog.GetDefault(System.Web.HttpContext.Current);
                //df.ApplicationName = "LMS-001";
                ErrorSignal.FromCurrentContext().Raise(this.GetRandom());
            }
            catch (Exception ex)
            {
                ErrorSignal.FromCurrentContext().Raise(ex);
            }
            return Json(true,JsonRequestBehavior.AllowGet);
        }

        private Exception GetRandom()
        {
            Exception result = new ApplicationException();
            Random rnd = new Random();
            int type = rnd.Next(0, 4);

            switch (type)
            {
                case 0:
                    result = new DivideByZeroException();
                    break;
                case 1:
                    result = new NullReferenceException();
                    break;
                case 2:
                    result = new InvalidOperationException();
                    break;
                case 3:
                    result = new HttpException(401,"unauthorize");
                    break;
            }
            return result;
        }
    }
}