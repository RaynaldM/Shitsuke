using System;
using LMS.Drivers.NC.Core;
using LMS.Drivers.NC.Core.Models;
using NLog;

namespace LMS.Driver.NC.NLog.Models
{
    public class ErrorFromNlog : Error
    {
        public ErrorFromNlog(LogEventInfo log, string applicationName = null)
            : base(applicationName)
        {
            if (log.Exception != null)
            {
                this.SetException(log.Exception);
                if (log.HasStackTrace)
                {
                    this.Source = log.StackTrace.ToString();
                }
                if (log.Properties.Count > 0)
                {
                    // set context in custom data
                    foreach (var property in log.Properties)
                    {
                        this.CustomData.Add(property.Key.ToString(),property.Value.ToString());
                    }
                }
            }
            else
            {
                // it's just an info
                this.Message = log.Message;
                this.Type = "NLog Message";
            }
            this.ErrorLevel = (ErrorLevel?) log.Level.GetHashCode();
            ErrorHash = GetHash();
        }

        private void SetException(Exception ex)
        {
            this.Exception = ex;
            var baseException = ex;

            // if it's not a .Net core exception, usually more information is being added
            // so use the wrapper for the message, type, etc.
            // if it's a .Net core exception type, drill down and get the innermost exception
            if (IsBuiltInException(ex))
                baseException = ex.GetBaseException();

            this.Type = baseException.GetType().FullName;
            Message = baseException.Message;
            Source = baseException.Source;
           
            Detail = ex.ToString();

            // todo : fix migration 4.5 > core
            //var httpException = ex as HttpException;
            //if (httpException != null)
            //{
            //    StatusCode = httpException.GetHttpCode();
            //}
            this.AddFromData(ex);
        }
    }
}
