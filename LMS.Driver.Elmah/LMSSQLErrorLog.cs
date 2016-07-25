using System.Collections;
using Elmah;
using LMS.Driver.Elmah.Models;
using LMS.Drivers.Core;
using Error = Elmah.Error;

namespace LMS.Driver.Elmah
{
    public class LMSSQLErrorLog : SqlErrorLog
    {
        private readonly RestApi _client;

        public LMSSQLErrorLog(IDictionary config)
            : base(config)
        {
            var logId = Helpers.Helpers.ResolveLogId(config);
            var url = Helpers.Helpers.ResolveUrl(config);
            this.ApplicationName = Helpers.Helpers.ResolveApplicationName(config);

            _client = new RestApi(url, logId);
        }

        public LMSSQLErrorLog(string connectionString) : base(connectionString) { }

        public override string Log(Error error)
        {
            var result = base.Log(error);
#pragma warning disable 4014
            this._client.Log(new ErrorFromElmah(error, this.ApplicationName));
#pragma warning restore 4014
            return result;
        }
    }
}
