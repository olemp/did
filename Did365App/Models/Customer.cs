using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;

namespace Did365App.Models
{
    public class Customer : TableEntity
    {
        [JsonProperty(PropertyName = "name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        public Customer()
        {

            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
        }

        public Customer(string name)
        {

            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
            Name = name;
        }
    }
}