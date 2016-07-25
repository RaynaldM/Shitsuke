using LMS.Drivers.Core;
using ElmahError = Elmah.Error;

namespace LMS.Driver.Elmah.Models
{
    public class ErrorFromElmah : Error
    {
        public ErrorFromElmah(ElmahError error, string applicationName = null)
            : base(error.Exception, applicationName)
        {
            this.ErrorLevel=Core.Models.ErrorLevel.Error;
            this.SetContextProperties(error);
        }

        /// <summary>
        /// Sets Error properties pulled from HttpContext, if present
        /// </summary>
        /// <param name="context">The HttpContext related to the request</param>
        private void SetContextProperties(ElmahError context)
        {
            ServerVariables = context.ServerVariables;
            QueryString = context.QueryString;
            Form = context.Form;
            Cookies = context.Cookies;
        }
    }
}
