using System;
using aspnet_mvc_helpers;

namespace LMS.web.Helpers
{


    /// <summary>
    /// Grid Param with specifics info form LMS
    /// </summary>
    public class LMSGridParams : JBootGridParams
    {
        /// <summary>
        /// Application Id
        /// </summary>
        public string appId { get; set; }
    }

    /// <summary>
    /// Grid Param with specifics info from LMS Logs grid
    /// </summary>
    public class LogsGridParams : LMSGridParams
    {
        /// <summary>
        /// End of the period
        /// </summary>
        public DateTime endDate { get; set; }
        /// <summary>
        /// period of query (0 - day, 1 - week 2 - month)
        /// </summary>
        public byte period { get; set; }
    }

    /// <summary>
    /// Grid Param with specifics info from LMS Feedbacks grid
    /// </summary>
    public class FeedbackGridParams : LMSGridParams
    {
        public int type { get; set; }

        public int status { get; set; }
    }
}