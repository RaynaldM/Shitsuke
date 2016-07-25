using System;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;

namespace LMS.web.Helpers.Api
{
    enum WebApiBasicAuthStatus
    {
        InvalidToken,
        InvalidUser,
        Unauthorize,
        Authorise
    }

    /// <summary>
    /// Very basic authorise mechanism 
    /// todo : should be replace by a real oauth2 owin authorize
    /// http://bitoftech.net/2014/06/01/token-based-authentication-asp-net-web-api-2-owin-asp-net-identity/ step 10
    ///  http://bitoftech.net/2015/02/16/implement-oauth-json-web-tokens-authentication-in-asp-net-web-api-and-identity-2/
    ///  http://www.asp.net/web-api/overview/security/individual-accounts-in-web-api
    /// </summary>
    public class WebApiBasicAuthorize : System.Web.Http.AuthorizeAttribute
    {
        private WebApiBasicAuthStatus _status;
        private Guid _authenticationToken;

        // Code from http://www.codeproject.com/Tips/376810/ASP-NET-WEB-API-Custom-Authorize-and-Exception-Han

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            this.SetIsAuthorized(actionContext);
            switch (_status)
            {
                case WebApiBasicAuthStatus.Unauthorize:

                    HttpContext.Current.Response.AddHeader("AuthorizationStatus", "NotAuthorized");
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Forbidden);
                    return;
                case WebApiBasicAuthStatus.Authorise:
                    HttpContext.Current.Response.AddHeader("AuthorizationStatus", "Authorized");
                    return;
                default:
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.ExpectationFailed);
                    actionContext.Response.ReasonPhrase = "Please provide valid inputs";
                    break;

            }
        }

        private void SetIsAuthorized(HttpActionContext actionContext)
        {
            // var authenticationTokens = actionContext.Request.Headers.Contains("authenticationToken") ?
            //actionContext.Request.Headers.GetValues("authenticationToken").ToArray() : null;
            if (actionContext.Request.Headers.Authorization == null)
            {
                var ctrl = (BaseApiController)actionContext.ControllerContext.Controller;
                this._status = ctrl.UserId != null ? 
                    WebApiBasicAuthStatus.Authorise : // Authorise because we are in internal conext : user is know
                    WebApiBasicAuthStatus.InvalidToken;
                return;
            }
            var scheme = actionContext.Request.Headers.Authorization.Scheme;
            var authenticationTokens = actionContext.Request.Headers.Authorization.Parameter;

            if (scheme != null && scheme == "lmstoken" &&
                authenticationTokens != null)
            {
                // get value from header

                if (Guid.TryParse(authenticationTokens, out this._authenticationToken))
                {
                    var app = HttpContext.Current.ApplicationInstance as BaseMvcApplication;

                    // ReSharper disable once PossibleNullReferenceException
                    var authenticationTokenPersistant = app.BasicBearer;
                    // it is saved in some data store
                    // i will compare the authenticationToken sent by client with
                    // authenticationToken persist in database against specific user, and act accordingly
                    if (authenticationTokenPersistant != this._authenticationToken)
                    {
                        this._status = WebApiBasicAuthStatus.Unauthorize;
                        return;
                    }
                    this._status = WebApiBasicAuthStatus.Authorise;
                    return;
                }
            }
            this._status = WebApiBasicAuthStatus.InvalidToken;
        }
    }
}