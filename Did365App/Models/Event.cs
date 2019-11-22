using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;

namespace Did365App.Models
{
    public class Event : ApprovedTimeEntry
    {
        public Project Project { get; set; }

        public Event()
        {
        }
    }
}