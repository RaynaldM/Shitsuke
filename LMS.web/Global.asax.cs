using System.Collections.Generic;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using aspnet_mvc_helpers;
using LMS.web.Helpers;

namespace LMS.web
{
    public class MvcApplication : BaseMvcApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
           
            GlobalConfiguration.Configure(WebApiConfig.Register);

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
            SchedulerConfig.Register();

            this.ConfigureAntiForgeryTokens();

            // Set the implemented langage into helper
            CultureHelper.SetImplementedCulture(new List<string>
            {
                "en-US", // first culture is the DEFAULT
                "fr-FR", // french culture
            });

            // enleve la version du mvc dans le header des HttpResponse
            MvcHandler.DisableMvcResponseHeader = true;
            Logger.Info("Application Started");
        }
    }
}
