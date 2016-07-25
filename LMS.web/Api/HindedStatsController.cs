using System;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using LMS.Core.Models;
using LMS.Services;
using LMS.Services.Models;
using LMS.web.Helpers.Api;
using StackExchange.Exceptional;

namespace LMS.web.Api
{
    [Authorize]
    public class HintedStatsController : BaseServiceApiController<HintedServices>
    {
        /// <summary>
        /// Get the sum of hinted user on a period
        /// </summary>
        /// <param name="appid">Application code (* = all)</param>
        /// <param name="period">0 : day, 1 : week, 2 : month (in future 3 : custom)</param>
        /// <param name="enddate">End date of period</param>
        /// <returns>Hinted users by gap</returns>
        [HttpGet]
        [ResponseType(typeof(int[]))]
        [CheckNullUser]
        public IHttpActionResult HintedUsers(string appid, byte period, DateTime enddate)
        {
            // Todo securize with session user id
            var list = this.Service.GetHintedUsers(appid, period, enddate.ToUniversalTime());
            return Ok(list);
        }

        /// <summary>
        /// Get the sum of hinted page in a period
        /// </summary>
        /// <param name="appid">Application code (* = all)</param>
        /// <param name="period">0 : day, 1 : week, 2 : month (in future 3 : custom)</param>
        /// <param name="enddate">End date of period</param>
        /// <returns>Hinted users by gap</returns>
        [HttpGet]
        [ResponseType(typeof(int[]))]
        [CheckNullUser]
        public IHttpActionResult HintedPages(string appid, byte period, DateTime enddate)
        {
            var list = this.Service.GetHintedPages(appid, period, enddate.ToUniversalTime());
            return Ok(list);
        }

        /// <summary>
        /// Get the sum of hinted page in a period
        /// </summary>
        /// <param name="appid">Application code (* = all)</param>
        /// <param name="period">0 : day, 1 : week, 2 : month (in future 3 : custom)</param>
        /// <param name="enddate">End date of period</param>
        /// <param name="count">Number of rows to send</param>
        /// <returns>Hinted users by gap</returns>
        [HttpGet]
        [ResponseType(typeof(NameValueIntPair[]))]
        [CheckNullUser]
        public async Task<IHttpActionResult> TopPages(string appid, byte period, DateTime enddate, int count = 10)
        {
             var list = await this.Service.GetTopPages(appid, period, enddate.ToUniversalTime(), count);
            return Ok(list);
        }

        /// <summary>
        /// Get the resume of techno hinted stat in a period
        /// </summary>
        /// <param name="appid">Application code (* = all)</param>
        /// <param name="period">0 : day, 1 : week, 2 : month (in future 3 : custom)</param>
        /// <param name="enddate">End date of period</param>
        /// <returns>Hinted users by gap</returns>
        [HttpGet]
        [ResponseType(typeof(HintedTechnoStats))]
        [CheckNullUser]
        public async Task<IHttpActionResult> TechnoStats(string appid, byte period, DateTime enddate)
        {
            try
            {
                var result = await this.Service.GetBrowsersStats(appid, period, enddate.ToUniversalTime());
                return Ok(result);
            }
            catch (Exception ex)
            {
                ErrorStore.LogExceptionWithoutContext(ex);
                return InternalServerError();
            }
        }
    }
}
