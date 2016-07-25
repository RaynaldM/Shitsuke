using System;
using LMS.Core.Enums;

namespace LMS.Core.Domain
{
    public interface IFeedbackListModel
    {
        long Id { get; set; }
        FeedbackType Type { get; set; }
        FeedbackStatus Status { get; set; }
        string Comments { get; set; }
        string Appcode { get; set; }
        string Pageid { get; set; }
        DateTime Created { get; set; }
        bool HaveScreenshot { get; set; }
    }
}