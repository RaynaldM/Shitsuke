using System;
using FluentScheduler;

namespace LMS.web.Helpers.Scheduler
{
    public class JobFactory : IJobFactory
    {
        public IJob GetJobInstance<T>() where T : IJob
        {
            return Activator.CreateInstance<T>();
        }

    }
}