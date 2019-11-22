using Did365App.Models;
using Did365App.Services;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Did365App.API
{
    public class ApprovedTimeEntriesController : ApiController
    {
        [Authorize]
        [HttpGet]
        public IEnumerable<ApprovedTimeEntry> Get()
        {
            TableService approvedTimeEntriesService = new TableService("ApprovedTimeEntries");
            return approvedTimeEntriesService.GetTable().ExecuteQuery(new TableQuery<ApprovedTimeEntry>()).ToList();
        }

        [HttpPost]
        [Authorize]
        public async Task<TableResult> Post(HttpRequestMessage request)
        {
            TableService approvedTimeEntriesService = new TableService("ApprovedTimeEntries");
            string content = await request.Content.ReadAsStringAsync();
            ApprovedTimeEntry entry = JsonConvert.DeserializeObject<ApprovedTimeEntry>(content);
            return await approvedTimeEntriesService.GetTable().ExecuteAsync(TableOperation.Insert(entry));
        }
    }
}
