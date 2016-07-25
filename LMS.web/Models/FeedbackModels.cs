using LMS.Core.Domain;
using LMS.Core.Enums;

namespace LMS.web.Models
{
    public class FeedbackApiModel : IFeedbackApiModel
    {
        // ReSharper disable InconsistentNaming
        public FeedbackType feedbackType { get; set; }
        public string comment { get; set; }
        public string userid { get; set; }
        public string token { get; set; }
        public string appcode { get; set; }
        public string pageid { get; set; }
        public string browserinfo { get; set; }
        public string screenshot { get; set; }
        // ReSharper restore InconsistentNaming
    }
}
