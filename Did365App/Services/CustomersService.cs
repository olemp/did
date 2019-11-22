using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Configuration;
using System.Threading.Tasks;
using Did365App.Models;
using System.Linq;
using System.Collections.Generic;

namespace Did365App.Services
{
    public class CustomersService : TableService
    {
        public CustomersService() : base("Customers")
        {

        }

        public IEnumerable<Customer> Get()
        {
            return GetTable().ExecuteQuery(new TableQuery<Customer>() { TakeCount = 100 }).ToList();
        }


        public TableResult Add(Customer customer)
        {
            return GetTable().Execute(TableOperation.Insert(customer));
        }
    }
}