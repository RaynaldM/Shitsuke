using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using LMS.Core.Domain;
using LMS.Core.Enums;

namespace LMS.Domain
{
    public class FeedbackListModel : IFeedbackListModel
    {
        [Key]
        public long Id { get; set; }
        public FeedbackType Type { get; set; }
        public FeedbackStatus Status { get; set; }
        public string Comments { get; set; }
        public string Appcode { get; set; }
        public string Pageid { get; set; }
        public DateTime Created { get; set; }
        public virtual bool HaveScreenshot { get; set; }
    }

    public class FeedbackViewModel : FeedbackListModel, IFeedbackViewModel
    {
        public string Screenshot { get; set; }
        public string Browserinfo { get; set; }
        public string Userid { get; set; }
        public override bool HaveScreenshot { get { return !String.IsNullOrEmpty(this.Screenshot); } }
  }

    public class FeedBackDashboard : IFeedBackDashboard
    {
        public int News { get; set; }
        public int Unanswered { get; set; }
        public int Open { get; set; }
        public IEnumerable<IFeedbackListModel> List { get; set; }
    }
}
