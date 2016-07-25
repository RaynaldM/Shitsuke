using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using LMS.Web.Sample.Models;

namespace LMS.Web.Sample.Helpers
{
    [Authorize]
    public class BaseController : Controller
    {

        protected BaseMvcApplication CurrentApplication
        {
            get { return HttpContext.ApplicationInstance as BaseMvcApplication; }
        }

        private UserManager<ApplicationUser> _userManager;

        // use owin factory
        public UserManager<ApplicationUser> UserManager
        {
            get
            {
                return this._userManager ??
                       (this._userManager = HttpContext.GetOwinContext().Get<ApplicationUserManager>());
            }
        }

        private ApplicationDbContext _db;

        protected ApplicationDbContext DB
        {
            get
            {
                return this._db ??
                       (this._db = HttpContext.GetOwinContext().Get<ApplicationDbContext>());
            }
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
                if (this.User == null || this.User.Identity == null || !this.User.Identity.IsAuthenticated)
                    return null;

                return this._userId ?? (this._userId = new Guid(this.User.Identity.GetUserId()));
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
}