using System.Collections.Generic;
using LMS.Core.Domain;
using LMS.Core.Models;

namespace LMS.Domain
{
    public class LoggingHubModel : ILoggingHubModel
    {
        public string Id { get; set; }
        public int Count { get; set; }
        public List<NameValuePair> List { get; set; }
        public IList<int> MinutesCount { get; set; }
        public IEnumerable<miniLog> LastLogs { get; set; }
    }

}
