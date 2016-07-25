using System;

namespace LMS.Core.Domain
{
    public interface IOccurenceModel
    {
        int HashId { get; set; }
        int Count { get; set; }
        DateTime LastDate { get; set; }
        byte Level { get; set; }
        string Message { get; set; }
        string Type { get; set; }
    }
}