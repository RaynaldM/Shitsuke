using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace LMS.Drivers.Core
{
    public class RestApi
    {
        private readonly string _token;
        private readonly Uri _baseUrl;

        public RestApi(Uri url, Guid token)
        {
            this._baseUrl = url;
            this._token = token.ToString();
        }

        public async Task<string> Log(Error message)
        {
            if (message.CreationDate == DateTime.MinValue) message.CreationDate = DateTime.UtcNow;

            var jsetting = new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                DateTimeZoneHandling = DateTimeZoneHandling.Utc
            };
            HttpClientHandler handler = new HttpClientHandler
            {
                UseCookies = false,
                UseDefaultCredentials = false
            };

            var json = JsonConvert.SerializeObject(message, jsetting);
            using (var httpClient = new HttpClient(handler))
            {
                httpClient.BaseAddress = this._baseUrl;
                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("lmstoken", this._token);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await httpClient.PostAsync("api/logs/add", content).ConfigureAwait(continueOnCapturedContext: false);
                return response.ReasonPhrase;
            }
        }

    }
}
