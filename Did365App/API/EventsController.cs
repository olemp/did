using Did365App.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Threading.Tasks;

namespace Did365App.API
{
    public class EventsController : ApiController
    {
        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<Microsoft.Graph.Event>> Get()
        {
            var events = await GraphService.GetEventsAsync();
            return events;
        }
    }
}
