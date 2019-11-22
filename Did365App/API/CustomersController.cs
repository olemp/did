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
            var customers = new CustomersService().Get();
            return customers;
        }

        [HttpPost]
        [Authorize]
        public async Task<object> Post(HttpRequestMessage request)
        {
            string content = await request.Content.ReadAsStringAsync();
            Customer customer = JsonConvert.DeserializeObject<Customer>(content);
            new CustomersService().Add(customer);
            return Ok();
        }
    }
}
