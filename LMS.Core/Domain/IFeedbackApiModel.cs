using LMS.Core.Enums;

namespace LMS.Core.Domain
{
    public interface IFeedbackApiModel
    {
        FeedbackType feedbackType { get; set; }
        string comment { get; set; }
        string userid { get; set; }
        string token { get; set; }
        string appcode { get; set; }
        string pageid { get; set; }
        string browserinfo { get; set; }
        string screenshot { get; set; }
    }
}