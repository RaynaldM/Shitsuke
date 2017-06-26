using System.Web.Optimization;
using aspnet_mvc_helpers;

namespace LMS.web
{
    public class BundleConfig
    {
        // Pour plus d'informations sur le regroupement, visitez http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.UseCdn = true;   //enable CDN support
#if DEBUG
            BundleTable.EnableOptimizations = false; // a mettre pour le vrai comportement CDN
#else
            BundleTable.EnableOptimizations = true; // a mettre pour le vrai comportement CDN
#endif
            //RegisterCss(bundles);
            RegisterJavacript(bundles);
        }

        private static void RegisterJavacript(BundleCollection bundles)
        {
            //add link to jquery on the CDN
            const string bootstrapCdnPath = "http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js";

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bts", bootstrapCdnPath)
            {
                CdnFallbackExpression = "window.jQuery.fn.modal"
            }
                .Include("~/Scripts/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval")
                .Include("~/Scripts/jquery.unobtrusive*",
                    "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/app")
                .Include("~/Scripts/moment-with-locales.js",
                    "~/Scripts/toastr.js",
                    "~/Scripts/handlebars.js",
                    "~/Scripts/jquery.mousewheel.js",
                    "~/Scripts/Extends.js")
                .Include("~/TypeScripts/CommonClass/*.js"));

            bundles.Add(new ScriptBundle("~/bundles/form")
             .Include("~/Scripts/jquery.validate*",
                 "~/Scripts/jquery.unobtrusive*",
                 "~/Scripts/bootstrap-material-datetimepicker.js",
                 "~/Scripts/bootstrap-maxlength.js",
                 "~/Scripts/select2.js",
                 "~/Scripts/Extends-form.js",
                 "~/TypeScripts/Extends/BasePageForm.js"));

            bundles.Add(new ScriptBundle("~/bundles/graph")
                .Include("~/Scripts/chartist.js",
                "~/Scripts/chartist-plugin-legend.js"));

            //bundles.Add(new ScriptBundle("~/bundles/analytics")
            //        .Include("~/Scripts/analytics-*")
            //        .Include("~/Scripts/uservoice.js"));

            bundles.Add(new ScriptBundle("~/bundles/resources")
            {
                Builder = new ResourcesBundleBuilder("LMS.Resources", "LMS.Resources.ResourcesJS", "Resources")
            });

            bundles.Add(new ScriptBundle("~/bundles/resources_fr")
            {
                Builder = new ResourcesBundleBuilder("LMS.Resources", "LMS.Resources.ResourcesJS", "Resources", "fr-fr")
            });


            bundles.Add(new ScriptBundle("~/bundles/embrsc_en")
            {
                Builder = new ResourcesBundleBuilder("LMS.Resources", "LMS.Resources.Embedded", "Resources")
            });

            bundles.Add(new ScriptBundle("~/bundles/embrsc_fr")
            {
                Builder = new ResourcesBundleBuilder("LMS.Resources", "LMS.Resources.Embedded", "Resources", "fr-fr")
            });
            //    // Utilisez la version de développement de Modernizr pour le développement et l'apprentissage. Puis, une fois
            //    // prêt pour la production, utilisez l'outil de génération (bluid) sur http://modernizr.com pour choisir uniquement les tests dont vous avez besoin.
            //    bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //                "~/Scripts/modernizr-*"));

        }
    }

}
