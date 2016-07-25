using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(LMS.Web.Sample.Startup))]
namespace LMS.Web.Sample
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
