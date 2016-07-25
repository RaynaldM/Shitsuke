using LMS.Core.Domain;

namespace LMS.Domain
{ /// <summary>
    /// Model uses between Hub and browsers for online users monitoring zone
    /// </summary>
    public class HomeMonitoringHubModel : IHomeMonitoringHubModel
{
        /// <summary>
        /// Count of Online Users for all applications
        /// </summary>
        public int UsersCount { get; set; }

        /// <summary>
        /// Count of hinted pages
        /// </summary>
        public int PagesCount { get; set; }

        /// <summary>
        /// Count of Active Apps
        /// </summary>
        public int AppsCount { get; set; }
    }
}
