using Did365App.Services;
using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Did365App.Controllers
{
    public class EventsController : BaseController
    {
        [Authorize]
        public  ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public async Task<ActionResult> Week()
        {
            var events = await GraphService.GetEventsAsync();

            foreach (var ev in events)
            {
                ev.Start.DateTime = DateTime.Parse(ev.Start.DateTime).ToLocalTime().ToString();
                ev.Start.TimeZone = TimeZoneInfo.Local.Id;
                ev.End.DateTime = DateTime.Parse(ev.End.DateTime).ToLocalTime().ToString();
                ev.End.TimeZone = TimeZoneInfo.Local.Id;
            }

            return View(events);
        }
    }
}