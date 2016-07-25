using System;
using LMS.Services;
using LMS.web.Helpers.Scheduler;
using LMS.web.Hub;

namespace LMS.web.Scheduler.Jobs
{
    /// <summary>
    /// Scheduled Task for monitoring signalR hub
    /// </summary>
    public class LogsJobs : BaseJobs<LogService>
    {
        /// <summary>
        /// Real Task to execute
        /// </summary>
        public override void RealTask()
        {
            try
            {
                var data = this.Service.ComputeLogsData();
                LogsHubService.RefreshLogs(data);
            }
            catch (Exception ex)
            {
                this.Logger.Debug(ex, "Logs Job");
            }

        }

    }
}