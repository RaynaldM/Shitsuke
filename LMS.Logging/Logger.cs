using System;
using ILogger = LMS.Core.Services.ILogger;

namespace LMS.Logging
{
    public class Logger : ILogger
    {
        //public Logger()
        //{
        //}

        public void Trace(Exception exception, string message, params object[] args)
        {
            // Our internal log system is StackExchange.Exceptional, 
            // we use its static LogExceptionWithoutContext to log error  
            StackExchange.Exceptional.ErrorStore.LogExceptionWithoutContext(exception, true);
        }

        public void Trace(string message)
        {
            // do nothing because we can't log a simple message
        }

        public void Debug(Exception exception, string message, params object[] args)
        {
            StackExchange.Exceptional.ErrorStore.LogExceptionWithoutContext(exception, true);
        }

        public void Debug(string message)
        {
            // do nothing
        }

        public void Info(Exception exception, string message, params object[] args)
        {
            StackExchange.Exceptional.ErrorStore.LogExceptionWithoutContext(exception, true);
        }

        public void Info(string message)
        {
            // do nothing
        }

        public void Warn(Exception exception, string message, params object[] args)
        {
            StackExchange.Exceptional.ErrorStore.LogExceptionWithoutContext(exception, true);
        }

        public void Warn(string message)
        {
            // do nothing
        }

        public virtual void Error(Exception exception, string message, params object[] args)
        {
            StackExchange.Exceptional.ErrorStore.LogExceptionWithoutContext(exception, true);
        }

        public void Error(string message)
        {
            // do nothing
        }

        public virtual void Fatal(Exception exception, string message, params object[] args)
        {
            StackExchange.Exceptional.ErrorStore.LogExceptionWithoutContext(exception, true);
        }

        public void Fatal(string message)
        {
            // do nothing
        }
    }
}
