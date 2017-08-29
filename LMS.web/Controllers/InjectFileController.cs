using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LMS.Core.Models;
using LMS.Services;
using LMS.web.Helpers;
using Newtonsoft.Json;

namespace LMS.web.Controllers
{
    public class InjectFileController : BaseServiceController<LogService>
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(HttpPostedFileBase file)
        {
            if (file.ContentLength > 0)
            {
                using (var reader = new BinaryReader(file.InputStream))
                {
                    var buffer = reader.ReadBytes(file.ContentLength);
                    string s = System.Text.Encoding.UTF8.GetString(buffer, 0, buffer.Length);
                    var Logs = s.Split('}');
                    foreach (var log in Logs)
                    {
                        if (log.Length > 0)
                        {
                            var newLog = JsonConvert.DeserializeObject<BaseError>(log + "}");
                            if (newLog != null)
                            {
                                this.Service.Logs(newLog);
                            }
                        }
                    }
                }

            }

            return RedirectToAction("Index");
        }
    }
}