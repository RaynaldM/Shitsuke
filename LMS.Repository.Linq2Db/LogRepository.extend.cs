using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using DataModels;
using LMS.Core.Domain;
using LMS.Core.Helpers;
using LMS.Core.Models;
using LMS.Domain;
using LMS.Repository.Linq2Db.Helpers;
using Newtonsoft.Json;

namespace LMS.Repository.Linq2Db
{
    public partial class LogRepository
    {
        public long Insert(BaseError error)
        {
            var exp = new log
            {
                applicationid = error.ApplicationName,
                creationdate = error.CreationDate,
                detail = error.Detail,
                errorhash = error.ErrorHash,
                httpmethod = error.HTTPMethod,
                host = error.Host,
                ipaddress = error.IPAddress,
                machinename = error.MachineName,
                message = error.Message,
                sql = error.SQL,
                source = error.Source,
                statuscode = error.StatusCode,
                type = error.Type,
                url = error.Url,
                fulljson = JsonConvert.SerializeObject(error),
                errorlevel = (byte) (error.ErrorLevel?? ErrorLevel.Error)
            };

            return this.Insert(exp);
        }

        public IFullLogModel GetFullLog(long id)
        {
            var log = this.Get(id);
            var result = new FullLogModel
            {
                Id = log.id,
                Applicationid = log.applicationid,
                Creationdate = log.creationdate,
                Type = log.type,
                Errorlevel = log.errorlevel,
                Errorhash = log.errorhash,
                Url = log.url,
                Message = log.message,
                Machinename = log.machinename,
                Host = log.host,
                Httpmethod = log.httpmethod,
                Ipaddress = log.ipaddress,
                Source = log.source,
                Detail = log.detail,
                Sql = log.sql
            };
            return result;
        }

        public IStatLogModel GetStatLog(long id)
        {
            using (var db = this.DBFactory())
            {
                // Get the hashcode for this log
                var hashcode = (from p in db.GetTable<log>()
                                where p.id == id
                                select p.errorhash).First();
                if (hashcode != null)
                {
                    var qry = from p in db.GetTable<log>()
                              where p.errorhash == hashcode
                              group p by p.errorhash
                                  into g
                                  select new StatLogModel
                                  {
                                      Hashcode = g.Key.Value,
                                      Count = g.Count(),
                                      FirstTime = g.Min(m => m.creationdate),
                                      LastTime = g.Max(m => m.creationdate)
                                  };

                    var result = qry.First();
                    return result;
                }
            }
            return null;
        }

        public long GetIdByHash(int hashcode)
        {
            using (var db = this.DBFactory())
            {
                var qry = from p in db.GetTable<log>()
                          where p.errorhash == hashcode
                          orderby p.creationdate descending
                          select p.id;

                // arbitrary, we take the first and most recent
                var result = qry.First();
                return result;
            }
        }

        public IEnumerable<ILoggingHubModel> GetLogsData(int timeGap = 30)
        {
            var startDate = DateTime.UtcNow.AddMinutes(-timeGap);
            var apps = this.GetApplicationsList(startDate);
            return apps.Select(app => this.GetLogsDataByApp(app, timeGap)).ToList();
        }

        /// <summary>
        /// Get all logs in last timegap for one app
        /// </summary>
        /// <param name="appId">Application Code</param>
        /// <param name="timeGap">Timegap (default :30 mn)</param>
        /// <returns></returns>
        public ILoggingHubModel GetLogsDataByApp(string appId, int timeGap = 30)
        {
            using (var db = this.DBFactory())
            {
                var startDate = DateTime.UtcNow.AddMinutes(-timeGap);

                var qry = from p in db.GetTable<log>()
                          where p.applicationid == appId
                                && p.creationdate >= startDate
                          orderby p.creationdate descending
                          select new
                          {
                              date = p.creationdate,
                              p.type
                          };

                var qry2 = (from p in db.GetTable<log>()
                            where p.applicationid == appId
                                  && p.creationdate >= startDate
                            orderby p.creationdate descending
                            select new miniLog
                            {
                                Id = p.id,
                                Date = p.creationdate,
                                Message = p.message,
                                Type = p.type
                            }).Take(10);

                var minutes = startDate.GetMinutesInGap(timeGap).OrderByDescending(o => o);

                var list = qry.ToArray();
                var result = new LoggingHubModel
                {
                    Id = appId,
                    Count = list.Length,
                    List = new List<NameValuePair>(30),
                    MinutesCount = minutes.Select(minute => list.Count(p => p.date >= minute && p.date < minute.AddSeconds(59).AddMilliseconds(9999))).ToList(),
                    LastLogs = qry2.ToArray()
                };

                // compute the count by type list
                foreach (var minute in minutes)
                {
                    result.List.AddRange(list
                        .Where(p => p.date >= minute && p.date < minute.AddSeconds(59).AddMilliseconds(9999))
                        .GroupBy(info => info.type)
                        .Select(group => new NameValuePair
                        {
                            Name = group.Key,
                            Value = group.Count().ToString()
                        }).ToArray());

                }

                return result;
            }
        }

        public IEnumerable<string> GetApplicationsList(DateTime startDate)
        {
            using (var db = this.DBFactory())
            {
                var qry = from p in db.GetTable<log>()
                          where p.creationdate >= startDate
                          group p by p.applicationid
                              into g
                              select g.Key;

                return qry.ToArray();
            }
        }

        public IEnumerable<ILogModel> GetLogsList(string appid, DateTime endDate, byte period,
            int currentPage, int rowCount, string sort, string searchPhrase, out int total)
        {
            using (var db = this.DBFactory())
            {
                var startdate = PeriodHelpers.GetStartDate(endDate, period);
                var qry = from p in db.GetTable<log>()
                          where p.creationdate >= startdate && p.creationdate <= endDate
                          select p;

                if (!String.IsNullOrEmpty(appid) && appid != "*")
                    qry = qry.Where(p => p.applicationid == appid);

                if (!String.IsNullOrEmpty(searchPhrase))
                {
                    qry = qry.Where(p => p.message.Contains(searchPhrase)
                                         || p.url.Contains(searchPhrase)
                                         || p.type.Contains(searchPhrase));

                }
                // Count total of rows (with above constraints)
                total = qry.Count();

                if (sort != null)
                {
                    var sortParam = sort.Split('.');
                    SortOrder so = sortParam[1] == "asc" ? SortOrder.Ascending : SortOrder.Descending;
                    switch (sortParam[0])
                    {
                        case "Id":
                            qry = qry.ApplySorting(log => log.id, so);
                            break;
                        case "Creationdate":
                            qry = qry.ApplySorting(log => log.creationdate, so);
                            break;
                        case "Applicationid":
                            qry = qry.ApplySorting(log => log.applicationid, so);
                            break;
                        case "Type":
                            qry = qry.ApplySorting(log => log.type, so);
                            break;
                        case "Errorlevel":
                            qry = qry.ApplySorting(log => log.errorlevel, so);
                            break;
                        case "Statuscode":
                            qry = qry.ApplySorting(log => log.statuscode, so);
                            break;
                        case "Url":
                            qry = qry.ApplySorting(log => log.url, so);
                            break;
                        case "Message":
                            qry = qry.ApplySorting(log => log.message, so);
                            break;
                    }
                }

                int startRow = rowCount * (currentPage - 1); // Find start row

                var list = qry
                    .Skip(startRow)
                    .Take(rowCount)
                    .Select(p =>
                        new LogModel
                        {
                            Id = p.id,
                            Applicationid = p.applicationid,
                            Creationdate = p.creationdate,
                            Errorlevel = p.errorlevel,
                            Message = p.message,
                            Statuscode = p.statuscode,
                            Type = p.type,
                            Url = p.url
                        }).ToArray();


                return list;
            }
        }

        public IEnumerable<IOccurenceModel> GetOccurencesList(string appid, DateTime endDate, byte period,
                                    int currentPage, int rowCount, string sort, string searchPhrase, out int total)
        {
            using (var db = this.DBFactory())
            {
                var startdate = PeriodHelpers.GetStartDate(endDate, period);

                var qry = from p in db.GetTable<log>()
                          where p.creationdate >= startdate
                          && p.creationdate <= endDate
                          && p.errorhash != null
                          select p;

                if (!String.IsNullOrEmpty(appid) && appid != "*")
                    qry = qry.Where(p => p.applicationid == appid);

                if (!String.IsNullOrEmpty(searchPhrase))
                {
                    qry = qry.Where(p => p.message.Contains(searchPhrase)
                                         || p.url.Contains(searchPhrase)
                                         || p.type.Contains(searchPhrase));

                }

                // Group by hashcode
                // todo : SQL is not optimal, should improve it
                var groupQry = from p in qry
                               group p by p.errorhash
                                   into g
                                   select new OccurenceModel
                                   {
                                       HashId = g.Key.Value,
                                       Count = g.Count(),
                                       LastDate = g.Max(m => m.creationdate),
                                       //item = g.FirstOrDefault(),
                                       Level = g.First().errorlevel,
                                       Message = g.First().message,
                                       Type = g.First().type
                                   };

                // Count total of rows (with above constraints)
                total = groupQry.Count();

                if (sort != null)
                {
                    var sortParam = sort.Split('.');
                    SortOrder so = sortParam[1] == "asc" ? SortOrder.Ascending : SortOrder.Descending;
                    switch (sortParam[0])
                    {
                        case "Count":
                            groupQry = groupQry.ApplySorting(log => log.Count, so);
                            break;
                        case "LastDate":
                            groupQry = groupQry.ApplySorting(log => log.LastDate, so);
                            break;
                        //case "Applicationid":
                        //    qry = this.ApplySorting(qry, log => log.applicationid, so);
                        //    break;
                        case "Type":
                            groupQry = groupQry.ApplySorting(log => log.Type, so);
                            break;
                        case "Errorlevel":
                            groupQry = groupQry.ApplySorting(log => log.Level, so);
                            break;

                        //case "Url":
                        //    qry = this.ApplySorting(qry, log => log.url, so);
                        //    break;
                        case "Message":
                            groupQry = groupQry.ApplySorting(log => log.Message, so);
                            break;
                    }
                }

                int startRow = rowCount * (currentPage - 1); // Find start row

                var list = groupQry
                    .Skip(startRow)
                    .Take(rowCount)
                    .Select(s => s).ToArray();

                return list;
            }
        }
    }
}
