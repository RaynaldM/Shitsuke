using System.Web.Hosting;
using FluentScheduler;
using LMS.Core.Services;
using LMS.web.Unity;

namespace LMS.web.Helpers.Scheduler
{
    /// <summary>
    /// Base Task
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class BaseJobs<T> : IJob, IRegisteredObject where T : class,IBaseService, new()
    {
        private readonly object _lock = new object();

        private bool _shuttingDown; 

        protected ILogger Logger = UnityFactory.GetLogger();

        /// <summary>
        /// Service Factory
        /// </summary>
        protected T Service
        {
            get { return new T {LogService = this.Logger}; }
        }

        /// <summary>
        /// ctor
        /// </summary>
        protected BaseJobs()
        {
            // Register this task with the hosting environment.
            // Allows for a more graceful stop of the task, in the case of IIS shutting down.
            HostingEnvironment.RegisterObject(this);
        }

        /// <summary>
        /// Execute task
        /// </summary>
        public void Execute()
        {
            lock (_lock)
            {
                if (_shuttingDown)
                    return;

                this.RealTask();
            }
        }

        /// <summary>
        /// Real Task to execute
        /// </summary>
        public virtual void RealTask() { }

        public void Stop(bool immediate)
        {
            // Locking here will wait for the lock in Execute to be released until this code can continue.
            lock (_lock)
            {
                _shuttingDown = true;
            }

            HostingEnvironment.UnregisterObject(this);
        }
    }
}