using System;
using System.Configuration;
using System.Web;
using System.Web.Helpers;
using LMS.Core.Services;
using LMS.web.Unity;

namespace LMS.web.Helpers
{
    public class BaseMvcApplication : HttpApplication
    {
        //private static readonly string _logJsToken = ConfigurationManager.AppSettings["Logentries.Token"];
        /// <summary>
        /// Log Singleton Accessor
        /// </summary>
        public ILogger Logger = UnityFactory.GetLogger();

        ///// <summary>
        ///// Donne le token d'autorisation pour le NLog
        ///// </summary>
        //public string LogJsToken { get { return _logJsToken; } }

        private static readonly Guid _basicBearer = Guid.Parse(ConfigurationManager.AppSettings["BasicBearer"]);
        /// <summary>
        /// Bearer for a basic/first level of security
        /// </summary>
        public Guid BasicBearer { get { return _basicBearer; } }

        /// <summary>
        /// Rename the Anti-Forgery cookie from "__RequestVerificationToken" to "L". 
        /// </summary>
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