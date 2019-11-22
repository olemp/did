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
            var projects = new ProjectsService().Get();
            return projects;
        }

        [HttpPost]
        [Authorize]
        public async Task<object> Post(HttpRequestMessage request)
        {
            string content = await request.Content.ReadAsStringAsync();
            Project project = JsonConvert.DeserializeObject<Project>(content);
            new ProjectsService().Add(project);
            return Ok();
        }
    }
}
