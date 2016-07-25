using FluentScheduler;
using LMS.web.Scheduler;

namespace LMS.web
{
    /// <summary>
    /// Main scheduler configuration
    /// </summary>
    public static class SchedulerConfig
    {
        /// <summary>
        /// Register all scheduler
        ///  > and stop them
        /// </summary>
        public static void Register()
        {
            JobManager.Initialize(new SchedulerRegistry());
            foreach (var schedule in JobManager.AllSchedules)
            {
                schedule.Disable();
            }
        }
    }
}