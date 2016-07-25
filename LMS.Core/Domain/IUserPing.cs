using System;

namespace LMS.Core.Domain
{
    public interface IUserPing
    {
        string UserId { get; set; }
        string ApplicationId { get; set; }
        string PageId { get; set; }
        string BrowserInfo { get; set; }
        DateTime? UtcTimeStamp { get; set; }
        bool IsValid { get; }
    }
}