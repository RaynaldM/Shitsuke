using System.Web.Http;
using Newtonsoft.Json;

namespace LMS.web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // http://www.asp.net/web-api/overview/security/enabling-cross-origin-requests-in-web-api
            config.EnableCors();
            // Web API routes
            config.MapHttpAttributeRoutes();

            // http://jasonwatmore.com/post/2014/05/03/Getting-ELMAH-to-catch-ALL-unhandled-exceptions-in-Web-API-21.aspx
            //config.Services.Add(typeof(IExceptionLogger), new StackExchange.Exceptional.); // todo : connect to exceptional


            // Configuration des échanges ajax via json
            var configJson = config.Formatters.JsonFormatter.CreateDefaultSerializerSettings();
            configJson.NullValueHandling = NullValueHandling.Ignore; // les valeurs null sont ignorés et pas envoyés au client
            configJson.DateFormatHandling = DateFormatHandling.IsoDateFormat; // les dates sont au format ISO
            configJson.DateTimeZoneHandling = DateTimeZoneHandling.Utc; // et toujours en UTC
            //   configJson.DateFormatString = "yyyy'-'MM'-'dd'T'HH':'mm':'ssZ";
            config.Formatters.JsonFormatter.SerializerSettings = configJson;

            // Passé au mode "Action"
            config.Routes.MapHttpRoute("DefaultApi",
                "api/{controller}/{action}/{id}",
                new { id = RouteParameter.Optional }
                );

        }
    }
}