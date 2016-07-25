using System;

namespace LMS.Core.Domain
{
    public interface IApplicationModel
    {
        string Name { get; set; }
        long PingCount { get; set; }
        DateTime StartDate { get; set; }
        DateTime LastDate { get; set; }
    }
}