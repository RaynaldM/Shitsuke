using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using DataModels;
using LinqToDB;
using LMS.Domain;
using System.Linq;
using System.Threading.Tasks;
using LMS.Core.Domain;
using LMS.Core.Enums;
using LMS.Repository.Linq2Db.Helpers;

namespace LMS.Repository.Linq2Db
{
    public partial class FeedbackRepository
    {
        public IEnumerable<IFeedbackListModel> List(string appid,
            int currentPage, int rowCount, string sort,
            string searchPhrase, int type, int status, out int total)
        {
            using (var db = this.DBFactory())
            {
                var baseQry = from p in db.GetTable<feedback>()
                              select p;

                if (!String.IsNullOrEmpty(appid) && appid != "*")
                    baseQry = baseQry.Where(p => p.applicationid == appid);

                if (!String.IsNullOrEmpty(searchPhrase))
                {
                    baseQry = baseQry.Where(p => p.comments.Contains(searchPhrase));
                }

                if (type >= 0)
                {
                    // set filter on type
                    baseQry = baseQry.Where(p => p.type == (FeedbackType)type);
                }

                if (status >= 0)
                {
                    // set filter on status
                    baseQry = baseQry.Where(p => p.status == (FeedbackStatus)status);
                }

                total = baseQry.Count();
                if (sort != null)
                {
                    var sortParam = sort.Split('.');
                    SortOrder so = sortParam[1] == "asc" ? SortOrder.Ascending : SortOrder.Descending;
                    switch (sortParam[0])
                    {
                        case "Id":
                            baseQry = baseQry.ApplySorting(fd => fd.id, so);
                            break;
                        case "Created":
                            baseQry = baseQry.ApplySorting(fd => fd.utctimestamp, so);
                            break;
                        case "Appcode":
                            baseQry = baseQry.ApplySorting(fd => fd.applicationid, so);
                            break;
                        case "Type":
                            baseQry = baseQry.ApplySorting(fd => fd.type, so);
                            break;
                        case "Status":
                            baseQry = baseQry.ApplySorting(fd => fd.status, so);
                            break;
                        case "Comments":
                            baseQry = baseQry.ApplySorting(fd => fd.comments, so);
                            break;
                    }
                }

                if (rowCount == -1) // Select all line
                    rowCount = total;

                int startRow = rowCount * (currentPage - 1); // Find start row

                var qry = from p in baseQry
                          .Skip(startRow)
                          .Take(rowCount)
                          select new FeedbackListModel
                          {
                              Id = p.id,
                              Type = p.type,
                              Status = p.status,
                              Appcode = p.applicationid,
                              Comments = p.comments,
                              Created = p.utctimestamp,
                              HaveScreenshot = p.screenshot != null,
                              Pageid = p.pageid
                          };

                return qry.ToArray();
            }

        }

        public async Task<IFeedBackDashboard> ResumeList(string appCode, int itemQty = 10)
        {
            var result = new FeedBackDashboard
            {
                News = await this.CountByStatus(appCode, FeedbackStatus.New),
                // Unanswered = await this.CountUnanswered(appCode),
                Open = await this.CountByStatus(appCode, FeedbackStatus.Open),
                List = await this.FeedbackList(appCode, itemQty)
            };
            return result;
        }

        private async Task<IFeedbackListModel[]> FeedbackList(string appcode, int itemQty = 10)
        {
            using (var db = this.DBFactory())
            {
                var baseQry = from p in db.GetTable<feedback>()
                              select p;

                if (appcode != "lms-allapps")
                {
                    baseQry = baseQry.Where(p => p.applicationid == appcode);
                }

                var qry = from p in baseQry
                          where p.status == FeedbackStatus.New || p.status == FeedbackStatus.Open
                          orderby p.utctimestamp descending
                          select new FeedbackListModel
                          {
                              Id = p.id,
                              Type = p.type,
                              Status = p.status,
                              Appcode = p.applicationid,
                              Comments = p.comments,
                              Created = p.utctimestamp,
                              HaveScreenshot = p.screenshot != null,
                              Pageid = p.pageid
                          };

                return await qry.Take(itemQty).ToArrayAsync();
            }

        }

        private Task<int> CountByStatus(string appcode, FeedbackStatus statusToCount)
        {
            using (var db = this.DBFactory())
            {
                var baseQry = db.feedbacks.Where(p => p.status == statusToCount);

                if (appcode != "lms-allapps")
                {
                    baseQry = baseQry.Where(p => p.applicationid == appcode);
                }

                return baseQry.CountAsync();
            }
        }

        public long Insert(IFeedbackApiModel feedback)
        {
            var fd = this.MapTo(feedback);
            return this.Insert(fd);
        }

        private feedback MapTo(IFeedbackApiModel feedback)
        {
            var result = new feedback
            {
                applicationid = feedback.appcode,
                browserinfo = feedback.browserinfo,
                comments = feedback.comment,
                pageid = feedback.pageid,
                screenshot = !String.IsNullOrEmpty(feedback.screenshot)
                    ? Convert.FromBase64String(feedback.screenshot.Substring(feedback.screenshot.IndexOf("base64,", StringComparison.Ordinal) +
                                                    7))
                    : null,
                type = feedback.feedbackType,
                utctimestamp = DateTime.UtcNow,
                userid = feedback.userid,
                status = FeedbackStatus.New
            };
            return result;
        }

        public IFeedbackViewModel GetFeedback(long id)
        {
            var pocoFd = this.Get(id);

            var result = new FeedbackViewModel
            {
                Id = id,
                Created = pocoFd.utctimestamp,
                Appcode = pocoFd.applicationid,
                Browserinfo = pocoFd.browserinfo,
                Comments = pocoFd.comments,
                Type = pocoFd.type,
                Status = pocoFd.status,
                Pageid = pocoFd.pageid,
                Userid = pocoFd.userid,
                Screenshot = pocoFd.screenshot != null && pocoFd.screenshot.LongLength > 0 ?
                "data:image/png;base64," + Convert.ToBase64String(pocoFd.screenshot)
                : null
            };
            return result;
        }

        public bool SetStatus(long id, FeedbackStatus newStatus)
        {
            using (var db = this.DBFactory())
            {
                try
                {
                    db.BeginTransaction(IsolationLevel.ReadUncommitted);

                    db.feedbacks
                        .Where(p => p.id == id)
                        .Set(p => p.status, newStatus)
                        .Update();

                    db.CommitTransaction();
                    return true;
                }
                catch (Exception)
                {
                    db.RollbackTransaction();
                    throw;
                }
            }
        }
    }
}
