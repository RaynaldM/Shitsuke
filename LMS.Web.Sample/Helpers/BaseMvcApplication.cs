using System.Web;
using System.Web.Helpers;

#pragma warning disable 1591

namespace LMS.Web.Sample.Helpers
{
    public class BaseMvcApplication : HttpApplication
    {
        //private static readonly string _logJsToken = ConfigurationManager.AppSettings["Logentries.Token"];

     
        ///// <summary>
        ///// Donne le token d'autorisation pour le NLog
        ///// </summary>
        //public string LogJsToken { get { return _logJsToken; } }

        protected void ConfigureAntiForgeryTokens()
        {
            // Rename the Anti-Forgery cookie from "__RequestVerificationToken" to "f". 
            // This adds a little security through obscurity and also saves sending a 
            // few characters over the wire.
            AntiForgeryConfig.CookieName = "l";

            // If you have enabled SSL. Uncomment this line to ensure that the Anti-Forgery 
            // cookie requires SSL to be sent accross the wire. 
            // AntiForgeryConfig.RequireSsl = true;
        }
    }
}