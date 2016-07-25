using System;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using aspnet_mvc_helpers;
using LMS.Core.Services;
using LMS.Services;
using LMS.web.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace LMS.web.Helpers
{
    [Authorize]
    public abstract class BaseController : GlobalController
    {
        protected BaseMvcApplication CurrentApplication
        {
            get { return HttpContext.ApplicationInstance as BaseMvcApplication; }
        }

        protected ILogger Logger
        {
            get { return this.CurrentApplication.Logger; }
        }

        private UserManager<ApplicationUser> _userManager;

        public UserManager<ApplicationUser> UserManager
        {
            get
            {
                // use owin factory
                return this._userManager ??
                       (this._userManager = HttpContext.GetOwinContext().Get<ApplicationUserManager>());
            }
        }

        private ApplicationDbContext _db;

        protected ApplicationDbContext DB
        {
            // use owin factory
            get { return this._db ?? (this._db = HttpContext.GetOwinContext().Get<ApplicationDbContext>()); }
        }

        private ApplicationUser _currentUser;

        public ApplicationUser CurrentUser
        {
            get
            {
                if (this._currentUser != null) return this._currentUser;
                var id = this.User.Identity.GetUserId();
                this._currentUser = this.UserManager.Users
                    .SingleOrDefault(p => p.Id == id);

                return this._currentUser;
            }
        }

        private Guid? _userId;

        public Guid? UserId
        {
            get
            {
                if (this.User.Identity == null || !this.User.Identity.IsAuthenticated)
                    return null;

                return this._userId ?? (this._userId = new Guid(this.User.Identity.GetUserId()));
            }
        }
        /// <summary>
        /// Get the current app choosen by user
        /// </summary>
        public string CurrentApplicationCode
        {
            get
            {
                var app = this.UserId != null ? new ExtendUserService().GetValue(this.UserId.Value, "app") : null;
                return string.IsNullOrEmpty(app) ? "*" : app;
            }
        }

        [HttpPost]
        public ActionResult SetUserParams(string id, string value)
        {
            try
            {
                if (this.UserId == null)
                    return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);

                new ExtendUserService().AddOrUpdate(this.UserId.Value, id, value);

                return new HttpStatusCodeResult(HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                this.Logger.Error(ex, "Update User > " + id);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet, NoCache]
        public ActionResult GetUserParams(string id)
        {
            try
            {
                if (this.UserId == null)
                    return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);

                string result = new ExtendUserService().GetValue(this.UserId.Value, id);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                this.Logger.Error(ex, "Get params User > " + id);
                return new HttpStatusCodeResult(HttpStatusCode.InternalServerError);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (this._userManager != null)
                {
                    this._userManager.Dispose();
                    this._userManager = null;
                }
                if (this._db != null)
                {
                    this._db.Database.Connection.Close();

                    this._db.Dispose();
                    this._db = null;
                }
            }

            base.Dispose(disposing);
        }

    }

    public abstract class BaseServiceController<T> : BaseController
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