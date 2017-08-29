using System;
using System.Collections.Generic;
using LMS.Core.Domain;
using LMS.Core.Models;
using LMS.Core.Services;
using LMS.Repository.Linq2Db;
using LMS.Services.Helpers;

namespace LMS.Services
{
    public class LogService : BaseServices<LogRepository>, IBaseService
    {
        public long Logs(BaseError error)
        {
            try
            {
                if (error.ErrorHash == null && !string.IsNullOrWhiteSpace(error.Detail))
                    error.ErrorHash = error.GetHashCode();
                return this.Repository.Insert(error);
            }
            catch (Exception ex)
            {
                this.LogService.Error(ex, "User Ping");
                return -1;
            }
        }

        public IEnumerable<ILoggingHubModel> ComputeLogsData()
        {
            try
            {
                return this.Repository.GetLogsData();

            }
            catch (Exception ex)
            {
                this.LogService.Debug(ex, "Compute Logs Monitor Data");
                return null;
            }
        }

        public IEnumerable<ILogModel> GetLogsList(string appid, DateTime endDate, byte period,
            int currentPage, int rowCount,string sort, string searchPhrase, out int total)
        {
            var rows = this.Repository.GetLogsList(appid, endDate, period, currentPage,
                rowCount, sort, searchPhrase, out total);
            return rows;
        }

        public IEnumerable<IOccurenceModel> GetOccurencesList(string appid, DateTime endDate, byte period,
            int currentPage, int rowCount, string sort, string searchPhrase, out int total)
        {
            var rows = this.Repository.GetOccurencesList(appid, endDate, period, currentPage,
                rowCount, sort, searchPhrase, out total);
            return rows;
        }

        public IFullLogModel GetLogById(long id)
        {
            return this.Repository.GetFullLog(id);
        }

        public IStatLogModel GetStatById(long id)
        {
            return this.Repository.GetStatLog(id);
        }

        public long GetIdByHash(int id)
        {
            return this.Repository.GetIdByHash(id);
        }
    }
}
