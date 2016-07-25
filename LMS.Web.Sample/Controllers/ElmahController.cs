using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Elmah;
using LMS.Web.Sample.Helpers;
using ApplicationException = System.ApplicationException;

namespace LMS.Web.Sample.Controllers
{
    public class ElmahController : BaseController
    {
        // GET: Elmah
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CreateLog()
        {
        
            try
            {
                var ex = new ApplicationException("Test exception");
                ErrorSignal.FromCurrentContext().Raise(ex);
                return View("Index");
        
            }
            catch (Exception ex)
            {
                ErrorSignal.FromCurrentContext().Raise(ex);
                return View("Index");
            }
        }

        //public ActionResult LaunchScheduler()
        //{
        //    ViewBag.schedulerLaunched = true;
        //    return View("Index");
        //}

        //public ActionResult StopScheduler()
        //{
        //    ViewBag.schedulerLaunched = false;
        //    return View("Index");
        //}
    }
}