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
    public class ApprovedTimeEntriesService : TableService
    {
        public ApprovedTimeEntriesService() : base("ApprovedTimeEntries")
        {
          
        }

        public IEnumerable<ApprovedTimeEntry> Get()
        {
            return GetTable().ExecuteQuery(new TableQuery<ApprovedTimeEntry>() { TakeCount = 100 }).ToList();
        }
    }
}