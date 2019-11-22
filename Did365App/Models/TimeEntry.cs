using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;

namespace Did365App.Models
{
    public class TimeEntry : TableEntity
    {
        [JsonProperty(PropertyName = "subject", NullValueHandling = NullValueHandling.Ignore)]
        public string Subject { get; set; }

        public TimeEntry()
        {

            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
        }

        public TimeEntry(string subject)
        {
            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
            Subject = subject;
        }
    }
}