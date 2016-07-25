using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataModels;
using LinqToDB;
using LMS.Core.Domain;
using LMS.Core.Models;
using LMS.Domain;
using LMS.Repository.Linq2Db.Helpers;

namespace LMS.Repository.Linq2Db
{
    public partial class UserPingRepository
    {
        #region DashBoard
        public IEnumerable<IMonitoringHubModel> GetMonitoringData(int timeGap = 5, int timeSecondsGap = 10)
        {
            var startDate = DateTime.UtcNow.AddMinutes(-timeGap);
            var apps = this.GetApplicationsList(startDate);
            var result = new List<IMonitoringHubModel>();
            foreach (var app in apps)
            {
                result.Add(this.GetMonitoringDataByApp(app, timeGap, timeSecondsGap));
            }
            return result;
        }

        public IMonitoringHubModel GetMonitoringDataByApp(string appId, int timeGap = 5, int timeSecondsGap = 10)
        {
            // todo use helper for gap and try to improve perf
            var startDate = DateTime.UtcNow;
            var lastMinutes = new List<DateTime>(timeGap);
            for (int t = 0; t < timeGap; t++)
            {
                lastMinutes.Add(startDate.AddMinutes(-t));
            }
            var lastMinute = new List<DateTime>(timeSecondsGap);
            for (int t = 0; t < timeSecondsGap - 1; t++)
            {
                lastMinute.Add(startDate.AddSeconds(-t));
            }
            startDate = startDate.AddMinutes(-timeGap);

            using (var db = this.DBFactory())
            {
                var queryUsr = from p in db.GetTable<userping>()
                               where p.utctimestamp >= startDate
                                     && p.applicationid == appId
                               orderby p.utctimestamp descending
                               select p;

                var queryUsrM = from p in db.GetTable<userping>()
                                where p.applicationid == appId
                                select new
                                {
                                    p.userid,
                                    p.utctimestamp,
                                    p.pageid
                                };

                var usersCountHistory = (from minute in lastMinutes
                                         let lessMinute = minute.AddMinutes(-1)
                                         select queryUsrM.Where(p => p.utctimestamp <= minute
                                                                     && p.utctimestamp > lessMinute)
                                             .Select(s => s.userid)
                                             .Distinct()
                                             .Count()).ToArray();

                var pagesCountHistory = (from minute in lastMinutes
                                         let lessMinute = minute.AddMinutes(-1)
                                         select queryUsrM.Where(p => p.utctimestamp <= minute
                                                                     && p.utctimestamp > lessMinute)
                                             .Select(s => s.pageid)
                                             .Distinct()
                                             .Count()).ToArray();

                var pagesCountHistoryBySecond = new List<int>();
                foreach (var second in lastMinute)
                {
                    var lessMinute = second.AddSeconds(-1);
                    var cc = queryUsrM.Where(p => p.utctimestamp <= second
                                                  && p.utctimestamp > lessMinute)
                        .Select(s => s.pageid)
                        .Distinct()
                        .Count();
                    pagesCountHistoryBySecond.Add(cc);
                }

                var result = new MonitoringHubModel
                {
                    Id = appId,
                    UsersCount = queryUsr.GroupBy(g => g.userid).Count(),
                    UsersCountHistory = usersCountHistory,
                    PagesCountHistory = pagesCountHistory,
                    PagesCountHistoryBySecond = pagesCountHistoryBySecond
                };
                return result;
            }
        }
        #endregion

        public IEnumerable<IApplicationModel> GetApplicationsList()
        {
            using (var db = this.DBFactory())
            {
                var qry = from p in db.GetTable<userping>()
                          group p by p.applicationid
                              into g
                              select new ApplicationModel
                              {
                                  Name = g.Key,
                                  PingCount = g.Count(),
                                  StartDate = g.Min(m => m.utctimestamp),
                                  LastDate = g.Max(m => m.utctimestamp)
                              };
                return qry.ToArray();
            }
        }

        public IEnumerable<string> GetApplicationsList(DateTime startDate)
        {
            using (var db = this.DBFactory())
            {
                var qry = from p in db.GetTable<userping>()
                          where p.utctimestamp >= startDate
                          group p by p.applicationid
                              into g
                              select g.Key;

                return qry.ToArray();
            }
        }

        public IHomeMonitoringHubModel GetHomeMonitoringData(int timeGap = 5)
        {
            using (var db = this.DBFactory())
            {
                var startDate = DateTime.UtcNow.AddMinutes(-timeGap);

                var query = from p in db.GetTable<userping>()
                            where p.utctimestamp >= startDate
                            select p;

                var result = new HomeMonitoringHubModel
                {
                    AppsCount = query.Select(s => s.applicationid).Distinct().Count(),
                    UsersCount = query.Select(s => s.userid + s.applicationid).Distinct().Count(),
                    PagesCount = query.Select(s => s.pageid + s.applicationid).Distinct().Count()
                };
                return result;
            }
        }

        #region Hinted Stats
        public int[] GetHintedUsers(string appId, byte typeperiod, DateTime endDate)
        {
            var gaps = PeriodHelpers.ComputeGap(endDate, typeperiod);
            gaps.gapDate.Reverse();
            using (var db = this.DBFactory())
            {
                IQueryable<userping> query = from p in db.GetTable<userping>()
                                             //orderby p.utctimestamp descending
                                             select p;

                if (appId != "*")
                {
                    query = query.Where(p => p.applicationid == appId);
                }

                return (from dateTime in gaps.gapDate
                        let end = dateTime.Add(gaps.gap)
                        select (from p in query
                                where p.utctimestamp <= dateTime && p.utctimestamp > end
                                group p by p.userid
                                    into g
                                    select new { count = g.Count() })
                            into qry
                            select qry.Select(s => s.count).ToArray()
                                into add
                                select add.Length).ToArray();
            }

        }

        public int[] GetHintedPages(string appId, byte typeperiod, DateTime endDate)
        {
            var gaps = PeriodHelpers.ComputeGap(endDate, typeperiod);
            gaps.gapDate.Reverse();

            using (var db = this.DBFactory())
            {
                IQueryable<userping> query = from p in db.GetTable<userping>()
                                             //orderby p.utctimestamp descending
                                             select p;

                if (appId != "*")
                {
                    query = query.Where(p => p.applicationid == appId);
                }

                var pagesCount = from start in gaps.gapDate
                                 let end = start.Add(gaps.gap)
                                 select query
                                     .Count(p => p.utctimestamp <= start
                                                         && p.utctimestamp > end);

                return pagesCount.ToArray();
            }
        }

        public Task<NameValueIntPair[]> GetTopPages(string appId, byte typeperiod, DateTime endDate, int count = 10)
        {
            var gap = PeriodHelpers.ComputeGap(endDate, typeperiod);
            var startDate = gap.gapDate.Last();
            using (var db = this.DBFactory())
            {
                IQueryable<userping> query = from p in db.GetTable<userping>()
                                             where p.utctimestamp >= startDate
                                             select p;

                if (appId != "*")
                {
                    query = query.Where(p => p.applicationid == appId);
                }

                var querygrp = from p in query
                               group p by p.pageid
                                   into g
                                   select new NameValueIntPair
                                   {
                                       Name = g.Key,
                                       Value = g.Count()
                                   };

                return querygrp.OrderByDescending(o => o.Value).Take(count).ToArrayAsync();
            }
        }

        public Task<string[]> GetBrowserStats(string appId, byte typeperiod, DateTime endDate)
        {
            var gap = PeriodHelpers.ComputeGap(endDate, typeperiod);
            var startDate = gap.gapDate.Last();
            using (var db = this.DBFactory())
            {
                IQueryable<userping> query = from p in db.GetTable<userping>()
                                             where p.utctimestamp >= startDate
                                             select p;

                if (appId != "*")
                {
                    query = query.Where(p => p.applicationid == appId);
                }

                var jsonlist = (from p in query
                                select p.browerinfo).ToArrayAsync();

                return jsonlist;
            }
        }
        #endregion
    }
}