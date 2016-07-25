using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Description;
using LMS.Core.Domain;
using LMS.Services;
using LMS.web.Helpers.Api;

namespace LMS.web.Api
{
    public class ApplicationsController : BaseServiceApiController<ApplicationsService>
    {
        [HttpGet]
        [ResponseType(typeof(IEnumerable<IApplicationModel>))]
        [Route("api/apps/list")]
        [WebApiBasicAuthorize]
        public IHttpActionResult List()
        {
              return Ok(this.Service.GetApplicationsList());
        }       
    }
}
