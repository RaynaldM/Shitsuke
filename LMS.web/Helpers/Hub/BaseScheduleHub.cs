using System.Threading.Tasks;
using FluentScheduler;

namespace LMS.web.Helpers.Hub
{
    /// <summary>
    /// SignalR Hub base on a schedule heartbeat  
    /// </summary>
    public abstract class BaseScheduleHub : BaseHub
    {
        protected string TaskName;

        public override Task OnConnected()
        {
            var task = base.OnConnected();
            // todo : launch scheduler in not launched
            this.LaunchSchedule();
            return task;
        }

        public override Task OnReconnected()
        {
            var task = base.OnReconnected();
            // todo : launch scheduler in not launched
            this.LaunchSchedule();
            return task;
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var task = base.OnDisconnected(stopCalled);
            this.LandingSchedule();
            return task;
        }

        protected virtual void LaunchSchedule()
        {
            // todo : launch scheduler in not launched
            if (this.HaveUsers && JobManager.GetSchedule(this.TaskName).Disabled)
            {
                JobManager.GetSchedule(this.TaskName).Enable();
            }
        }

        protected virtual void LandingSchedule()
        {
            // no more client
            if (!this.HaveUsers && JobManager.GetSchedule(this.TaskName).Disabled == false)
            {
                JobManager.GetSchedule(this.TaskName).Disable();
            }

        }
    }
 
}