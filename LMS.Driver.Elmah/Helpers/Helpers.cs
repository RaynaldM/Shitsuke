using System;
using System.Collections;
using System.Configuration;

namespace LMS.Driver.Elmah.Helpers
{
    public class Helpers
    {
        public static string ResolveApplicationName(IDictionary config)
        {
            if (config.Contains("applicationName"))
                return config["applicationName"].ToString();

            if (!config.Contains("appNameKey")) return null;

            var appName = ConfigurationManager.AppSettings[(string)config["appNameKey"]];
            return appName;
        }

        public static Uri ResolveUrl(IDictionary config)
        {
            string url = null;
            if (config.Contains("urlKey"))
            {
                // it is a key in Web.config/AppSetting
                url = ConfigurationManager.AppSettings[(string)config["urlKey"]];
            }
            else if (config.Contains("url"))
            {
                // it is a direct url
                url = config["url"].ToString();
            }

            if (url == null)
                throw new ArgumentNullException("Shitsuke Server Url can not be null");

            Uri uri;
            if (!Uri.TryCreate(url, UriKind.Absolute, out uri))
            {
                throw new ApplicationException(
                    "Invalid URL. Please specify a valid absolute url.");
            }

            return uri;
        }

        public static Guid ResolveLogId(IDictionary config)
        {
            const string errorMessage =
                "Missing Token. Please specify a token in your web.config like this: <errorLog type='LMS.Driver.Elmah.LMSElmahLogs, LMS-Driver-Elmah' token='xxxxxx-0000-4986-8056-cb76d4d52e5e' url='http://localhost:1975'/>";

            string token = null;
            if (config.Contains("tokenKey"))
            {
                // it is a key in Web.config/AppSetting
                token = ConfigurationManager.AppSettings[(string)config["tokenKey"]];
   
            }
            else if (config.Contains("token"))
            {
                // a direct token
                token = config["token"].ToString();
            }
          
            if (token == null)
                throw new ArgumentNullException("Shitsuke Server token can not be null");

            Guid result;
            if (!Guid.TryParse(token, out result))
            {
                throw new ApplicationException(errorMessage);
            }
            return result;
        }

    }
}
