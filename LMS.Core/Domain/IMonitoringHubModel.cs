using System.Collections.Generic;

namespace LMS.Core.Domain
{
    public interface IMonitoringHubModel
    {
        string Id { get; set; }

        /// <summary>
        /// Count of Online Users
        /// </summary>
        int UsersCount { get; set; }

        /// <summary>
        /// History of Online Users Count (on last 5 minutes)
        /// </summary>
        IEnumerable<int> UsersCountHistory { get; set; }

        /// <summary>
        /// History of Page used (on last 5 minutes)
        /// </summary>
        IEnumerable<int> PagesCountHistory { get; set; }

        /// <summary>
        /// History of Pages used (on last 60 secondes)
        /// </summary>
        IEnumerable<int> PagesCountHistoryBySecond { get; set; }
    }
}