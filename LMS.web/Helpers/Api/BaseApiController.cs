using System;
using System.Web;
using System.Web.Http;
using LMS.Core.Services;
using Microsoft.AspNet.Identity;

namespace LMS.web.Helpers.Api
{
    public abstract class BaseApiController : ApiController
    {
        protected BaseMvcApplication CurrentApplication
        {
            get { return HttpContext.Current.ApplicationInstance as BaseMvcApplication; }
        }

        public ILogger Logger
        {
            get { return this.CurrentApplication.Logger; }
        }


        // Use for internal user (api calls by app itself)
        private Guid? _userId;

        public Guid? UserId
        {
            get
            {
                if (this.User == null || this.User.Identity == null || !this.User.Identity.IsAuthenticated)
                    return null;

                return this._userId ?? (this._userId = new Guid(this.User.Identity.GetUserId()));
            }
        }
    }


    public abstract class BaseServiceApiController<T> : BaseApiController
        where T : class, IBaseService, IDisposable, new()
    {
        private T _service;

        protected T Service
        {
            get { return _service ?? (_service = new T { LogService = this.Logger }); }
        }

        protected override void Dispose(bool disposing)
        {
            if (this._service != null)
                this._service.Dispose();

            base.Dispose(disposing);
        }
    }

}