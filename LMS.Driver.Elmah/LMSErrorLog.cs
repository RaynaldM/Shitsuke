using System;
using System.Collections;
using System.Threading.Tasks;
using Elmah;
using LMS.Driver.Elmah.Models;
using LMS.Drivers.Core;
using Error = Elmah.Error;

namespace LMS.Driver.Elmah
{
    public class LMSErrorLog : ErrorLog
    {
        public static RestApi Client;

        public LMSErrorLog(IDictionary config)
        {
            if (Client != null) return;

            if (config == null)
            {
                throw new ArgumentNullException("config");
            }

            var logId = Helpers.Helpers.ResolveLogId(config);
            var url = Helpers.Helpers.ResolveUrl(config);
            this.ApplicationName = Helpers.Helpers.ResolveApplicationName(config);

            Client = new RestApi(url, logId);
        }

        public override string Log(Error error)
        {
            return EndLog(BeginLog(error, null, null));
        }

        public override IAsyncResult BeginLog(Error error, AsyncCallback asyncCallback, object asyncState)
        {
            var message = new ErrorFromElmah(error,this.ApplicationName);

            return Client.Log(message);
        }

        public override string EndLog(IAsyncResult asyncResult)
        {
            return EndImpl<string>(asyncResult);
        }

        public override ErrorLogEntry GetError(string id)
        {
            throw new NotImplementedException();
        }

        public override int GetErrors(int pageIndex, int pageSize, IList errorEntryList)
        {
            throw new NotImplementedException();
        }

        private T EndImpl<T>(IAsyncResult asyncResult)
        {
            if (asyncResult == null)
            {
                throw new ArgumentNullException("asyncResult");
            }

            var task = asyncResult as Task<T>;
            if (task == null)
            {
                throw new ArgumentException(null, "asyncResult");
            }

            return task.Result;
        }


    }
}
