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

        }

        public TimeEntry(string subject)
        {
            this.PartitionKey = "Default";
            this.RowKey = Guid.NewGuid().ToString();
            this.Subject = subject;
        }
    }
}