using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Did365App.Models
{
    public class TimeEntry :TableEntity
    {
        public string Subject { get; set; }

        public TimeEntry()
        {
            this.PartitionKey = "Default";
            this.RowKey = Guid.NewGuid().ToString();
            this.Subject = Guid.NewGuid().ToString();
        }
    }
}