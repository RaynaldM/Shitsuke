using System;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using aspnet_mvc_helpers;
using LMS.Core.Domain;
using LMS.Core.Enums;
using LMS.Services;
using LMS.web.Helpers;
using LMS.web.Helpers.Api;
using LMS.web.Hub;
using LMS.web.Models;
using Microsoft.AspNet.SignalR;

namespace LMS.web.Api
{
    /// <summary>
    /// Web Api controller for feedback
    /// </summary>
    public class FeedbackController : BaseServiceApiController<FeedbackService>
    {
        /// <summary>
        /// Adda feedback from a user
        /// </summary>
        /// <param name="feedback">Feedback model</param>
        /// <returns>Http Status (usualy Ok)</returns>
        [HttpPost]
        [ResponseType(typeof(long))]
        [WebApiBasicAuthorize]
        [EnableCors("*", "*", "*")]
        public IHttpActionResult Post(FeedbackApiModel feedback)
        {
            if (feedback == null)
                return BadRequest("feedback data can not be null");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = this.Service.AddFeedback(feedback);
                if (result > 0)
                {
                    var hub = GlobalHost.ConnectionManager.GetHubContext<FeedbackHub>();
                    hub.Clients.All.refresh(result);
                    return Ok(result);
                }
                return StatusCode(HttpStatusCode.ServiceUnavailable);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Get the feedback list on an app
        /// </summary>
        /// <param name="id">Application code (* = all)</param>
        /// <param name="count">Number of rows to retrieve (default : 5)</param>
        /// <returns>Metrics and list</returns>
        [HttpGet]
        [ResponseType(typeof(IFeedBackDashboard))]
        [WebApiBasicAuthorize]
        public async Task<IHttpActionResult> ResumeList(string id, int count = 5)
        {
            var list = await this.Service.ResumeList(id, count);
            return Ok(list);
        }

        [HttpPost]
        [ResponseType(typeof(ReturnJBootGrid<IFeedbackListModel>))]
        [WebApiBasicAuthorize]
        public IHttpActionResult List(FeedbackGridParams parameters)
        {
            // Todo securize with session user id
            int total;
            var result = new ReturnJBootGrid<IFeedbackListModel>
            {
                current = parameters.current,
                rowCount = parameters.rowCount,
                rows = this.Service.List(parameters.appId,parameters.current, 
                        parameters.rowCount, parameters.sort,
                        parameters.searchPhrase, parameters.type,
                        parameters.status,out total),
                total = total
            };
            return Ok(result);
        }

        /// <summary>
        /// Get a feedback 
        /// </summary>
        /// <param name="id">Unique identifier of feedback</param>
        /// <returns>A complete feedback</returns>
        [HttpGet]
        [ResponseType(typeof(IFeedbackViewModel))]
        [WebApiBasicAuthorize]
        public IHttpActionResult Get(long id)
        {
            var feedback = this.Service.Get(id);
            return Ok(feedback);
        }

        /// <summary>
        /// Change a feedback status 
        /// </summary>
        /// <param name="id">Unique identifier of feedback</param>
        /// <param name="newStatus">The new status to save</param>
        /// <returns>True if done</returns>
        [HttpPut]
        [ResponseType(typeof(bool))]
        [WebApiBasicAuthorize]
        public IHttpActionResult SetStatus(long id, byte newStatus)
        {
            return Ok(this.Service.SetStatus(id, (FeedbackStatus)newStatus));
        }
    }
}

