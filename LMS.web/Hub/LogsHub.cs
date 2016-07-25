using System;
using System.Collections.Generic;
using LMS.Core.Domain;
using LMS.Core.Models;
using LMS.web.Helpers.Hub;
using Microsoft.AspNet.SignalR;

namespace LMS.web.Hub
{

    /// <summary>
    /// SignalR Hub for monitoring/ping information
    /// </summary>
    public class LogsHub : BaseScheduleHub
    {
        public LogsHub()
        {
            this.TaskName = "LogsJobs";
        }

        /// <summary>
        /// Send updated information to clients
        /// </summary>
        /// <param name="clientModel">New info for client</param>
        /// <returns></returns>
        public async void Refresh(IEnumerable<ILoggingHubModel> clientModel)
        {
            await Clients.All().refresh(clientModel);
        }

        /// <summary>
        /// Juste an Hello test to check if connection is ok
        /// </summary>
        public async void Hello()
        {
            await Clients.All.hello();
        }
    }

    /// <summary>
    /// Service to manipulate Monitoring Hub into scheduled task
    ///   Why server scheduled instead a client timer, because, each second, server compute stats 
    ///   for all clients vs all clients call server from browser and bomb it 
    /// </summary>
    public static class LogsHubService
    {
        // Todo : should be factorized
        /// <summary>
        /// HubContext of T singleton
        /// </summary>
        private static readonly Lazy<IHubContext> InContext = new Lazy<IHubContext>(GlobalHost.ConnectionManager.GetHubContext<LogsHub>);

        /// <summary>
        /// HubContext of T singleton
        /// </summary>
        private static IHubContext Context
        {
            get { return InContext.Value; }
        }

        /// <summary>
        /// Send updated information to clients
        /// </summary>
        /// <param name="clientModel">New info for client</param>
        /// <returns></returns>
        public static async void RefreshLogs(IEnumerable<ILoggingHubModel> clientModel)
        {
            // todo : if no client, cut the schedule & task
            //    var count=Context.Clients.
            await Context.Clients.All.refresh(clientModel);
        }

        /// <summary>
        /// Juste an Hello test to check if connection is ok
        /// </summary>
        public static async void Hello()
        {
            await Context.Clients.All.hello("go");
        }
    }
}