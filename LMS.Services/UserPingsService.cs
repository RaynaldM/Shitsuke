using System;
using System.Collections.Generic;
using DataModels;
using LMS.Core.Domain;
using LMS.Core.Services;
using LMS.Repository.Linq2Db;
using LMS.Services.Helpers;

namespace LMS.Services
{
    /// <summary>
    /// Service use to manage and analyse User Ping
    /// </summary>
    public class UserPingsService : BaseServices<UserPingRepository>, IBaseService
    {
        public long Ping(IUserPing userPing)
        {
            try
            {
                // Stamp the ping info
                userPing.UtcTimeStamp = DateTime.UtcNow;

                return this.Repository.Insert(this.MapTo(userPing));

            }
            catch (Exception ex)
            {
                this.LogService.Error(ex, "User Ping");
                return -1;
            }

        }

        public IEnumerable<IMonitoringHubModel> ComputeMonitoringData()
        {
            try
            {
                return this.Repository.GetMonitoringData();

            }
            catch (Exception ex)
            {
                this.LogService.Debug(ex, "Compute Ping Monitor Data");
                return null;
            }
        }

        public IHomeMonitoringHubModel ComputeHomeMonitoringData()
        {
            try
            {
                return this.Repository.GetHomeMonitoringData();

            }
            catch (Exception ex)
            {
                this.LogService.Debug(ex, "Compute Home Monitor Data");
                return null;
            }
        }

        private userping MapTo(IUserPing userPing)
        {
            var result = new userping
            {
                userid = userPing.UserId,
                applicationid = userPing.ApplicationId,
                pageid = userPing.PageId,
                browerinfo = userPing.BrowserInfo,
                // ReSharper disable once PossibleInvalidOperationException
                utctimestamp = userPing.UtcTimeStamp.Value
            };
            return result;
        }

    }
}
