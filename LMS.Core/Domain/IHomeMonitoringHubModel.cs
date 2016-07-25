namespace LMS.Core.Domain
{
    public interface IHomeMonitoringHubModel
    {
        /// <summary>
        /// Count of Online Users for all applications
        /// </summary>
        int UsersCount { get; set; }

        /// <summary>
        /// Count of hinted pages
        /// </summary>
        int PagesCount { get; set; }

        /// <summary>
        /// Count of Active Apps
        /// </summary>
        int AppsCount { get; set; }
    }
}