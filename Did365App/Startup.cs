using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(Did365App.Startup))]

namespace Did365App
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
