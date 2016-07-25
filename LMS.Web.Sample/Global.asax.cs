using System;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Elmah;
using LMS.Web.Sample.Helpers;
#pragma warning disable 1591

namespace LMS.Web.Sample
{
    public class MvcApplication : BaseMvcApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            // Init Web API > attention, l'ordre est important
            //  GlobalConfiguration.Configure(WebApiConfig.Register);
            // Configuration des échanges ajax via json
            //  GlobalConfiguration.Configure(JsonConfig.Register);

            // Init MVC
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            this.ConfigureAntiForgeryTokens();

            // enleve la version du mvc dans le header des HttpResponse
            MvcHandler.DisableMvcResponseHeader = true;
            //Logger.Info("Application Started");
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            var exc = Server.GetLastError(); //obtenir l’exception d’origine
            if (exc is HttpException || exc.GetBaseException() is HttpException)
            {
                var httpException = exc as HttpException ?? exc.GetBaseException() as HttpException;
                ErrorSignal.FromCurrentContext().Raise(exc);
                //Logger.Error(httpException, "http Error");
            }
            else
            {
                ErrorSignal.FromCurrentContext().Raise(exc);
                //Logger.Error(exc, "Global Error");
            }
            Server.ClearError();
        }
    }
}
