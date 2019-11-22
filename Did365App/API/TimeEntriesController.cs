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
    public class TimeEntriesController : ApiController
    {
        [Authorize]
        [HttpGet]
        public IEnumerable<TimeEntry> Get()
        {
            using (TableService tableService = new TableService("TimeEntries"))
            {
                return  tableService.GetTable().ExecuteQuery(new TableQuery<TimeEntry>()).ToList();
            }
        }


        //[HttpPost]
        //public async Task<string> Post([FromBody]string content)
        //{
        //    using (TableService tableService = new TableService("TimeEntries"))
        //    {
            
        //    }
        //}
    }
}
