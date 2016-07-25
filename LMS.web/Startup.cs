using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(LMS.web.Startup))]
namespace LMS.web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }

    }
}
