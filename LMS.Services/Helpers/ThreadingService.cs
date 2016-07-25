using System;
using System.Threading.Tasks;
using LMS.Core.Services;

namespace LMS.Services.Helpers
{
    public class ThreadingService
    {
        /// <summary>
        /// Method to fire and forget the given action.
        /// Logs the error in the event of the exception, but no exception is raised.
        /// </summary>
        /// <param name="action">The Action to execute.</param>
        /// <param name="logger">Logger system instance</param>
        public static void FireAndForget(Action action, ILogger logger)
        {
           Task.Factory.StartNew(action)
                .ContinueWith(previousTask =>
                {
                    if (previousTask.Exception != null)
                        previousTask.Exception.Handle(ex =>
                        {
                            logger.Error(ex, "Fire and Forget task");
                            return true; //mark as handled
                        });
                }, TaskContinuationOptions.OnlyOnFaulted);
        }
    }
}
