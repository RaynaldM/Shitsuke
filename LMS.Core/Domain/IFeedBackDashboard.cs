using System.Collections.Generic;

namespace LMS.Core.Domain
{
    public interface IFeedBackDashboard
    {
        int News { get; set; }
        int Unanswered { get; set; }
        int Open { get; set; }
        IEnumerable<IFeedbackListModel> List { get; set; }
    }
}