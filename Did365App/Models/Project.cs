using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;

namespace Did365App.Models
{
    public class Project : TableEntity
    {
        [JsonProperty(PropertyName = "projectKey", NullValueHandling = NullValueHandling.Ignore)]
        public string ProjectKey { get; set; }
        [JsonProperty(PropertyName = "name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        public Project()
        {
            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
        }

        public Project(string projectKey, string name)
        {

            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
            ProjectKey = projectKey;
            Name = name;
        }
    }
}