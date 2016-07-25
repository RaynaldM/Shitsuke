//using System.Web.Http;
//using Newtonsoft.Json;

//namespace LMS.Web.Sample
//{
//    public static class JsonConfig
//    {
//        public static void Register(HttpConfiguration config)
//        {
//            // Configuration des échanges ajax via json
//            // Configuration des échanges ajax via json
//            var configJson = config.Formatters.JsonFormatter.CreateDefaultSerializerSettings();
//            configJson.NullValueHandling = NullValueHandling.Ignore; // les valeurs null sont ignorés et pas envoyés au client
//            configJson.DateFormatHandling = DateFormatHandling.IsoDateFormat; // les dates sont au format ISO
//            configJson.DateTimeZoneHandling = DateTimeZoneHandling.Utc; // et toujours en UTC
//            //   configJson.DateFormatString = "yyyy'-'MM'-'dd'T'HH':'mm':'ssZ";
//            config.Formatters.JsonFormatter.SerializerSettings = configJson;
//        }
//    }
//}