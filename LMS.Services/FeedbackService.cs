using System.Collections.Generic;
using System.Threading.Tasks;
using LMS.Core.Domain;
using LMS.Core.Enums;
using LMS.Core.Services;
using LMS.Repository.Linq2Db;
using LMS.Services.Helpers;

namespace LMS.Services
{
    public class FeedbackService : BaseServices<FeedbackRepository>, IBaseService
    {
        public async Task<IFeedBackDashboard> ResumeList(string appCode, int itemQty = 10)
        {
            return await this.Repository.ResumeList(appCode, itemQty);
        }

        public IEnumerable<IFeedbackListModel> List(string appid,
        int currentPage, int rowCount, string sort, string searchPhrase, int type, int status, out int total)
        {
            var rows = this.Repository.List(appid, currentPage, rowCount, sort, searchPhrase, type, status, out total);
            return rows;
        }

        public IFeedbackViewModel Get(long id)
        {
            return this.Repository.GetFeedback(id);
        }

        public long AddFeedback(IFeedbackApiModel feedback)
        {
            return this.Repository.Insert(feedback);
        }

        public bool SetStatus(long id, FeedbackStatus newStatus)
        {
            return this.Repository.SetStatus(id, newStatus);
        }

    }
}
