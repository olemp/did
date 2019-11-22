using Did365App.Services;
using Microsoft.WindowsAzure.Storage.Table;
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
        public async Task<string> Get()
        {
            using (TableService tableService = new TableService("TimeEntries"))
            {
                return await tableService.Add();
            }
        }
    }
}
