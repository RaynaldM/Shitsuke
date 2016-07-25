using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace LMS.Web.Sample
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            // Ignore text, html, files.
            routes.IgnoreRoute("{file}.txt");
            routes.IgnoreRoute("robots.txt");
            routes.IgnoreRoute("{file}.htm");
            routes.IgnoreRoute("{file}.html");

            // ignore SiteMap
            routes.IgnoreRoute("sitemap");
            routes.IgnoreRoute("sitemap.gz");
            routes.IgnoreRoute("sitemap.xml");
            routes.IgnoreRoute("sitemap.xml.gz");
            routes.IgnoreRoute("google_sitemap.xml");
            routes.IgnoreRoute("google_sitemap.xml.gz");

            // Ignore axd files such as assest, image, sitemap etc
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            // Ignore the assets directory which contains images, js, css & html
            routes.IgnoreRoute("assets/{*pathInfo}");

            // Ignore the error directory which contains error pages
            routes.IgnoreRoute("ErrorPages/{*pathInfo}");

            //Exclude favicon (google toolbar request gif file as fav icon which is weird)
            routes.IgnoreRoute("{*favicon}", new { favicon = @"(.*/)?favicon.([iI][cC][oO]|[gG][iI][fF])(/.*)?" });
            routes.IgnoreRoute("favicon.ico");
            routes.MapMvcAttributeRoutes();

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
