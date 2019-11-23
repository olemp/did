using Did365App.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Table;
using Did365App.Models;
using System.Linq;
using System;
using System.Net.Http;

namespace Did365App.API
{
    public class EventsController : ApiController
    {
        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<Event>> Get(HttpRequestMessage request)
        {
            var weekNumber = int.Parse(request.GetQueryNameValuePairs().Where(p => p.Key.Equals("weekNumber")).FirstOrDefault().Value);
            var outlook_events = await GraphService.GetOutlookEventsAsync(weekNumber);
            var entries = new ApprovedTimeEntriesService().Get();
            var projects = new ProjectsService().Get();
            var events = outlook_events
                .Where(e => !e.Body.Content.Contains("IGNORE") && !e.Categories.Contains("IGNORE") && !e.IsCancelled.Value && !e.IsAllDay.Value)
                .Select(e =>
            {
                var project = projects.Where(p => e.Subject.Contains(p.Key) || e.Body.Content.Contains(p.Key) || e.Categories.Contains(p.Key)).FirstOrDefault();
                var startTime = DateTime.Parse(e.Start.DateTime);
                var endTime = DateTime.Parse(e.End.DateTime);
                return new Event()
                {
                    EventId = e.Id,
                    Subject = e.Subject,
                    StartTime = startTime,
                    EndTime = endTime,
                    Project = project,
                    WebLink = e.WebLink,
                    Duration = ((endTime - startTime) as TimeSpan?).Value.TotalMinutes
                };
            }); ;
            return events;
        }
    }
}
