using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Mvc;

namespace LMS.web.Helpers.Api
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AllowCrossSiteAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
            base.OnActionExecuting(filterContext);
        }
    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class CheckNullUserAttribute : System.Web.Http.Filters.ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var ctrl = (BaseApiController)actionContext.ControllerContext.Controller;
            if (ctrl.UserId == null)
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Forbidden);
                ctrl.Logger.Warn("Null user in web api :"+ actionContext.ActionDescriptor.ActionName);
            }

            base.OnActionExecuting(actionContext);
        }

    }
}