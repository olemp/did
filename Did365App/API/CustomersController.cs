using Did365App.Services;
using Did365App.Models;
using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace Did365App.API
{
    public class CustomersController : ApiController
    {
        [Authorize]
        [HttpGet]
        public IEnumerable<Customer> Get()
        {
            TableService tableService = new TableService("Customers");
            return tableService.GetTable().ExecuteQuery(new TableQuery<Customer>()).ToList();
        }

        [HttpPost]
        [Authorize]
        public async Task<TableResult> Post(HttpRequestMessage request)
        {
            TableService customertTableService = new TableService("Customers");
            string content = await request.Content.ReadAsStringAsync();
            Customer customer = JsonConvert.DeserializeObject<Customer>(content);
            return await customertTableService.GetTable().ExecuteAsync(TableOperation.Insert(customer));
        }
    }
}
