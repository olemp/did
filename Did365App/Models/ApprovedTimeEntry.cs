using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;

namespace Did365App.Models
{
    public class ApprovedTimeEntry : TableEntity
    {
        [JsonProperty(PropertyName = "eventId", NullValueHandling = NullValueHandling.Ignore)]
        public string EventId { get; set; }

        [JsonProperty(PropertyName = "subject", NullValueHandling = NullValueHandling.Ignore)]
        public string Subject { get; set; }

        [JsonProperty(PropertyName = "projectKey", NullValueHandling = NullValueHandling.Ignore)]
        public string ProjectKey { get; set; }

        [JsonProperty(PropertyName = "customerKey", NullValueHandling = NullValueHandling.Ignore)]
        public string CustomerKey { get; set; }

        [JsonProperty(PropertyName = "startTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime StartTime { get; set; }

        [JsonProperty(PropertyName = "endTime", NullValueHandling = NullValueHandling.Ignore)]
        public DateTime EndTime { get; set; }

        public ApprovedTimeEntry()
        {

            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
        }

        public ApprovedTimeEntry(string eventId, string subject)
        {
            PartitionKey = "Default";
            RowKey = Guid.NewGuid().ToString();
            EventId = eventId;
            Subject = subject;
        }
    }
}