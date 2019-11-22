using Did365App.Services;
using Did365App.Models;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace Did365App.API
{
    public class ProjectsController : ApiController
    {
        [Authorize]
        [HttpGet]
        public IEnumerable<Project> Get()
        {
            TableService tableService = new TableService("Projects");
            return tableService.GetTable().ExecuteQuery(new TableQuery<Project>()).ToList();
        }

        [Authorize]
        [HttpGet]
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        [Authorize]
        public async Task<TableResult> Post(HttpRequestMessage request)
        {
            TableService tableService = new TableService("Projects");
            string content = await request.Content.ReadAsStringAsync();
            Project project = JsonConvert.DeserializeObject<Project>(content);
            return await tableService.GetTable().ExecuteAsync(TableOperation.Insert(project));
        }
    }
}
