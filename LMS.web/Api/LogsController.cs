using System;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using aspnet_mvc_helpers;
using LMS.Core.Domain;
using LMS.Core.Models;
using LMS.Services;
using LMS.web.Helpers;
using LMS.web.Helpers.Api;
using Newtonsoft.Json;

namespace LMS.web.Api
{
    /// <summary>
    /// API controller used for receive and save logs
    /// </summary>
    public class LogsController : BaseServiceApiController<LogService>
    {
        /// <summary>
        /// Add a user ping (from JS) in database
        /// </summary>
        /// <param name="log"></param>
        /// <returns>Http Status (usualy Ok)</returns>
        [HttpPost]
        [ResponseType(typeof(void))]
        [WebApiBasicAuthorize]
        [EnableCors("*", "*", "*")]
        public IHttpActionResult Add([FromBody]dynamic log)
        {
            // todo : set the right class for log
            if (log == null)
                return BadRequest("Log data can not be null");
            try
            {
                var err = JsonConvert.DeserializeObject<BaseError>(log.ToString());
                if (err == null) return BadRequest("Log data can not be cast");
                return this.Service.Logs(err) > 0
               ? (IHttpActionResult)Ok()
               : StatusCode(HttpStatusCode.ServiceUnavailable);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [ResponseType(typeof(ReturnJBootGrid<ILogModel>))]
        [WebApiBasicAuthorize]
        public IHttpActionResult List(LogsGridParams parameters)
        {
            // Todo securize with session user id
            int total;
            var result = new ReturnJBootGrid<ILogModel>
            {
                current = parameters.current,
                rowCount = parameters.rowCount,
                rows =
                    this.Service.GetLogsList(parameters.appId, parameters.endDate, parameters.period,
                        parameters.current, parameters.rowCount, parameters.sort,
                        parameters.searchPhrase, out total),
                total = total
            };
            return Ok(result);
        }

        [HttpPost]
        [ResponseType(typeof(ReturnJBootGrid<IOccurenceModel>))]
        [WebApiBasicAuthorize]
        public IHttpActionResult Occurences(LogsGridParams parameters)
        {
            // Todo securize with session user id
            int total;
            var result = new ReturnJBootGrid<IOccurenceModel>
            {
                current = parameters.current,
                rowCount = parameters.rowCount,
                rows =
                    this.Service.GetOccurencesList(parameters.appId, parameters.endDate, parameters.period,
                        parameters.current, parameters.rowCount, parameters.sort,
                        parameters.searchPhrase, out total),
                total = total
            };
            return Ok(result);
        }

        [HttpGet]
        [ResponseType(typeof(IFullLogModel))]
        [WebApiBasicAuthorize]
        public IHttpActionResult GetById(long id)
        {
            var result = this.Service.GetLogById(id);
            return Ok(result);
        }

        [HttpGet]
        [ResponseType(typeof(IStatLogModel))]
        public IHttpActionResult StatById(long id)
        {
            var result = this.Service.GetStatById(id);
            return Ok(result);
        }

        [HttpGet]
        [ResponseType(typeof(long))]
        [WebApiBasicAuthorize]
        public IHttpActionResult GetIdByHash(int id)
        {
            var result = this.Service.GetIdByHash(id);
            return Ok(result);
        }
    }
}
