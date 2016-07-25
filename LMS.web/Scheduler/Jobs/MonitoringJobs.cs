using System;
using LMS.Services;
using LMS.web.Helpers.Scheduler;
using LMS.web.Hub;

namespace LMS.web.Scheduler.Jobs
{
    /// <summary>
    /// Scheduled Task for monitoring signalR hub
    /// </summary>
    public class MonitoringJobs : BaseJobs<UserPingsService>
    {
        /// <summary>
        /// Real Task to execute
        /// </summary>
        public override void RealTask()
        {
            try
            {
                var data = this.Service.ComputeMonitoringData();
                MonitorHubService.RefreshClientCount(data);
            }
            catch (Exception ex)
            {
                this.Logger.Debug(ex, "Monitoring Job");
            }

        }

    }
}