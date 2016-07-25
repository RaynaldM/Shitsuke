using FluentScheduler;
using LMS.web.Scheduler.Jobs;

namespace LMS.web.Scheduler
{
    /// <summary>
    /// Registry the Monitor Hub Scheduler
    /// </summary>
    public class SchedulerRegistry : Registry
    {
        /// <summary>
        /// ctor
        /// </summary>
        public SchedulerRegistry()
        {
            // Schedule an signalr Monitor Hub for dashboard
            Schedule<MonitoringJobs>().ToRunEvery(1).Seconds();
            // Todo : set time from web config

            // Schedule an signalr Home Monitor Hub
            Schedule<HomeMonitoringJobs>().ToRunEvery(10).Seconds();
            
            //Schedule a signalr Logs Hub for dashboard
            Schedule<LogsJobs>().ToRunEvery(10).Seconds();

            //Schedule<LogsTasks>().ToRunNow().AndEvery(30).Seconds();
        }
    }
}