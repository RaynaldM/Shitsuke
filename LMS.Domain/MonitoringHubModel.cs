using System.Collections.Generic;
using LMS.Core.Domain;

namespace LMS.Domain
{ /// <summary>
    /// Model uses between Hub and browsers for online users monitoring zone
    /// </summary>
    public class MonitoringHubModel : IMonitoringHubModel
{
        public string Id { get; set; }
        /// <summary>
        /// Count of Online Users
        /// </summary>
        public int UsersCount { get; set; }

        /// <summary>
        /// History of Online Users Count (on last 5 minutes)
        /// </summary>
        public IEnumerable<int> UsersCountHistory { get; set; }

        /// <summary>
        /// History of Page used (on last 5 minutes)
        /// </summary>
        public IEnumerable<int> PagesCountHistory { get; set; }

        /// <summary>
        /// History of Pages used (on last 60 secondes)
        /// </summary>
        public IEnumerable<int> PagesCountHistoryBySecond { get; set; }
    }
}
