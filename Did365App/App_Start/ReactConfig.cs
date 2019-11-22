using JavaScriptEngineSwitcher.Core;
using JavaScriptEngineSwitcher.V8;
using React;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Did365App.ReactConfig), "Configure")]

namespace Did365App
{
	public static class ReactConfig
	{
		public static void Configure()
		{
            ReactSiteConfiguration.Configuration.AddScript("~/Content/js/App.jsx");

            JsEngineSwitcher.Current.DefaultEngineName = V8JsEngine.EngineName;
            JsEngineSwitcher.Current.EngineFactories.AddV8();
        }
	}
}