using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;

namespace Did365App.Models
{
    public class Project : TableEntity
    {

        [JsonProperty(PropertyName = "customerKey", NullValueHandling = NullValueHandling.Ignore)]
        public string CustomerKey { get; set; }

        [JsonProperty(PropertyName = "projectKey", NullValueHandling = NullValueHandling.Ignore)]
        public string ProjectKey { get; set; }

        [JsonProperty(PropertyName = "name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        public Project()
        {
            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
        }

        public Project(string customerKey, string projectKey, string name)
        {

            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
            CustomerKey = customerKey;
            ProjectKey = projectKey;
            Name = name;
        }

        public string Key { get { return $"{CustomerKey} {ProjectKey}"; } }
    }
}