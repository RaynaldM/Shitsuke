using System.Web.Http;
using System.Web.Http.Description;
using LMS.web.Helpers.Api;

namespace LMS.web.Api
{
    public class TestController : BaseApiController
    {
        /// <summary>
        /// Api Boolean Test
        /// </summary>
        /// <returns>True</returns>
        [HttpGet]
        [ResponseType(typeof(bool))]
        public IHttpActionResult Test()
        {
            return Ok(true);
        }

        /// <summary>
        /// Api Echo Test
        /// </summary>
        /// <param name="id">My echo</param>
        /// <returns>Alive + echo</returns>
        [HttpGet]
        [HttpPost]
        [ResponseType(typeof(string))]
        public IHttpActionResult Alive(string id)
        {
            return Ok(string.Format("Hey {0}, I'm alive", id));
        }

        // [HttpGet]
        //[ResponseType(typeof(ResultArticle))]
        //public async Task<IHttpActionResult> Get(Guid id)
        //{
        //    // ReSharper disable once PossibleInvalidOperationException
        //    var article = await this.Service.Read(UserId.Value, id);
        //    return Ok(article);
        //}
    }
}
