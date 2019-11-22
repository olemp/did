using Did365App.Services;
using System.Collections.Generic;
using System.Web.Http;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage.Table;
using Did365App.Models;
using System.Linq;
using System;

namespace Did365App.API
{
    public class EventsController : ApiController
    {
        [Authorize]
        [HttpGet]
        public async Task<IEnumerable<Event>> Get()
        {
            var outlook_events = await GraphService.GetOutlookEventsAsync();
            TableService approvedTimeEntriesService = new TableService("ApprovedTimeEntries");
            TableService projectsService = new TableService("Projects");
            var entries = approvedTimeEntriesService.GetTable().ExecuteQuery(new TableQuery<ApprovedTimeEntry>() { TakeCount = 100 }).ToList();
            var projects = projectsService.GetTable().ExecuteQuery(new TableQuery<Project>() { TakeCount = 100 }).ToList();
            var events = outlook_events.Select(e =>
            {
                var project = projects.Where(p => e.Body.Content.Contains(p.Key) || e.Categories.Contains(p.Key)).FirstOrDefault();

                return new Event()
                {
                    EventId = e.Id,
                    Subject = e.Subject,
                    StartTime = DateTime.Parse(e.Start.DateTime),
                    EndTime = DateTime.Parse(e.End.DateTime),
                    Project = project
                };
            }); ;
            return events;
        }
    }
}
