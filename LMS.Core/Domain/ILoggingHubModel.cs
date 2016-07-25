using System.Collections.Generic;
using LMS.Core.Models;

namespace LMS.Core.Domain
{
    public interface ILoggingHubModel
    {
        string Id { get; set; }
        int Count { get; set; }
        List<NameValuePair> List { get; set; }
        IList<int> MinutesCount { get; set; }
        IEnumerable<miniLog> LastLogs { get; set; }
    }
}