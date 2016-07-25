using System;
using System.Net;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using LMS.Services;
using LMS.Services.Models;
using LMS.web.Helpers.Api;

namespace LMS.web.Api
{
    /// <summary>
    /// Api for monitoring information
    /// </summary>
    public class MonitorController : BaseServiceApiController<UserPingsService>
    {
        /// <summary>
        /// Add a user ping (from JS) in database
        /// </summary>
        /// <param name="ping">User Ping object</param>
        /// <returns>Http Status (usualy Ok)</returns>
        [HttpPost]
        [ResponseType(typeof(void))]
        [WebApiBasicAuthorize]
        [EnableCors("*", "*", "*")]
        public IHttpActionResult Ping(UserPing ping)
        {
            if (ping == null)
                return BadRequest("ping data can not be null");
            if (!ping.IsValid)
                return BadRequest("UserId and ApplicationId are required");
            try
            {
                return this.Service.Ping(ping) > 0
                    ? (IHttpActionResult)Ok()
                    : StatusCode(HttpStatusCode.InternalServerError);
            }
            catch (Exception ex)
            {
                this.Logger.Error(ex,"Ping service");
                return StatusCode(HttpStatusCode.ServiceUnavailable);
            }

        }
    }
}
